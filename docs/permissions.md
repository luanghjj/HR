# OKYU HRM – Berechtigungssystem

## Übersicht

Das System verwendet ein **Hybrid-Modell**:
1. **Standard nach Rolle** → Vordefinierte Berechtigungen pro Rolle
2. **Individuell anpassen** → Custom Permissions pro User (via SuperAdmin)

---

## Rollen

| Rolle | Beschreibung | Standard-Zugriff |
|-------|-------------|-----------------|
| `inhaber` | Geschäftsführer | Vollzugriff (alle 16 Permissions) |
| `manager` | Filialleiter | Personal & Planung (12 Permissions) |
| `mitarbeiter` | Angestellter | Nur eigene Daten (1 Permission) |
| `azubi` | Auszubildender | Eigene Daten + Ausbildung (1 Permission) |

---

## 16 Permission Keys

### ÜBERSICHT
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeFinancials` | Finanzen sichtbar | ✅ | ❌ | ❌ | ❌ |

### MITARBEITER
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeAllEmployees` | Alle Mitarbeiter sehen | ✅ | ✅ | ❌ | ❌ |
| `editEmployees` | Mitarbeiter bearbeiten | ✅ | ✅ | ❌ | ❌ |
| `editVacDays` | Urlaubstage verwalten | ✅ | ❌ | ❌ | ❌ |
| `editTraining` | Fortbildung verwalten | ✅ | ❌ | ❌ | ❌ |
| `markLate` | Verspätung vermerken | ✅ | ✅ | ❌ | ❌ |

### DIENSTPLAN
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeAllSchedules` | Alle Dienstpläne sehen | ✅ | ✅ | ❌ | ❌ |
| `editSchedules` | Schichten bearbeiten | ✅ | ✅ | ❌ | ❌ |
| `canExport` | Export (PDF/CSV) | ✅ | ✅ | ❌ | ❌ |

### URLAUB & KRANK
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeAllVacations` | Alle Urlaubsanträge | ✅ | ✅ | ❌ | ❌ |
| `approveVacations` | Urlaub genehmigen | ✅ | ✅ | ❌ | ❌ |
| `seeAllSick` | Alle Krankmeldungen | ✅ | ✅ | ❌ | ❌ |

### BEREICHE & DOKUMENTE
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeDepartments` | Bereiche sehen | ✅ | ✅ | ✅ | ✅ |
| `seeAllDocs` | Alle Dokumente | ✅ | ✅ | ❌ | ❌ |

### ADMINISTRATION
| Key | Label | Inhaber | Manager | MA | Azubi |
|-----|-------|:-------:|:-------:|:--:|:-----:|
| `seeAllLocations` | Alle Standorte | ✅ | ❌ | ❌ | ❌ |
| `manageAccess` | Zugangsverwaltung | ✅ | ❌ | ❌ | ❌ |

---

## Permission → Sidebar Mapping

| Permission | Sidebar-Tab |
|-----------|-------------|
| *(immer)* | Dashboard |
| `seeAllEmployees` | Mitarbeiter |
| `seeDepartments` | Bereiche, Checklisten |
| `seeAllSchedules` | Arbeitsplan |
| `seeAllVacations` | Urlaubsplan (sonst: Mein Urlaub) |
| `seeAllSick` | Krankmeldungen (sonst: Meine) |
| `seeAllDocs` | Unterlagen (sonst: Meine) |
| `editTraining` | Ausbildung |
| `canExport` | Berichte |
| `manageAccess` | Zugangsverwaltung, QR Check-in |

---

## Technische Implementierung

### Datenbank: `user_permissions`
```sql
user_id           TEXT UNIQUE     -- Referenz auf user_profiles
mode              TEXT            -- 'standard' | 'custom'
permissions       JSONB           -- {"seeAllEmployees": true, ...}
allowed_locations JSONB           -- ["origami", "enso"] oder ["all"]
allowed_depts     JSONB           -- ["Küche", "Service"] oder ["all"]
```

### Code: `can()` Funktion
```javascript
// js/permissions.js
function can(perm) {
  if (!currentUser) return false;
  // Custom mode → use JSONB permissions
  if (currentUser._permMode === 'custom' && currentUser._customPerms) {
    return !!currentUser._customPerms[perm];
  }
  // Standard → use role defaults
  return !!PERMS[currentUser.role]?.[perm];
}
```

### Laden beim Login (auth.js)
```javascript
async function loadUserPermissions() {
  const { data } = await sb.from('user_permissions')
    .select('mode, permissions, allowed_locations, allowed_depts')
    .eq('user_id', currentUser.id).single();
  if (data) {
    currentUser._permMode = data.mode;
    currentUser._customPerms = data.permissions;
    currentUser._allowedLocations = data.allowed_locations;
  }
}
```

### Verwaltung: SuperAdmin `_sa.html`
- Tab "Benutzer" → User-Liste → Click → Permission-Panel
- Standard/Custom Radio → Checkboxen pro Gruppe → Standort-Pills
- Speichern → UPSERT `user_permissions`
