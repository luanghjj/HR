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
    const { data: profile, error: profileError } = await sb
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (profileError || !profile) {
      loginError.textContent = 'Benutzerprofil nicht gefunden. Bitte Admin kontaktieren.';
      loginError.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Anmelden';
      await sb.auth.signOut();
      return;
    }

    // Check if account is pending approval (employee status = inactive)
    if (profile.emp_id) {
      const { data: empCheck } = await sb.from('employees').select('status').eq('id', profile.emp_id).maybeSingle();
      if (empCheck && empCheck.status === 'inactive') {
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
    buildLocationSelect();
    showLoading('Daten werden geladen...');
    await loadDataFromSupabase();
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

    // 2. Create user profile with status='pending'
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

    // 3. Sign out (don't auto-login) and show pending screen
    await sb.auth.signOut();

    // Show pending confirmation
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
  buildLocationSelect();
  await loadDataFromSupabase();
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
      const { data: profile } = await sb
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();

      // No profile found — auto-create for Google OAuth users
      if (!profile) {
        const user = session.user;
        const isGoogle = user.app_metadata?.provider === 'google' || user.identities?.some(i => i.provider === 'google');

        if (isGoogle) {
          // Extract name from Google metadata
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
          const avatar = googleName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
          const userId = 'google_' + googleName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) + '_' + Date.now().toString(36);

          // First create employee entry (id is auto-increment)
          const newEmp = {
            name: googleName,
            position: 'Neu',
            dept: 'Service',
            location: 'origami',
            status: 'inactive',
            start_date: new Date().toISOString().slice(0, 10),
            avatar: avatar,
            vac_total: 26,
            vac_used: 0,
            sick_days: 0,
            late_count: 0
          };

          const { data: empData, error: empErr } = await sb.from('employees').insert(newEmp).select('id').single();
          if (empErr) console.error('[Auth] Employee create error:', empErr);

          const empId = empData?.id || null;

          // Create user_profiles entry
          const newProfile = {
            user_id: userId,
            auth_user_id: user.id,
            name: googleName,
            role: 'mitarbeiter',
            location: 'origami',
            avatar: avatar,
            emp_id: empId
          };

          const { error: profErr } = await sb.from('user_profiles').insert(newProfile);
          if (profErr) console.error('[Auth] Profile create error:', profErr);

          console.log('[Auth] ✓ Google user auto-registered:', googleName, '(pending, emp_id:', empId, ')');
        }

        // Show pending screen
        hideLoading();
        document.getElementById('loginSupabase').style.display = 'none';
        document.getElementById('loginRegister').style.display = 'none';
        document.getElementById('loginPending').style.display = 'block';
        document.querySelector('.login-tabs').style.display = 'none';
        return true; // Prevent showing login form
      }

      // Profile exists — check if employee is still inactive (pending approval)
      if (profile.emp_id) {
        const { data: emp } = await sb.from('employees').select('status').eq('id', profile.emp_id).maybeSingle();
        if (emp && emp.status === 'inactive') {
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
      buildLocationSelect();
      showLoading('Sitzung wird wiederhergestellt...');
      await loadDataFromSupabase();
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
