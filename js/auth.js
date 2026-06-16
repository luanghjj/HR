// ═══════════════════════════════════════════════════════════
// OKYU HRM – Authentication Module
// ═══════════════════════════════════════════════════════════

/**
 * Load custom permissions from user_permissions table
 * Attaches _permMode, _customPerms, _allowedLocations, _allowedDepts to currentUser
 */
async function loadUserPermissions() {
  if (!currentUser) return;
  try {
    const { data: permData, error } = await sb.from('user_permissions')
      .select('mode, permissions, allowed_locations, allowed_depts')
      .eq('user_id', currentUser.id)
      .maybeSingle();  // Won't throw if no row found

    if (error) {
      console.warn('[Auth] Permission query error:', error.message);
      currentUser._permMode = 'standard';
      return;
    }

    if (permData) {
      currentUser._permMode = permData.mode;  // 'standard' | 'custom'
      currentUser._customPerms = permData.permissions || {};
      currentUser._allowedLocations = permData.allowed_locations || ['all'];
      currentUser._allowedDepts = permData.allowed_depts || ['all'];
      console.log('[Auth] ✓ Permissions loaded:', {
        mode: permData.mode,
        perms: permData.permissions,
        locations: permData.allowed_locations,
        depts: permData.allowed_depts
      });
    } else {
      console.log('[Auth] No custom permissions row found for', currentUser.id, '→ using role defaults');
      currentUser._permMode = 'standard';
      currentUser._customPerms = null;
      currentUser._allowedLocations = ['all'];
      currentUser._allowedDepts = ['all'];
    }
  } catch (e) {
    console.error('[Auth] Permission loading failed:', e);
    currentUser._permMode = 'standard';
  }
}

/**
 * Login with Supabase Auth
 * Falls back to demo mode if Supabase is not configured
 */
async function doLogin() {
  const loginError = document.getElementById('loginError');
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPass');
  const loginBtn = document.getElementById('loginBtn');

  const email = emailInput.value.trim();
  const password = passInput.value;

  if (!email || !password) {
    loginError.textContent = 'Bitte E-Mail und Passwort eingeben';
    loginError.style.display = 'block';
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  loginBtn.textContent = 'Anmelden...';
  loginError.style.display = 'none';

  try {
    // Try Supabase auth first
    const { data: authData, error: authError } = await sb.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) {
      // If Supabase auth fails, show error
      loginError.textContent = 'Ungültige Anmeldedaten: ' + authError.message;
      loginError.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Anmelden';
      return;
    }

    // Fetch user profile from user_profiles table
    let { data: profile, error: profileError } = await sb
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .maybeSingle();

    // Kein verknüpftes Profil → vorautorisierte Einladung per E-Mail beanspruchen
    if (!profile) {
      const loginMail = (authData.user.email || email || '').trim().toLowerCase();
      if (loginMail) {
        const { data: invite } = await sb.from('user_profiles')
          .select('*').ilike('reg_email', loginMail).is('auth_user_id', null).maybeSingle();
        if (invite) {
          const { error: claimErr } = await sb.from('user_profiles')
            .update({ auth_user_id: authData.user.id, status: 'active' })
            .eq('user_id', invite.user_id);
          if (!claimErr) {
            profile = { ...invite, auth_user_id: authData.user.id, status: 'active' };
            console.log('[Auth] ✓ Einladung beim Login beansprucht:', loginMail);
          }
        }
      }
    }

    if (profileError || !profile) {
      loginError.textContent = 'Benutzerprofil nicht gefunden. Bitte Admin kontaktieren.';
      loginError.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Anmelden';
      await sb.auth.signOut();
      return;
    }

    // Check if account is pending approval (employee status = inactive/pending)
    if (profile.emp_id) {
      const { data: empCheck } = await sb.from('employees').select('status').eq('id', profile.emp_id).maybeSingle();
      if (empCheck && ['inactive','inaktiv','pending'].includes(empCheck.status)) {
        await sb.auth.signOut();
        document.getElementById('loginSupabase').style.display = 'none';
        document.getElementById('loginRegister').style.display = 'none';
        document.getElementById('loginPending').style.display = 'block';
        document.querySelector('.login-tabs').style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Anmelden';
        return;
      }
    }

    // Set current user from profile
    currentUser = {
      id: profile.user_id,
      name: profile.name,
      role: profile.role,
      location: profile.location,
      avatar: profile.avatar,
      empId: profile.emp_id,
      lastLogin: new Date().toLocaleDateString('de-DE'),
      status: 'active'
    };

    // Load custom permissions from user_permissions table
    await loadUserPermissions();

    // Set location
    if (currentUser.location !== 'all') {
      currentLocation = currentUser.location;
    } else {
      currentLocation = 'all';
    }

    // Transition to app
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').innerHTML =
      currentUser.role === 'inhaber' ? 'Geschäftsführung' :
      currentUser.role === 'manager' ? 'Manager – ' + getLocationName(currentUser.location) :
      EMPS.find(e => e.id === currentUser.empId)?.position || 'Mitarbeiter';
    document.getElementById('userAvatar').textContent = currentUser.avatar;

    buildSidebar();
    showLoading('Daten werden geladen...');
    await loadDataFromSupabase();
    buildLocationSelect();
    hideLoading();
    initApp();

    console.log('[Auth] ✓ Login successful:', currentUser.name, '(' + currentUser.role + ')');

  } catch (e) {
    console.error('[Auth] Login error:', e);
    loginError.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
    loginError.style.display = 'block';
  }

  loginBtn.disabled = false;
  loginBtn.textContent = 'Anmelden';
}

/**
 * Self-registration for new employees
 * Creates auth user + user_profile with status 'pending'
 * Admin must approve before user can login
 */
async function doRegister() {
  const loginError = document.getElementById('loginError');
  const regBtn = document.getElementById('regBtn');
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPass').value;
  const location = document.getElementById('regLocation').value;
  const birthday = document.getElementById('regBirthday').value;
  const dept = document.getElementById('regDept').value;
  const position = document.getElementById('regPosition').value.trim();

  if (!name || !email || !password) {
    loginError.textContent = 'Bitte alle Pflichtfelder ausfüllen';
    loginError.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    loginError.textContent = 'Passwort muss mindestens 6 Zeichen haben';
    loginError.style.display = 'block';
    return;
  }

  regBtn.disabled = true;
  regBtn.textContent = 'Konto wird erstellt...';
  loginError.style.display = 'none';

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name }
      }
    });

    if (authError) {
      loginError.textContent = 'Registrierung fehlgeschlagen: ' + authError.message;
      loginError.style.display = 'block';
      regBtn.disabled = false;
      regBtn.textContent = 'Konto erstellen';
      return;
    }

    // 2. Vorautorisierte Einladung per E-Mail beanspruchen?
    const { data: invite } = await sb.from('user_profiles')
      .select('*').ilike('reg_email', email.toLowerCase()).is('auth_user_id', null).maybeSingle();

    if (invite) {
      await sb.from('user_profiles')
        .update({ auth_user_id: authData.user.id, status: 'active' })
        .eq('user_id', invite.user_id);
      console.log('[Auth] ✓ Einladung beansprucht (Registrierung):', email);
      if (authData.session) {
        location.reload();   // direkt eingeloggt → App via Session-Check laden
        return;
      }
      // E-Mail-Bestätigung nötig
      await sb.auth.signOut().catch(() => {});
      loginError.textContent = 'Konto erstellt. Bitte E-Mail bestätigen und dann einloggen.';
      loginError.style.color = 'var(--success)';
      loginError.style.display = 'block';
      if (typeof switchLoginMode === 'function') switchLoginMode('supabase');
      regBtn.disabled = false; regBtn.textContent = 'Konto erstellen';
      return;
    }

    // 3. Keine Einladung → pending Profil (Admin verknüpft später)
    const avatar = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const userId = 'emp_' + name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const { error: profError } = await sb.from('user_profiles').insert({
      auth_user_id: authData.user.id,
      user_id: userId,
      name: name,
      role: 'mitarbeiter',
      location: location,
      avatar: avatar,
      emp_id: null,
      status: 'pending',
      reg_birthday: birthday || null,
      reg_dept: dept,
      reg_position: position || 'Mitarbeiter',
      reg_email: email
    });

    if (profError) {
      console.warn('[Auth] Profile creation error:', profError.message);
    }

    // Sign out (don't auto-login) and show pending screen
    await sb.auth.signOut();

    document.getElementById('loginSupabase').style.display = 'none';
    document.getElementById('loginRegister').style.display = 'none';
    document.getElementById('loginPending').style.display = 'block';
    document.querySelector('.login-tabs').style.display = 'none';

    console.log('[Auth] ✓ Registration submitted (pending):', name);

  } catch (e) {
    console.error('[Auth] Registration error:', e);
    loginError.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
    loginError.style.display = 'block';
  }

  regBtn.disabled = false;
  regBtn.textContent = 'Konto erstellen';
}

/**
 * Demo login (fallback for development)
 * Uses dropdown selector + "demo" password
 */
async function doLoginDemo() {
  const uid = document.getElementById('loginUser')?.value;
  const pass = document.getElementById('loginPassDemo')?.value || document.getElementById('loginPass')?.value;

  if (!uid || pass !== 'demo') {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginError').textContent = 'Ungültige Anmeldedaten';
    return;
  }

  currentUser = USERS.find(u => u.id === uid);
  if (!currentUser) {
    document.getElementById('loginError').style.display = 'block';
    return;
  }

  if (currentUser.location !== 'all') currentLocation = currentUser.location;
  else currentLocation = 'all';

  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userRole').innerHTML =
    currentUser.role === 'inhaber' ? 'Geschäftsführung' :
    currentUser.role === 'manager' ? 'Manager – ' + getLocationName(currentUser.location) :
    EMPS.find(e => e.id === currentUser.empId)?.position || 'Mitarbeiter';
  document.getElementById('userAvatar').textContent = currentUser.avatar;

  buildSidebar();
  await loadDataFromSupabase();
  buildLocationSelect();
  initApp();
}

/**
 * Logout – signs out from Supabase and returns to login screen
 */
async function doLogout() {
  try {
    // Cleanup Realtime channels before signing out
    if (typeof unsubscribeRealtime === 'function') unsubscribeRealtime();
    await sb.auth.signOut();
    hideLoading();
  } catch (e) {
    // Ignore signout errors (might be demo mode)
  }
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  // Clear password fields
  const passField = document.getElementById('loginPass');
  if (passField) passField.value = '';
  const emailField = document.getElementById('loginEmail');
  if (emailField) emailField.value = '';
  document.getElementById('loginError').style.display = 'none';
  currentUser = null;
}

/**
 * Check if user is already logged in (session persistence)
 */
async function checkExistingSession() {
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      let { data: profile } = await sb
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();

      // Kein verknüpftes Profil → versuche, ein vom Admin VORAUTORISIERTES
      // Profil per E-Mail zu beanspruchen (Einladung). KEIN automatisches
      // Anlegen eines Mitarbeiters mehr.
      if (!profile) {
        const user = session.user;
        const email = (user.email || '').trim().toLowerCase();
        let claimed = null;
        if (email) {
          const { data: preauth } = await sb.from('user_profiles')
            .select('*').ilike('reg_email', email).is('auth_user_id', null).maybeSingle();
          if (preauth) {
            const { error: claimErr } = await sb.from('user_profiles')
              .update({ auth_user_id: user.id, status: 'active' })
              .eq('user_id', preauth.user_id);
            if (!claimErr) {
              claimed = { ...preauth, auth_user_id: user.id, status: 'active' };
              console.log('[Auth] ✓ Zugang per E-Mail beansprucht:', email);
            }
          }
        }
        if (claimed) {
          profile = claimed; // weiter mit normalem Login unten
        } else {
          // Nicht freigeschaltet → abmelden + Hinweis (kein Auto-Anlegen)
          hideLoading();
          await sb.auth.signOut();
          document.getElementById('loginScreen').classList.remove('hidden');
          document.getElementById('app').classList.add('hidden');
          const le = document.getElementById('loginError');
          if (le) {
            le.textContent = 'Diese E-Mail ist nicht freigeschaltet. Bitte den Admin kontaktieren.';
            le.style.display = 'block';
          }
          return true; // Login-Formular bleibt sichtbar
        }
      }

      // Profile exists — check if employee is still inactive (pending approval)
      if (profile.emp_id) {
        const { data: emp } = await sb.from('employees').select('status').eq('id', profile.emp_id).maybeSingle();
        if (emp && ['inactive','inaktiv','pending'].includes(emp.status)) {
          hideLoading();
          document.getElementById('loginSupabase').style.display = 'none';
          document.getElementById('loginRegister').style.display = 'none';
          document.getElementById('loginPending').style.display = 'block';
          document.querySelector('.login-tabs').style.display = 'none';
          return true;
        }
      }

      // Profile OK — restore session
      currentUser = {
        id: profile.user_id,
        name: profile.name,
        role: profile.role,
        location: profile.location,
        avatar: profile.avatar,
        empId: profile.emp_id,
        lastLogin: new Date().toLocaleDateString('de-DE'),
        status: 'active'
      };

      // Load custom permissions
      await loadUserPermissions();

      if (currentUser.location !== 'all') currentLocation = currentUser.location;
      else currentLocation = 'all';

      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('userName').textContent = currentUser.name;
      document.getElementById('userRole').innerHTML =
        currentUser.role === 'inhaber' ? 'Geschäftsführung' :
        currentUser.role === 'manager' ? 'Manager – ' + getLocationName(currentUser.location) :
        EMPS.find(e => e.id === currentUser.empId)?.position || 'Mitarbeiter';
      document.getElementById('userAvatar').textContent = currentUser.avatar;

      buildSidebar();
      showLoading('Sitzung wird wiederhergestellt...');
      await loadDataFromSupabase();
      buildLocationSelect();
      hideLoading();
      initApp();

      console.log('[Auth] ✓ Session restored:', currentUser.name);
      return true;
    }
  } catch (e) {
    console.log('[Auth] No existing session:', e);
  }
  return false;
}

// ═══ GOOGLE OAUTH LOGIN ═══
async function doGoogleLogin() {
  try {
    const loginError = document.getElementById('loginError');
    loginError.style.display = 'none';

    // Determine redirect URL (Vercel production or localhost)
    const redirectTo = window.location.origin + window.location.pathname;
    console.log('[Auth] Google OAuth redirectTo:', redirectTo);

    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo
      }
    });

    if (error) {
      console.error('[Auth] Google OAuth error:', error);
      loginError.textContent = 'Google-Anmeldung fehlgeschlagen: ' + error.message;
      loginError.style.display = 'block';
    }
  } catch (e) {
    console.error('[Auth] Google login error:', e);
  }
}

// Enter key to login
document.addEventListener('DOMContentLoaded', () => {
  const passField = document.getElementById('loginPass');
  if (passField) {
    passField.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
  const emailField = document.getElementById('loginEmail');
  if (emailField) {
    emailField.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('loginPass').focus();
    });
  }
  // Fehlermeldung ausblenden, sobald der Nutzer erneut tippt
  ['loginEmail', 'loginPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const le = document.getElementById('loginError');
      if (le && le.style.display !== 'none') le.style.display = 'none';
    });
  });

  // Show loading overlay immediately on page load
  showLoading('Verbindung wird hergestellt...');

  // QR Check-in: save URL params before login if not logged in yet
  const qrParams = new URLSearchParams(window.location.search);
  const qrLoc = qrParams.get('checkin');
  const qrKey = qrParams.get('key');
  if (qrLoc && qrKey) {
    sessionStorage.setItem('pendingCheckin', qrLoc);
    sessionStorage.setItem('pendingCheckinKey', qrKey);
    console.log('[QR] Check-in params saved for after login:', qrLoc);
  }

  // Check for existing session; hide loading if no session found
  checkExistingSession().then(hasSession => {
    if (!hasSession) {
      // No session → show login screen
      hideLoading();
    }
    // If session exists, hideLoading() is called inside checkExistingSession()
  }).catch(() => {
    hideLoading();
  });
});
