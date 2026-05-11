#!/usr/bin/env python3
"""
Script: sync_bank_from_hrm.py
Import bank data from HRM Manager → OKYU HRM employees.bank column
Run AFTER: ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank TEXT DEFAULT '';
"""
import urllib.request, json, time

OKYU_URL = "https://zkxsyipyjqikqxswpbks.supabase.co"
OKYU_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreHN5aXB5anFpa3F4c3dwYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzgxOTMsImV4cCI6MjA5MTIxNDE5M30.oodwUnavIkmHS6W08OwpAoxxFoBPcJ6ZOizOQkaE5PY"
HRM_URL = "https://emtvtmdequrnmhpdeqrv.supabase.co"
HRM_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHZ0bWRlcXVybm1ocGRlcXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk2MjksImV4cCI6MjA5MDQ2NTYyOX0.Y0tfpHYhVS98ACU9c5Tpi_qpCaFzCkKWlCzBV8ExHls"

def get(url, key, path):
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        headers={"apikey": key, "Authorization": f"Bearer {key}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def patch(url, key, table, emp_id, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{url}/rest/v1/{table}?id=eq.{emp_id}",
        data=body,
        method="PATCH",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
    )
    with urllib.request.urlopen(req) as r:
        return r.status

# --- Load HRM bank data ---
hrm_rows = get(HRM_URL, HRM_KEY, "gehaelter?select=name,ue_bank,monat&ue_bank=neq.&order=monat.desc&limit=500")
hrm_bank = {}
for row in hrm_rows:
    if row['name'] not in hrm_bank:
        hrm_bank[row['name']] = row['ue_bank']

# --- Load OKYU employees ---
emps = get(OKYU_URL, OKYU_KEY, "employees?select=id,name&limit=200")

def to_hrm_key(name):
    parts = name.strip().split()
    if len(parts) >= 2:
        return parts[-1] + ', ' + ' '.join(parts[:-1])
    return name

# Manual overrides for unmatched
MANUAL = {
    21: None,   # Quang Tung Truong - not in HRM
    9:  None,   # Thi Huong Nguyen - not in HRM
    10: None,   # Tuan Hai Nguyen - not in HRM
    14: None,   # Phuc Nguyen Duc - name format issue
    25: None,   # Giáng My Lý - not in HRM
    26: None,   # Linh Nguyễn Chí - not in HRM
}

print("Syncing bank data...")
ok, skip, fail = 0, 0, 0

for emp in emps:
    eid = emp['id']
    oname = emp['name']
    key = to_hrm_key(oname)
    bank = hrm_bank.get(key) or MANUAL.get(eid)
    
    if not bank:
        print(f"  ⚠ SKIP id={eid:2d} '{oname}' — no bank found")
        skip += 1
        continue
    
    try:
        status = patch(OKYU_URL, OKYU_KEY, "employees", eid, {"bank": bank})
        print(f"  ✓ id={eid:2d} '{oname}' → {bank}")
        ok += 1
        time.sleep(0.1)
    except Exception as e:
        print(f"  ✗ id={eid:2d} '{oname}' ERROR: {e}")
        fail += 1

print(f"\nDone: {ok} updated, {skip} skipped, {fail} failed")
