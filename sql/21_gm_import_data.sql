-- ═══════════════════════════════════════════════════════════
-- GM → OKYU HR: Import Data
-- Generated: 2026-05-20T20:55:51.073Z
-- ═══════════════════════════════════════════════════════════

-- Total from GM: 87, after filtering Blossom: 85

-- ─── EMPLOYEES ───

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  100, 'Dao, Chien Thang', 'enso', '—', 'Vollzeit', 'active',
  '2026-04-01', 'CD',
  26, 0, 0, 0, 0,
  2780, 0, NULL, '1000',
  'Vollzeit', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Dao, Chien Thang | Enso | P-Nr 1000

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  101, 'Dao, Son Hai', 'enso', '—', 'Teilzeit', 'active',
  '2024-03-01', 'SD',
  26, 0, 0, 0, 0,
  1600, 0, '1967-05-30', '47',
  'Teilzeit', NULL, 1264.02,
  '3', '', '09300567S012',
  'AOK Baden-Württemberg', 'DE13 6005 0101 0004 5627 02', 'Urbanstraße 42, 70182 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Dao, Son Hai | Enso | P-Nr 47

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  102, 'Do, Hoanh Duc', 'enso', '—', 'Vollzeit', 'active',
  '2025-06-16', 'HD',
  26, 0, 0, 0, 0,
  2850, 0, '2000-09-14', '192',
  'Vollzeit', NULL, 0,
  '1', '50366128460', '09140900D017',
  'DAK Gesundheit', 'DE90 6035 0130 1003 3404 36', 'Schützenplatz 19, 71634 Ludwigsburg',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Do, Hoanh Duc | Enso | P-Nr 192

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  103, 'Doan, Hai Hoang', 'enso', '—', 'Vollzeit', 'active',
  '2021-06-08', 'HD',
  26, 0, 0, 0, 0,
  5000, 0, '1994-02-17', '106',
  'Vollzeit', NULL, 3578.69,
  '1', '91048587622', '23170294D017',
  'AOK Baden-Württemberg', 'DE79 6007 0024 0887 9371 00', 'Wildunger Straße 11, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Doan, Hai Hoang | Enso | P-Nr 106

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  104, 'Duong, Thi Vuong', 'enso', '—', 'Vollzeit', 'active',
  '2023-04-01', 'TD',
  26, 0, 0, 0, 0,
  5500, 0, '1958-04-18', '1',
  'Vollzeit', NULL, 3121.24,
  '1', '91862340567', '09180458D503',
  'AOK Baden-Württemberg', 'DE16 8704 0000 0601 7651 00', 'Böblinger Strasse 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Duong, Thi Vuong | Enso | P-Nr 1

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  105, 'Fousseni, Mohamed', 'enso', '—', 'Minijob', 'active',
  '2026-02-01', 'MF',
  26, 0, 0, 0, 0,
  603, 0, '1988-05-08', '205',
  'Minijob', NULL, 603,
  '', '', '63020593M043',
  'Knappschaft', 'DE05 6005 0101 7006 1890 07', 'Stöckachstrasse 17, 70190 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Fousseni, Mohamed | Enso | P-Nr 205

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  106, 'Hallmann, Dao Tien Huy', 'enso', '—', 'Vollzeit', 'active',
  '2025-12-01', 'DH',
  26, 0, 0, 0, 0,
  5000, 0, '1988-02-22', '199',
  'Vollzeit', NULL, 3356.27,
  '3', '97265845014', '52220288D010',
  'AOK Baden-Württemberg', 'DE88 2007 0024 0025 8137 00', 'Mönchstrasse 3, 70161 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Hallmann, Dao Tien Huy | Enso | P-Nr 199

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  107, 'Huynh, Phuc Hung', 'enso', '—', 'Minijob', 'active',
  '2026-03-01', 'PH',
  26, 0, 0, 0, 0,
  603, 0, NULL, '206',
  'Minijob', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Huynh, Phuc Hung | Enso | P-Nr 206

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  108, 'Itota, Nelson', 'enso', '—', 'Teilzeit', 'active',
  '2023-01-01', 'NI',
  26, 0, 0, 0, 0,
  1800, 0, '1988-12-09', '127',
  'Teilzeit', NULL, 1320.08,
  '1', '20074316899', '23091288I009',
  'AOK Baden-Württemberg', 'DE60 6005 0101 7814 0949 06', 'Sedanstrasse 16, 70190 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Itota, Nelson | Enso | P-Nr 127

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  109, 'Khan, Bashi', 'enso', '—', 'Minijob', 'active',
  '2025-01-03', 'BK',
  26, 0, 0, 0, 0,
  556, 0, '1988-01-01', '123',
  'Minijob', NULL, 556,
  '', '', '23010188K307',
  'Knappschaft', 'DE49 6005 0101 7421 0847 63', 'Falkert Strasse 82, 70193 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Khan, Bashi | Enso | P-Nr 123

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  110, 'Le, Minh Thu', 'enso', '—', 'Minijob', 'active',
  '2025-08-01', 'ML',
  26, 0, 0, 0, 0,
  603, 0, '2004-12-01', '194',
  'Minijob', NULL, 375.64,
  '', '85860724380', '49011204L522',
  'Knappschaft', 'DE37 8704 0000 0201 6954 00', 'Böblingerstraße 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Le, Minh Thu | Enso | P-Nr 194

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  111, 'Luong, Thi Lan', 'enso', '—', 'Teilzeit', 'active',
  '2026-01-22', 'TL',
  26, 0, 0, 0, 0,
  1800, 0, '1987-09-30', '203',
  'Teilzeit', NULL, 405,
  '4', '', '63300987L522',
  'AOK Baden-Württemberg', 'DE94 6009 0800 0004 7534 70', 'Schwabstrasse 63, 70197 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Luong, Thi Lan | Enso | P-Nr 203

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  112, 'Nguyen, Chi Linh', 'enso', '—', '—', 'active',
  '2025-03-14', 'CN',
  26, 0, 0, 0, 0,
  1092, 0, '1998-09-03', '179',
  '', NULL, 716.98,
  '1', '', '63030998N026',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Chi Linh | Enso | P-Nr 179

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  113, 'Nguyen, Duc Duong', 'enso', '—', 'Vollzeit', 'active',
  '2025-01-03', 'DN',
  26, 0, 0, 0, 0,
  5000, 0, '1999-04-24', '9',
  'Vollzeit', NULL, 3061.39,
  '1', '81723569428', '49240499N001',
  'AOK Baden-Württemberg', 'DE90 6117 0024 0025 7683 00', 'Böblinger Strasse 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Duc Duong | Enso | P-Nr 9

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  114, 'Nguyen, Ha Linh', 'enso', '—', '—', 'active',
  '2026-04-01', 'HN',
  26, 0, 0, 0, 0,
  0, 0, NULL, '1001',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Ha Linh | Enso | P-Nr 1001

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  115, 'Nguyen, Hai My', 'enso', '—', 'Minijob', 'active',
  '2025-12-01', 'HN',
  26, 0, 0, 0, 0,
  603, 0, '1991-11-14', '198',
  'Minijob', NULL, 375.64,
  '', '71464543204', '54141191N504',
  'Knappschaft', 'DE46 6004 0071 0522 7160 00', 'Eberhardstraße 65a, 70173 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Hai My | Enso | P-Nr 198

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  116, 'Nguyen, Sy Chien', 'enso', '—', 'Minijob', 'active',
  '2023-11-15', 'SN',
  26, 0, 0, 0, 0,
  603, 0, '2000-05-15', '142',
  'Minijob', NULL, 520,
  '', '11629475804', '63150500N006',
  'Knappschaft', 'DE09 6004 0071 0772 3968 00', 'Stuttgarter Strasse 18, 70469 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Sy Chien | Enso | P-Nr 142

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  117, 'Nguyen, Thi Lan Anh', 'enso', '—', 'Vollzeit', 'active',
  '2024-01-01', 'TN',
  26, 0, 0, 0, 0,
  2800, 0, '2001-06-26', '148',
  'Vollzeit', NULL, 795.19,
  '1', '32608491257', '63260601N518',
  'AOK Baden-Württemberg', 'DE92 6115 0020 0104 1012 07', 'Obere Neckarstraße 22, 74072 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Lan Anh | Enso | P-Nr 148

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  118, 'Nguyen, Thi Thuy', 'enso', '—', 'Teilzeit', 'active',
  '2025-06-01', 'TN',
  26, 0, 0, 0, 0,
  1250, 0, '1996-01-26', '189',
  'Teilzeit', NULL, 1004.32,
  '1', '', '23260196N507',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Thuy | Enso | P-Nr 189

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  119, 'Nguyen, Trung Hoang Bao', 'enso', '—', '—', 'active',
  '2025-01-01', 'TN',
  26, 0, 0, 0, 0,
  0, 0, NULL, '94',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Trung Hoang Bao | Enso | P-Nr 94

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  120, 'Nguyen, Van Manh', 'enso', '—', '—', 'inactive',
  '2025-09-10', 'VN',
  26, 0, 0, 0, 0,
  3100, 0, '1994-08-12', '196',
  '', '2026-02-28', 0,
  '4', '83031534273', '42120894N000',
  'Techniker Krankenkasse', 'DE10 1404 0000 0203 6796 00', 'Daimlerstrasse 60, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Manh | Enso | P-Nr 196

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  121, 'Nguyen, Van Manh', 'enso', '—', '—', 'inactive',
  '2025-01-01', 'VN',
  26, 0, 0, 0, 0,
  0, 0, NULL, '204',
  '', '2026-03-31', 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Manh | Enso | P-Nr 204

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  122, 'Nguyen, Van Tung', 'enso', '—', 'Vollzeit', 'active',
  '2025-09-01', 'VN',
  26, 0, 0, 0, 0,
  2850, 0, '1994-10-14', '195',
  'Vollzeit', NULL, 1909.07,
  '1', '35396278143', '25141094N010',
  'AOK Baden-Württemberg', 'DE09 6004 0071 0781 0880 00', 'Obere Neckarstrasse 26, 74072 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Tung | Enso | P-Nr 195

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  123, 'Nguyen, Van Tung', 'enso', '—', 'Teilzeit', 'active',
  '2021-09-01', 'VN',
  26, 0, 0, 0, 0,
  1885, 0, '1991-07-10', '197',
  'Teilzeit', NULL, 1347.03,
  '1', '', '23100791N002',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 57, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Tung | Enso | P-Nr 197

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  124, 'Pham, Ngoc Anh', 'enso', '—', '—', 'inactive',
  '2026-02-01', 'NP',
  26, 0, 0, 0, 0,
  4000, 0, NULL, '1004',
  '', '2026-01-31', 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Ngoc Anh | Enso | P-Nr 1004

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  125, 'Pham, Ngoc Anh', 'enso', '—', '—', 'inactive',
  '2025-06-01', 'NP',
  26, 0, 0, 0, 0,
  4000, 0, NULL, '84',
  '', '2026-01-31', 2870.34,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Ngoc Anh | Enso | P-Nr 84

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  126, 'Pham, Quynh Huong', 'enso', '—', 'Minijob', 'active',
  '2023-08-15', 'QP',
  26, 0, 0, 0, 0,
  603, 0, '2000-08-30', '136',
  'Minijob', NULL, 556,
  '', '', '23300800H566',
  'Knappschaft', '', 'Stuttgarter Strasse 18, 70469 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Quynh Huong | Enso | P-Nr 136

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  127, 'Pham, Thi Tham', 'enso', '—', 'Minijob', 'active',
  '2026-01-16', 'TP',
  26, 0, 0, 0, 0,
  603, 0, '2000-10-24', '202',
  'Minijob', NULL, 410.02,
  '', '44652013842', '23241000P532',
  'Knappschaft', 'DE58 6945 0065 1151 3592 89', 'Spreuergasse 25, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Thi Tham | Enso | P-Nr 202

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  128, 'Pham, Thi Thu', 'enso', '—', 'Teilzeit', 'active',
  '2025-06-01', 'TP',
  26, 0, 0, 0, 0,
  2000, 0, '1969-12-25', '191',
  'Teilzeit', NULL, 1429.48,
  '1', '48023257121', '23251269P564',
  'AOK Baden-Württemberg', '', 'Nähterstrasse 86, 70327 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Thi Thu | Enso | P-Nr 191

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  129, 'Trac, Thanh Loan', 'enso', '—', 'Teilzeit', 'active',
  '2020-03-01', 'TT',
  26, 0, 0, 0, 0,
  2000, 0, '1980-12-07', '90',
  'Teilzeit', NULL, 1199.46,
  '5', '72665310982', '63071280T516',
  'BARMER', 'DE15 6009 0800 0007 0146 04', 'Paul-Lincke-Strasse 14, 70195 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Trac, Thanh Loan | Enso | P-Nr 90

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  130, 'Tran, Tony', 'enso', '—', 'Minijob', 'active',
  '2026-01-16', 'TT',
  26, 0, 0, 0, 0,
  603, 0, '2006-08-20', '201',
  'Minijob', NULL, 410.02,
  '', '63227490854', '63200806T008',
  'Knappschaft', 'DE18 6009 0800 0004 8913 17', 'Paul-Lincke-Strasse 14, 70195 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Tran, Tony | Enso | P-Nr 201

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  131, 'Truong, Quang Tung', 'enso', '—', 'Azubi', 'active',
  '2025-12-17', 'QT',
  26, 0, 0, 0, 169,
  1050, 0, '2005-07-17', '200',
  'Azubi', NULL, 803.04,
  '1', '', '23170705T047',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 57, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Truong, Quang Tung | Enso | P-Nr 200

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  132, 'Amanzada, Mohammad Ibrahim', 'okyu', '—', 'Vollzeit', 'active',
  '2024-12-03', 'MA',
  26, 0, 0, 0, 0,
  3000, 0, '1991-01-09', '41',
  'Vollzeit', NULL, 1898.83,
  '1', '34481725964', '63090191A074',
  'AOK Baden-Württemberg', 'DE40 6009 0100 0453 3340 08', 'Goldregenweg 5, 70565 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Amanzada, Mohammad Ibrahim | Okyu | P-Nr 41

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  133, 'Atai, Mustafa', 'okyu', '—', 'Vollzeit', 'inactive',
  '2022-12-01', 'MA',
  26, 0, 0, 0, 0,
  2600, 0, NULL, '31',
  'Vollzeit', '2026-02-28', 1767.14,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', 'er wurde gekündigit'
) ON CONFLICT (id) DO NOTHING;
-- ^ Atai, Mustafa | Okyu | P-Nr 31

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  134, 'Bechthold, Tamara', 'okyu', '—', 'Teilzeit', 'active',
  '2021-09-01', 'TB',
  26, 0, 0, 0, 0,
  1668, 0, '2000-12-20', '120',
  'Teilzeit', NULL, 650.55,
  '1', '65173824962', '23201200B569',
  'AOK Baden-Württemberg', 'DE77 6009 0100 0502 4780 04', 'Brückenstrasse 2/1, 71409 Schwaikheim',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Bechthold, Tamara | Okyu | P-Nr 120

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  135, 'Chu, Minh Chien', 'okyu', '—', 'Vollzeit', 'active',
  '2025-03-14', 'MC',
  26, 0, 0, 0, 0,
  3010, 0, '2000-07-20', '111',
  'Vollzeit', NULL, 1898.83,
  '1', '31743260355', '23200700C056',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Chu, Minh Chien | Okyu | P-Nr 111

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  136, 'Doan, Hai Hoang', 'okyu', '—', 'Minijob', 'active',
  '2025-10-01', 'HD',
  26, 0, 0, 0, 0,
  603, 0, '1994-02-17', '67',
  'Minijob', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Doan, Hai Hoang | Okyu | P-Nr 67

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  137, 'Dolwig, Björn', 'okyu', '—', 'Minijob', 'active',
  '2024-10-15', 'BD',
  26, 0, 0, 0, 0,
  500, 0, '1981-08-05', '96',
  'Minijob', NULL, 338.2,
  '', '72891536013', '63050881D014',
  'Knappschaft', 'DE60 6115 0020 0104 0825 77', 'Im Inneren Bogen 18, 72622 Nürtingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Dolwig, Björn | Okyu | P-Nr 96

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  138, 'Dolwig, Nadine', 'okyu', '—', 'Minijob', 'active',
  '2025-01-01', 'ND',
  26, 0, 0, 0, 0,
  50, 0, '1981-09-21', '102',
  'Minijob', NULL, 33.82,
  '', '51689077230', '63210981M519',
  'Knappschaft', 'DE60 6115 0020 0104 0825 77', 'Im Inneren Bogen 18, 72622 Nürtingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Dolwig, Nadine | Okyu | P-Nr 102

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  139, 'Kichihin, Yavhen', 'okyu', '—', 'Teilzeit', 'active',
  '2026-01-22', 'YK',
  26, 0, 0, 0, 0,
  1200, 0, '1989-11-07', '118',
  'Teilzeit', NULL, 463.46,
  '1', '34675240898', '63071189K056',
  'AOK Baden-Württemberg', '', 'Montluelweg 3, 73760 Ostfildern',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Kichihin, Yavhen | Okyu | P-Nr 118

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  140, 'Kusnadi, Kusnadi', 'okyu', '—', 'Vollzeit', 'active',
  '2025-06-01', 'KK',
  26, 0, 0, 0, 0,
  3000, 0, '2000-04-09', '114',
  'Vollzeit', NULL, 1898.83,
  '1', '10548396209', '50090400K052',
  'DAK Gesundheit', '', 'Stöckachstrasse 17, 70190 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Kusnadi, Kusnadi | Okyu | P-Nr 114

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  141, 'Le, Minh Thu', 'okyu', '—', 'Azubi', 'active',
  '2025-08-01', 'ML',
  26, 0, 0, 0, 0,
  137, 0, '2004-12-01', '116',
  'Azubi', NULL, 803.04,
  '1', '85860724380', '49011204L522',
  'BARMER', '', 'Böblingerstraße 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Le, Minh Thu | Okyu | P-Nr 116

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  142, 'Luong, Michael', 'okyu', '—', 'Teilzeit', 'inactive',
  '2022-12-01', 'ML',
  26, 0, 0, 0, 0,
  2100, 0, '1993-05-30', '28',
  'Teilzeit', '2026-03-31', 1472.81,
  '1', '71968024322', '24300593L005',
  'BKK B. Braun Aesculap', 'DE83 6435 0070 0021 0660 61', 'Sandäckerstrasse 9, 70469 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', 'hat gekündigt'
) ON CONFLICT (id) DO NOTHING;
-- ^ Luong, Michael | Okyu | P-Nr 28

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  143, 'Murati, Besmir', 'okyu', '—', 'Minijob', 'active',
  '2024-09-01', 'BM',
  26, 0, 0, 0, 0,
  603, 0, '1988-01-19', '89',
  'Minijob', NULL, 375.64,
  '', '71141026356', '52190188M038',
  'Knappschaft', 'DE60 1001 0010 0104 5991 31', 'Landhausstrasse 48, 70190 Stuttgart',
  'Albanisch', 'Niederlassung Erlaubnis',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Murati, Besmir | Okyu | P-Nr 89

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  144, 'Nguyen, Duc Cuong', 'okyu', '—', 'Vollzeit', 'active',
  '2025-09-01', 'DN',
  26, 0, 0, 0, 0,
  3010, 0, '1988-02-20', '117',
  'Vollzeit', NULL, 1898.83,
  '1', '', '63200288N014',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Duc Cuong | Okyu | P-Nr 117

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  145, 'Nguyen, Duc Nam', 'okyu', '—', 'Vollzeit', 'active',
  '2025-08-01', 'DN',
  26, 0, 0, 0, 0,
  5000, 0, '1989-05-05', '93',
  'Vollzeit', NULL, 3356.27,
  '1', '58763209134', '23050589D010',
  'AOK Baden-Württemberg', 'DE11 6004 0071 0861 9363 00', 'Schickhardtstrasse 19, 74076 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Duc Nam | Okyu | P-Nr 93

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  146, 'Nguyen, Khanh Ly', 'okyu', '—', 'Minijob', 'active',
  '2023-10-18', 'KN',
  26, 0, 0, 0, 0,
  603, 0, '2003-03-21', '52',
  'Minijob', NULL, 375.64,
  '', '', '63210303N519',
  'Knappschaft', 'DE34 6004 0071 0140 7857 00', 'Gartenstrasse 22, 73760 Ostfildern',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Khanh Ly | Okyu | P-Nr 52

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  147, 'Nguyen, Ngoc huyen', 'okyu', '—', '—', 'active',
  '2025-01-01', 'NN',
  26, 0, 0, 0, 0,
  0, 0, NULL, '123',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Ngoc huyen | Okyu | P-Nr 123

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  148, 'Nguyen, Thanh Ha', 'okyu', '—', 'Vollzeit', 'active',
  '2025-09-01', 'TN',
  26, 0, 0, 0, 0,
  2400, 0, '1992-03-25', '115',
  'Vollzeit', NULL, 1700.05,
  '1', '82703046150', '23250392K049',
  'AOK Baden-Württemberg', '', 'König-Karl-Strasse 19, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thanh Ha | Okyu | P-Nr 115

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  149, 'Nguyen, Thi Tuyet', 'okyu', '—', '—', 'active',
  '2024-10-01', 'TN',
  26, 0, 0, 0, 0,
  1800, 0, '1982-11-04', '94',
  '', NULL, 1309.75,
  '1', '27983174608', '23041182N525',
  'Techniker Krankenkasse', 'DE32 6007 0024 0836 0703 00', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Tuyet | Okyu | P-Nr 94

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  150, 'Nguyen, Trung Hoang Bao', 'okyu', '—', 'Vollzeit', 'active',
  '2025-08-01', 'TN',
  26, 0, 0, 0, 0,
  2400, 0, '1994-09-15', '109',
  'Vollzeit', NULL, 1700.05,
  '1', '47016581398', '54150994H059',
  'AOK Bayern', 'DE36 2004 1111 0374 3838 00', 'Hasenbergstrasse 99, 70176 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Trung Hoang Bao | Okyu | P-Nr 109

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  151, 'Nguyen, Van Son', 'okyu', '—', 'Vollzeit', 'active',
  '2025-03-06', 'VN',
  26, 0, 0, 0, 0,
  3010, 0, '1995-10-08', '110',
  'Vollzeit', NULL, 1898.83,
  '1', '93056997828', '63081095N018',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Son | Okyu | P-Nr 110

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  152, 'Paulino, Vanessa', 'okyu', '—', 'Vollzeit', 'active',
  '2024-08-01', 'VP',
  26, 0, 0, 0, 0,
  5000, 0, '1991-01-10', '80',
  'Vollzeit', NULL, 3356.27,
  '1', '75162498079', '63100191P508',
  'Techniker Krankenkasse', 'DE09 6004 0071 0514 0470 00', 'Christophstrasse 26, 70180 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Paulino, Vanessa | Okyu | P-Nr 80

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  153, 'Pham, Ngoc Anh', 'okyu', '—', 'Vollzeit', 'active',
  '2026-02-01', 'NP',
  26, 0, 0, 0, 0,
  4000, 0, '1991-05-09', '121',
  'Vollzeit', NULL, 0,
  '3', '97312785600', '09090591P023',
  'AOK Baden-Württemberg', 'DE27 6205 0000 0008 7789 18', 'Anna-Collmer-Strasse 20, 74080 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Ngoc Anh | Okyu | P-Nr 121

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  154, 'Pham, Thuy Trang', 'okyu', '—', 'Minijob', 'active',
  '2023-10-10', 'TP',
  26, 0, 0, 0, 0,
  603, 0, '2003-07-19', '54',
  'Minijob', NULL, 375.64,
  '', '', '23190703P530',
  'Knappschaft', 'DE45 8709 6124 0200 0702 83', 'Markgröninger Strasse 39, 70435 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Thuy Trang | Okyu | P-Nr 54

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  155, 'Stanikzai, Nimatullah', 'okyu', '—', 'Minijob', 'active',
  '2026-03-15', 'NS',
  26, 0, 0, 0, 169,
  603, 0, '1998-01-01', '124',
  'Minijob', NULL, 0,
  '', '12952784368', '23010198S272',
  'Knappschaft', 'DE71 6005 0101 7005 4336 44', 'Eichweg 13, 71254 Ditzingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Stanikzai, Nimatullah | Okyu | P-Nr 124

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  156, 'Trajkoska, Irena', 'okyu', '—', 'Minijob', 'active',
  '2022-12-05', 'IT',
  26, 0, 0, 0, 0,
  520, 0, '1976-09-14', '36',
  'Minijob', NULL, 350,
  '', '42180435642', '63140976K548',
  'Knappschaft', 'DE34 6004 0071 0210 6839 00', 'Schubertstrasse 20-2, 71384 Weinstadt',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Trajkoska, Irena | Okyu | P-Nr 36

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  157, 'Vu, Thi Ngoc', 'okyu', '—', 'Azubi', 'active',
  '2025-03-04', 'TV',
  26, 0, 0, 0, 0,
  955, 0, '2005-01-16', '108',
  'Azubi', NULL, 738.48,
  '1', '', '26160105V508',
  'BARMER', 'DE91 6004 0071 0876 6032 00', 'Böblinger Strasse 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Vu, Thi Ngoc | Okyu | P-Nr 108

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  158, 'Vu, Thu Phuong', 'okyu', '—', '—', 'active',
  '2025-10-01', 'TV',
  26, 0, 0, 0, 0,
  603, 0, NULL, '65',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Vu, Thu Phuong | Okyu | P-Nr 65

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  159, 'Alakhel, Ibrahim', 'origami', '—', 'Vollzeit', 'active',
  '2024-11-27', 'IA',
  26, 0, 0, 0, 0,
  3400, 0, '1991-01-01', '125',
  'Vollzeit', NULL, 2215.53,
  '1', '36657491085', '23330191A045',
  'AOK Baden-Württemberg', 'DE46600400710522716000', 'Kelterstrasse 5, 70199 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Alakhel, Ibrahim | Origami | P-Nr 125

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  160, 'Duong, Quoc Trung', 'origami', '—', '—', 'active',
  '2025-01-01', 'QD',
  26, 0, 0, 0, 0,
  2800, 0, NULL, '134',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Duong, Quoc Trung | Origami | P-Nr 134

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  161, 'Fousseni, Mohamed', 'origami', '—', 'Vollzeit', 'active',
  '2021-11-05', 'MF',
  26, 0, 0, 0, 169,
  2800, 0, '1988-05-08', '105',
  'Vollzeit', NULL, 795.19,
  '1', '', '63020593M043',
  'AOK Baden-Württemberg', 'DE05 6005 0101 7006 1890 07', 'Stöckachstrasse 17, 70190 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Fousseni, Mohamed | Origami | P-Nr 105

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  162, 'Murati, Besmir', 'origami', '—', 'Vollzeit', 'active',
  '2024-12-03', 'BM',
  26, 0, 0, 0, 169,
  4000, 0, '1988-01-19', '63',
  'Vollzeit', NULL, 2540.8,
  '1', '71141026356', '52190188M038',
  'AOK Hessen', 'DE60100100100104599131', 'Landhausstrasse 48, 70190 Stuttgart',
  'Albanisch', 'Niederlassung Erlaubnis',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Murati, Besmir | Origami | P-Nr 63

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  163, 'Nguyen, Chi Linh', 'origami', '—', 'Minijob', 'active',
  '2025-04-01', 'CN',
  26, 0, 0, 0, 0,
  603, 0, '1998-09-03', '138',
  'Minijob', NULL, 410.02,
  '', '', '63030998N026',
  'Knappschaft', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Chi Linh | Origami | P-Nr 138

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  164, 'Nguyen, Dinh Son', 'origami', '—', 'Azubi', 'active',
  '2024-10-01', 'DN',
  26, 0, 0, 0, 0,
  1255, 0, '1999-09-29', '118',
  'Azubi', NULL, 949.51,
  '1', '47365183396', '13290999D076',
  'BARMER', 'DE94 8704 0000 0745 0455 00', 'Schurwaldstrasse 61, 70186 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Dinh Son | Origami | P-Nr 118

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  165, 'Nguyen, Duc Sieu', 'origami', '—', 'Minijob', 'active',
  '2026-01-01', 'DN',
  26, 0, 0, 0, 0,
  603, 0, '1955-07-29', '147',
  'Minijob', NULL, 410.02,
  '', '53817269345', '09290755D065',
  'Knappschaft', '', 'Hasenbergstrasse 27, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Duc Sieu | Origami | P-Nr 147

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  166, 'Nguyen, Ha Linh', 'origami', '—', 'Azubi', 'active',
  '2025-11-10', 'HN',
  26, 0, 0, 0, 0,
  955, 0, '2004-12-21', '142',
  'Azubi', NULL, 410.02,
  '1', '10685976322', '16211204N529',
  'BKK Linde', 'DE75 5507 0024 0107 7916 05', 'Vorstadt 4, 55411 Bingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Ha Linh | Origami | P-Nr 142

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  167, 'Nguyen, Hai My', 'origami', '—', 'Vollzeit', 'active',
  '2024-11-15', 'HN',
  26, 0, 0, 0, 0,
  5700, 0, '1991-11-14', '122',
  'Vollzeit', NULL, 3408.06,
  '1', '71464543204', '54141191N504',
  'DAK Gesundheit', 'DE46 6004 0071 0522 7160 00', 'Eberhardstraße 65a, 70173 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Hai My | Origami | P-Nr 122

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  168, 'Nguyen, Thanh Ha', 'origami', '—', 'Minijob', 'active',
  '2025-11-21', 'TN',
  26, 0, 0, 0, 0,
  600, 0, '1992-03-25', '143',
  'Minijob', NULL, 405,
  '', '82703046150', '23250392K049',
  'Knappschaft', '', 'König-Karl-Strasse 19, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thanh Ha | Origami | P-Nr 143

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  169, 'Nguyen, Thi Hong', 'origami', '—', 'Vollzeit', 'active',
  '2024-12-03', 'TN',
  26, 0, 0, 0, 0,
  5000, 0, '1983-09-05', '129',
  'Vollzeit', NULL, 3486.6,
  '2', '75496838109', '61050983N507',
  'AOK Baden-Württemberg', '', 'Hasenbergstrasse 27, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Hong | Origami | P-Nr 129

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  170, 'Nguyen, Thi Huong', 'origami', '—', 'Teilzeit', 'active',
  '2025-06-01', 'TN',
  26, 0, 0, 0, 0,
  1250, 0, '2000-01-14', '139',
  'Teilzeit', NULL, 1004.32,
  '1', '', '63140100N519',
  'AOK Baden-Württemberg', '', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Huong | Origami | P-Nr 139

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  171, 'Nguyen, Thi Tuyet', 'origami', '—', 'Minijob', 'active',
  '2026-02-01', 'TN',
  26, 0, 0, 0, 0,
  603, 0, NULL, '205',
  'Minijob', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Tuyet | Origami | P-Nr 205

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  172, 'Nguyen, Thi Tuyet', 'origami', '—', 'Minijob', 'active',
  '2026-02-01', 'TN',
  26, 0, 0, 0, 0,
  603, 0, '1982-11-04', '149',
  'Minijob', NULL, 0,
  '', '27983174608', '23041182N525',
  'Knappschaft', 'DE32 6007 0024 0836 0703 00', 'Hauptstätter Strasse 61, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Thi Tuyet | Origami | P-Nr 149

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  173, 'Nguyen, Tuan Hai', 'origami', '—', 'Teilzeit', 'active',
  '2025-06-01', 'TN',
  26, 0, 0, 0, 0,
  1250, 0, '1995-08-13', '141',
  'Teilzeit', NULL, 1004.32,
  '1', '61378923340', '23130895N036',
  'BKK Linde', '', 'Hauptstätter Strasse 57, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Tuan Hai | Origami | P-Nr 141

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  174, 'Nguyen, Van Manh', 'origami', '—', 'Minijob', 'inactive',
  '2025-11-21', 'VN',
  26, 0, 0, 0, 0,
  600, 0, '1994-08-12', '144',
  'Minijob', '2026-02-28', 405,
  '', '83031534273', '42120894N000',
  'Knappschaft', '', 'Daimlerstrasse 60, 70372 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Manh | Origami | P-Nr 144

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  175, 'Nguyen, Van Tung', 'origami', '—', 'Minijob', 'active',
  '2026-01-01', 'VN',
  26, 0, 0, 0, 0,
  603, 0, '1994-10-14', '148',
  'Minijob', NULL, 410.02,
  '', '', '25141094N010',
  'Knappschaft', 'DE09 6004 0071 0781 0880 00', 'Obere Neckarstrasse 26, 74072 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Nguyen, Van Tung | Origami | P-Nr 148

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  176, 'Paulino, Vanessa', 'origami', '—', 'Minijob', 'active',
  '2026-01-01', 'VP',
  26, 0, 0, 0, 0,
  600, 0, '1991-01-10', '146',
  'Minijob', NULL, 405,
  '', '75162498079', '63100191P508',
  'Knappschaft', 'DE09 6004 0071 0514 0470 00', 'Christophstraße 26, 70180 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Paulino, Vanessa | Origami | P-Nr 146

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  177, 'Pham, Ngoc Anh', 'origami', '—', 'Minijob', 'active',
  '2025-05-01', 'NP',
  26, 0, 0, 0, 0,
  603, 0, '1991-05-09', '123',
  'Minijob', NULL, 410.02,
  '', '97312785600', '09090591P023',
  'Knappschaft', 'DE27 6205 0000 0008 7789 18', 'Anna-Collmer Strasse 20, 74080 Heilbronn',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Pham, Ngoc Anh | Origami | P-Nr 123

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  178, 'Rau, Ina', 'origami', '—', 'Minijob', 'active',
  '2023-05-02', 'IR',
  26, 0, 0, 0, 0,
  520, 0, '1976-01-01', '116',
  'Minijob', NULL, 350,
  '', '41597623905', '24010176K510',
  'Knappschaft', 'DE31 6009 0800 0004 7313 24', 'Keplerweg 2, 73207 Plochingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Rau, Ina | Origami | P-Nr 116

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  179, 'Shirni, Mustafa', 'origami', '—', 'Vollzeit', 'active',
  '2025-01-03', 'MS',
  26, 0, 0, 0, 0,
  2400, 0, '1983-08-21', '132',
  'Vollzeit', NULL, 1668.47,
  '1', '57043416243', '63210883S060',
  'AOK Baden-Württemberg', '', 'Möhringer Strasse 14-1, 70794 Filderstadt',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Shirni, Mustafa | Origami | P-Nr 132

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  180, 'Stanikzai, Nimatullah', 'origami', '—', 'Vollzeit', 'active',
  '2026-03-15', 'NS',
  26, 0, 0, 0, 169,
  2800, 0, NULL, '204',
  'Vollzeit', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Stanikzai, Nimatullah | Origami | P-Nr 204

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  181, 'Stanikzai, Nimatullah', 'origami', '—', 'Vollzeit', 'active',
  '2026-03-15', 'NS',
  26, 0, 0, 0, 169,
  2800, 0, '1998-01-01', '133',
  'Vollzeit', NULL, 0,
  '1', '12952784368', '23010198S272',
  'AOK Baden-Württemberg', 'DE71 6005 0101 7005 4336 44', 'Eichweg 13, 71254 Ditzingen',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Stanikzai, Nimatullah | Origami | P-Nr 133

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  182, 'Truong, Quang Tung', 'origami', '—', 'Minijob', 'active',
  '2025-12-17', 'QT',
  26, 0, 0, 0, 0,
  603, 0, '2005-07-17', '145',
  'Minijob', NULL, 410.02,
  '', '', '23170705T047',
  'Knappschaft', '', 'Hauptstätter Strasse 57, 70178 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Truong, Quang Tung | Origami | P-Nr 145

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  183, 'Vu, Hoang Ngoc Minh', 'origami', '—', '—', 'active',
  '2025-01-01', 'HV',
  26, 0, 0, 0, 0,
  2800, 0, NULL, '130',
  '', NULL, 0,
  '', '', '',
  '', '', '',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Vu, Hoang Ngoc Minh | Origami | P-Nr 130

INSERT INTO employees (
  id, name, location, dept, position, status, start_date, avatar,
  vac_total, vac_used, sick_days, late_count, soll_stunden,
  brutto_gehalt, schule_tage, birthday, personal_nr,
  typ, austritt, netto, steuerklasse, steuer_id, sv_nr,
  krankenkasse, iban, adresse, nationalitaet, aufenthaltstitel,
  arbeitserlaubnis_bis, benefit_kita, benefit_jobticket, benefit_jobrad,
  benefit_erholung, benefit_diensthandy, benefit_gesundheit,
  stb_name, ma_notiz
) VALUES (
  184, 'Vu, Thi Ngoc', 'origami', '—', 'Minijob', 'active',
  '2025-03-04', 'TV',
  26, 0, 0, 0, 0,
  603, 0, '2005-01-16', '136',
  'Minijob', NULL, 410.02,
  '', '', '26160105V508',
  'Knappschaft', 'DE91 6004 0071 0876 6032 00', 'Böblinger Strasse 382, 70569 Stuttgart',
  '', '',
  NULL, 0, 0,
  0, 0, false,
  0, '', ''
) ON CONFLICT (id) DO NOTHING;
-- ^ Vu, Thi Ngoc | Origami | P-Nr 136

SELECT setval('employees_id_seq', 185);

-- ─── GEHAELTER ───

-- Gehaelter total: 158, after filtering: 156

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  101, 'Mär 2026', 'enso', 47, 'Dao, Son Hai',
  1600, 1737, 1264.02, 0, 0,
  1250, 1900, 'dauerauftrag', '27.03.2026', 'Commerzbank Enso',
  'gezahlt', '5.4.2026', 3150, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  102, 'Mär 2026', 'enso', 192, 'Do, Hoanh Duc',
  2850, 2987, 1906.85, 0, 0,
  1900, 0, 'dauerauftrag', '01.03.2026', 'Revolut Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  103, 'Mär 2026', 'enso', 106, 'Doan, Hai Hoang',
  5000, 4137, 2544.09, 0, 0,
  3594.13, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 3594.13, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  104, 'Mär 2026', 'enso', 1, 'Duong, Thi Vuong',
  5500, 6319.06, 3121.24, 0, 0,
  2000, 0, 'dauerauftrag', '15.02.2026', 'Commerzbank Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  105, 'Mär 2026', 'enso', 205, 'Fousseni, Mohamed',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  106, 'Mär 2026', 'enso', 199, 'Hallmann, Dao Tien Huy',
  5000, 5137, 3473.55, 0, 0,
  3473.55, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  107, 'Mär 2026', 'enso', 206, 'Huynh, Phuc Hung',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  108, 'Mär 2026', 'enso', 127, 'Itota, Nelson',
  1800, 1937, 1320.08, 0, 0,
  1300.16, 1500, 'dauerauftrag', '27.03.2026', 'Commerzbank Enso',
  'gezahlt', '5.4.2026', 2800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  109, 'Mär 2026', 'enso', 123, 'Khan, Bashi',
  556, 556, 556, 0, 0,
  0, 1200, 'offen', '', '',
  'gezahlt', '5.4.2026', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  110, 'Mär 2026', 'enso', 194, 'Le, Minh Thu',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  111, 'Mär 2026', 'enso', 203, 'Luong, Thi Lan',
  1800, 2119.67, 1219.13, 0, 0,
  1200, 1400, 'dauerauftrag', '02.03.2026', '',
  'gezahlt', '5.4.2026', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  112, 'Mär 2026', 'enso', 179, 'Nguyen, Chi Linh',
  1092, 1092, 716.98, 0, 0,
  700, 0, 'ueberwiesen', '01.04.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  113, 'Mär 2026', 'enso', 9, 'Nguyen, Duc Duong',
  5000, 5137, 3061.39, 0, 0,
  3024.66, 0, 'dauerauftrag', '15.02.2026', 'Commerzbank Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  115, 'Mär 2026', 'enso', 198, 'Nguyen, Hai My',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  116, 'Mär 2026', 'enso', 142, 'Nguyen, Sy Chien',
  520, 520, 520, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  117, 'Mär 2026', 'enso', 148, 'Nguyen, Thi Lan Anh',
  2850, 2987, 1909.07, 0, 0,
  1900, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 1900, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  118, 'Mär 2026', 'enso', 189, 'Nguyen, Thi Thuy',
  1250, 1387, 1004.32, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  119, 'Mär 2026', 'enso', 94, 'Nguyen, Trung Hoang Bao',
  0, 603, 603, 0, 0,
  600, 0, 'dauerauftrag', '01.04.2026', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  121, 'Mär 2026', 'enso', 204, 'Nguyen, Van Manh',
  3100, 3237, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  123, 'Mär 2026', 'enso', 197, 'Nguyen, Van Tung',
  1885, 2022, 1352.13, 0, 0,
  0, 1200, 'offen', '', '',
  'gezahlt', '5.4.2026', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  122, 'Mär 2026', 'enso', 195, 'Nguyen, Van Tung',
  2850, 2987, 1909.07, 0, 0,
  2000, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  124, 'Mär 2026', 'enso', 1004, 'Pham, Ngoc Anh',
  4000, 4000, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  126, 'Mär 2026', 'enso', 136, 'Pham, Quynh Huong',
  556, 556, 556, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  127, 'Mär 2026', 'enso', 202, 'Pham, Thi Tham',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  128, 'Mär 2026', 'enso', 191, 'Pham, Thi Thu',
  2000, 2137, 1429.48, 0, 0,
  1400, 1200, 'dauerauftrag', '31.03.2026', 'Revolut Enso',
  'gezahlt', '5.4.2026', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  129, 'Mär 2026', 'enso', 90, 'Trac, Thanh Loan',
  2000, 2137, 1549.21, 0, 0,
  1400, 2000, 'dauerauftrag', '30.03.2026', 'Commerzbank Enso',
  'gezahlt', '5.4.2026', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  130, 'Mär 2026', 'enso', 201, 'Tran, Tony',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  131, 'Mär 2026', 'enso', 200, 'Truong, Quang Tung',
  1187, 1187, 798.41, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  132, 'Mär 2026', 'okyu', 41, 'Amanzada, Mohammad Ibrahim',
  3000, 3137, 1590.96, 0, 0,
  2000, 600, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  134, 'Mär 2026', 'okyu', 120, 'Bechthold, Tamara',
  1668, 1805, 1239.53, 0, 0,
  1239.53, 0, 'ueberwiesen', '7.4.2026', 'Revolut Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  135, 'Mär 2026', 'okyu', 111, 'Chu, Minh Chien',
  3010, 3147, 1999.03, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  136, 'Mär 2026', 'okyu', 67, 'Doan, Hai Hoang',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  137, 'Mär 2026', 'okyu', 96, 'Dolwig, Björn',
  500, 500, 500, 0, 0,
  500, 0, 'dauerauftrag', '28.02.2026', 'Commerzbank Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  138, 'Mär 2026', 'okyu', 102, 'Dolwig, Nadine',
  50, 50, 50, 0, 0,
  50, 0, 'dauerauftrag', '28.02.2026', 'Commerzbank Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  139, 'Mär 2026', 'okyu', 118, 'Kichihin, Yavhen',
  1200, 1337, 977.28, 0, 0,
  977.28, 0, 'ueberwiesen', '7.4.2026', 'Revolut Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  140, 'Mär 2026', 'okyu', 114, 'Kusnadi, Kusnadi',
  3000, 3137, 1991.09, 0, 0,
  1900, 700, 'dauerauftrag', '31.03.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  141, 'Mär 2026', 'okyu', 116, 'Le, Minh Thu',
  1050, 1187, 796.63, 0, 0,
  700, 0, 'dauerauftrag', '28.02.2026', 'Revolut Ultra',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  142, 'Mär 2026', 'okyu', 28, 'Luong, Michael',
  2100, 2237, 1472.81, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  143, 'Mär 2026', 'okyu', 89, 'Murati, Besmir',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  144, 'Mär 2026', 'okyu', 117, 'Nguyen, Duc Cuong',
  3010, 3147, 1999.03, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  145, 'Mär 2026', 'okyu', 93, 'Nguyen, Duc Nam',
  5000, 5137, 3081.63, 0, 0,
  3079.18, 1000, 'dauerauftrag', '30.03.2026', 'Revolut Ultra',
  'gezahlt', '8.4.2026', 4000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  146, 'Mär 2026', 'okyu', 52, 'Nguyen, Khanh Ly',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  147, 'Mär 2026', 'okyu', 123, 'Nguyen, Ngoc huyen',
  603, 603, 603, 0, 0,
  0, 2700, 'offen', '', '',
  'gezahlt', '5.4.2026', 2700, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  148, 'Mär 2026', 'okyu', 115, 'Nguyen, Thanh Ha',
  2400, 2537, 1652.48, 0, 0,
  1600, 900, 'ueberwiesen', '7.4.2026', 'Revolut Okyu',
  'gezahlt', '5.4.2026', 2500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  149, 'Mär 2026', 'okyu', 94, 'Nguyen, Thi Tuyet',
  1800, 1937, 1309.75, 0, 0,
  1300, 1850, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 3150, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  150, 'Mär 2026', 'okyu', 109, 'Nguyen, Trung Hoang Bao',
  2400, 2537, 1655.29, 0, 0,
  1400, 1400, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 2800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  151, 'Mär 2026', 'okyu', 110, 'Nguyen, Van Son',
  3010, 3147, 1999.03, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  152, 'Mär 2026', 'okyu', 80, 'Paulino, Vanessa',
  5000, 5137, 3066.44, 0, 0,
  3583.07, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  153, 'Mär 2026', 'okyu', 121, 'Pham, Ngoc Anh',
  4000, 4137, 0, 0, 0,
  2900, 0, 'ueberwiesen', '7.4.2026', 'Revolut Okyu',
  'offen', '', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  154, 'Mär 2026', 'okyu', 54, 'Pham, Thuy Trang',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  155, 'Mär 2026', 'okyu', 124, 'Stanikzai, Nimatullah',
  603, 603, 603, 0, 0,
  600, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  156, 'Mär 2026', 'okyu', 36, 'Trajkoska, Irena',
  520, 520, 520, 0, 0,
  520, 0, 'dauerauftrag', '2.4.2026', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  157, 'Mär 2026', 'okyu', 108, 'Vu, Thi Ngoc',
  955, 1092, 721.9, 0, 0,
  700, 0, 'dauerauftrag', '30.03.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  158, 'Mär 2026', 'okyu', 65, 'Vu, Thu Phuong',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  159, 'Mär 2026', 'origami', 125, 'Alakhel, Ibrahim',
  3400, 3537, 2215.53, 0, 0,
  1900, 1480, 'dauerauftrag', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 3380, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  160, 'Mär 2026', 'origami', 134, 'Duong, Quoc Trung',
  2800, 2937, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  161, 'Mär 2026', 'origami', 105, 'Fousseni, Mohamed',
  2800, 2937, 2966.57, 0, 0,
  700, 1300, 'dauerauftrag', '27.03.2026', 'Commerzbank Origami',
  'gezahlt', '5.4.2026', 2000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  162, 'Mär 2026', 'origami', 63, 'Murati, Besmir',
  4000, 4137, 2540.8, 0, 0,
  2500, 900, 'dauerauftrag', '31.03.2026', 'Commerzbank Origami',
  'gezahlt', '5.4.2026', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  163, 'Mär 2026', 'origami', 138, 'Nguyen, Chi Linh',
  603, 603, 603, 0, 0,
  0, 500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  164, 'Mär 2026', 'origami', 118, 'Nguyen, Dinh Son',
  1392, 1392, 949.51, 0, 0,
  700, 800, 'dauerauftrag', '30.03.2026', 'Commerzbank Origami',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  165, 'Mär 2026', 'origami', 147, 'Nguyen, Duc Sieu',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  166, 'Mär 2026', 'origami', 142, 'Nguyen, Ha Linh',
  1092, 1092, 723.53, 0, 0,
  700, 500, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  167, 'Mär 2026', 'origami', 122, 'Nguyen, Hai My',
  5700, 5837, 3408.06, 0, 0,
  3838.11, 0, 'dauerauftrag', '30.03.2026', 'Commerzbank Origami',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  168, 'Mär 2026', 'origami', 143, 'Nguyen, Thanh Ha',
  600, 600, 600, 0, 0,
  500, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  169, 'Mär 2026', 'origami', 129, 'Nguyen, Thi Hong',
  5000, 5887, 2840.89, 0, 0,
  3000, 0, 'dauerauftrag', '30.03.2026', 'Revolut Ultra',
  'offen', '', 4000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  170, 'Mär 2026', 'origami', 139, 'Nguyen, Thi Huong',
  1250, 1387, 1004.32, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  171, 'Mär 2026', 'origami', 205, 'Nguyen, Thi Tuyet',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  172, 'Mär 2026', 'origami', 149, 'Nguyen, Thi Tuyet',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  173, 'Mär 2026', 'origami', 141, 'Nguyen, Tuan Hai',
  1250, 1387, 1004.32, 0, 0,
  0, 1500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  175, 'Mär 2026', 'origami', 148, 'Nguyen, Van Tung',
  603, 603, 603, 0, 0,
  500, 0, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  176, 'Mär 2026', 'origami', 146, 'Paulino, Vanessa',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  177, 'Mär 2026', 'origami', 123, 'Pham, Ngoc Anh',
  603, 603, 603, 0, 0,
  0, 500, 'offen', '', '',
  'gezahlt', '9.4.2026', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  178, 'Mär 2026', 'origami', 116, 'Rau, Ina',
  520, 520, 520, 0, 0,
  520, 0, 'dauerauftrag', '30.03.2026', 'Commerzbank Origami',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  179, 'Mär 2026', 'origami', 132, 'Shirni, Mustafa',
  2400, 2537, 1668.47, 0, 0,
  1500, 1500, 'dauerauftrag', '31.03.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 3000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  181, 'Mär 2026', 'origami', 133, 'Stanikzai, Nimatullah',
  2800, 1664.3, 1065.84, 0, 0,
  1900, 900, 'ueberwiesen', '7.4.2026', 'Revolut Ultra',
  'gezahlt', '5.4.2026', 2900, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  182, 'Mär 2026', 'origami', 145, 'Truong, Quang Tung',
  603, 603, 603, 0, 0,
  0, 1000, 'offen', '', '',
  'gezahlt', '5.4.2026', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  183, 'Mär 2026', 'origami', 130, 'Vu, Hoang Ngoc Minh',
  603, 603, 603, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  184, 'Mär 2026', 'origami', 136, 'Vu, Thi Ngoc',
  603, 603, 603, 0, 0,
  0, 500, 'offen', '', '',
  'gezahlt', '5.4.2026', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  100, 'Apr 2026', 'enso', 1000, 'Dao, Chien Thang',
  2780, 2780, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  101, 'Apr 2026', 'enso', 47, 'Dao, Son Hai',
  1600, 1737, 1264.02, 0, 1264.02,
  1250, 1900, 'dauerauftrag', '27.04.2026', 'Commerzbank Enso',
  'offen', '', 3150, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  102, 'Apr 2026', 'enso', 192, 'Do, Hoanh Duc',
  2850, 2987, 1906.85, 0, 1906.85,
  1900, 0, 'dauerauftrag', '01.04.2026', 'Revolut Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  103, 'Apr 2026', 'enso', 106, 'Doan, Hai Hoang',
  5000, 5137, 2544.09, 0, 2544.09,
  0, 0, 'offen', '', '',
  'offen', '', 3594.13, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  104, 'Apr 2026', 'enso', 1, 'Duong, Thi Vuong',
  5500, 6353.26, 3121.24, 0, 3121.24,
  2000, 0, 'dauerauftrag', '15.04.2026', 'Commerzbank Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  105, 'Apr 2026', 'enso', 205, 'Fousseni, Mohamed',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  106, 'Apr 2026', 'enso', 199, 'Hallmann, Dao Tien Huy',
  5000, 5137, 3473.55, 0, 3473.55,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  107, 'Apr 2026', 'enso', 206, 'Huynh, Phuc Hung',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  108, 'Apr 2026', 'enso', 127, 'Itota, Nelson',
  1800, 1937, 1320.08, 0, 1320.08,
  1300.16, 1500, 'dauerauftrag', '27.04.2026', 'Commerzbank Enso',
  'offen', '', 2800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  109, 'Apr 2026', 'enso', 123, 'Khan, Bashi',
  556, 556, 556, 0, 556,
  0, 1200, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  110, 'Apr 2026', 'enso', 194, 'Le, Minh Thu',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  111, 'Apr 2026', 'enso', 203, 'Luong, Thi Lan',
  1800, 1937, 1219.13, 0, 1219.13,
  1200, 1400, 'dauerauftrag', '02.04.2026', '',
  'offen', '', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  112, 'Apr 2026', 'enso', 179, 'Nguyen, Chi Linh',
  1092, 2184, 716.98, 0, 716.98,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  113, 'Apr 2026', 'enso', 9, 'Nguyen, Duc Duong',
  5000, 5137, 3061.39, 0, 3061.39,
  3024.66, 0, 'dauerauftrag', '15.04.2026', 'Commerzbank Enso',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  114, 'Apr 2026', 'enso', 1001, 'Nguyen, Ha Linh',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  115, 'Apr 2026', 'enso', 198, 'Nguyen, Hai My',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  116, 'Apr 2026', 'enso', 142, 'Nguyen, Sy Chien',
  520, 603, 520, 0, 520,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  117, 'Apr 2026', 'enso', 148, 'Nguyen, Thi Lan Anh',
  2850, 2987, 1909.07, 0, 1909.07,
  0, 0, 'offen', '', '',
  'offen', '', 1900, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  118, 'Apr 2026', 'enso', 189, 'Nguyen, Thi Thuy',
  1250, 1387, 1004.32, 0, 1004.32,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  119, 'Apr 2026', 'enso', 94, 'Nguyen, Trung Hoang Bao',
  0, 603, 603, 0, 603,
  600, 0, 'dauerauftrag', '01.04.2026', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  122, 'Apr 2026', 'enso', 195, 'Nguyen, Van Tung',
  2850, 2987, 1909.07, 0, 1909.07,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  123, 'Apr 2026', 'enso', 197, 'Nguyen, Van Tung',
  1885, 2022, 1352.13, 0, 1352.13,
  0, 1200, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  126, 'Apr 2026', 'enso', 136, 'Pham, Quynh Huong',
  556, 603, 556, 0, 556,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  127, 'Apr 2026', 'enso', 202, 'Pham, Thi Tham',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  128, 'Apr 2026', 'enso', 191, 'Pham, Thi Thu',
  2000, 2137, 1429.48, 0, 1429.48,
  1400, 1200, 'dauerauftrag', '30.04.2026', 'Revolut Enso',
  'offen', '', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  129, 'Apr 2026', 'enso', 90, 'Trac, Thanh Loan',
  2000, 2137, 1549.21, 0, 1549.21,
  1400, 2000, 'dauerauftrag', '30.04.2026', 'Commerzbank Enso',
  'offen', '', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  130, 'Apr 2026', 'enso', 201, 'Tran, Tony',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  131, 'Apr 2026', 'enso', 200, 'Truong, Quang Tung',
  1187, 1187, 798.41, 0, 798.41,
  0, 0, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  132, 'Apr 2026', 'okyu', 41, 'Amanzada, Mohammad Ibrahim',
  3000, 3137, 1590.96, 0, 1590.96,
  0, 600, 'offen', '', '',
  'offen', '', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  134, 'Apr 2026', 'okyu', 120, 'Bechthold, Tamara',
  1668, 1805, 1239.53, 0, 1239.53,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  135, 'Apr 2026', 'okyu', 111, 'Chu, Minh Chien',
  3010, 3147, 1999.03, 0, 1999.03,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  136, 'Apr 2026', 'okyu', 67, 'Doan, Hai Hoang',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  137, 'Apr 2026', 'okyu', 96, 'Dolwig, Björn',
  500, 500, 500, 0, 500,
  500, 0, 'dauerauftrag', '28.04.2026', 'Commerzbank Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  138, 'Apr 2026', 'okyu', 102, 'Dolwig, Nadine',
  50, 50, 50, 0, 50,
  50, 0, 'dauerauftrag', '28.04.2026', 'Commerzbank Okyu',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  139, 'Apr 2026', 'okyu', 118, 'Kichihin, Yavhen',
  1200, 1337, 977.28, 0, 977.28,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  140, 'Apr 2026', 'okyu', 114, 'Kusnadi, Kusnadi',
  3000, 3137, 1991.09, 0, 1991.09,
  1900, 700, 'dauerauftrag', '30.04.2026', 'Revolut Ultra',
  'offen', '', 2600, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  141, 'Apr 2026', 'okyu', 116, 'Le, Minh Thu',
  1050, 1187, 796.63, 0, 796.63,
  700, 0, 'dauerauftrag', '28.04.2026', 'Revolut Ultra',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  143, 'Apr 2026', 'okyu', 89, 'Murati, Besmir',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  144, 'Apr 2026', 'okyu', 117, 'Nguyen, Duc Cuong',
  3010, 3147, 1999.03, 0, 1999.03,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  145, 'Apr 2026', 'okyu', 93, 'Nguyen, Duc Nam',
  5000, 5137, 3081.63, 0, 3081.63,
  3079.18, 1000, 'dauerauftrag', '30.04.2026', 'Revolut Ultra',
  'offen', '', 4000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  146, 'Apr 2026', 'okyu', 52, 'Nguyen, Khanh Ly',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  147, 'Apr 2026', 'okyu', 123, 'Nguyen, Ngoc huyen',
  603, 603, 603, 0, 603,
  0, 2700, 'offen', '', '',
  'offen', '', 2700, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  148, 'Apr 2026', 'okyu', 115, 'Nguyen, Thanh Ha',
  2400, 2537, 1652.48, 0, 1652.48,
  0, 900, 'offen', '', '',
  'offen', '', 2500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  149, 'Apr 2026', 'okyu', 94, 'Nguyen, Thi Tuyet',
  1800, 1937, 1309.75, 0, 1309.75,
  0, 1850, 'offen', '', '',
  'offen', '', 3150, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  150, 'Apr 2026', 'okyu', 109, 'Nguyen, Trung Hoang Bao',
  2400, 2537, 1655.29, 0, 1655.29,
  0, 1400, 'offen', '', '',
  'offen', '', 2800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  151, 'Apr 2026', 'okyu', 110, 'Nguyen, Van Son',
  3010, 3147, 1999.03, 0, 1999.03,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  152, 'Apr 2026', 'okyu', 80, 'Paulino, Vanessa',
  5000, 5137, 3066.44, 0, 3066.44,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  153, 'Apr 2026', 'okyu', 121, 'Pham, Ngoc Anh',
  4000, 4137, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  154, 'Apr 2026', 'okyu', 54, 'Pham, Thuy Trang',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  155, 'Apr 2026', 'okyu', 124, 'Stanikzai, Nimatullah',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  156, 'Apr 2026', 'okyu', 36, 'Trajkoska, Irena',
  520, 520, 520, 0, 520,
  520, 0, 'dauerauftrag', '02.04.2026', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  157, 'Apr 2026', 'okyu', 108, 'Vu, Thi Ngoc',
  955, 1092, 721.9, 0, 721.9,
  700, 0, 'dauerauftrag', '30.04.2026', 'Revolut Ultra',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  158, 'Apr 2026', 'okyu', 65, 'Vu, Thu Phuong',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  159, 'Apr 2026', 'origami', 125, 'Alakhel, Ibrahim',
  3400, 3537, 2215.53, 0, 2215.53,
  1900, 1480, 'dauerauftrag', '07.04.2026', 'Revolut Ultra',
  'offen', '', 3380, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  160, 'Apr 2026', 'origami', 134, 'Duong, Quoc Trung',
  2800, 2937, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  161, 'Apr 2026', 'origami', 105, 'Fousseni, Mohamed',
  2800, 1192, 2966.57, 0, 2966.57,
  700, 1300, 'dauerauftrag', '27.04.2026', 'Commerzbank Origami',
  'offen', '', 2000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  162, 'Apr 2026', 'origami', 63, 'Murati, Besmir',
  4000, 4137, 2540.8, 0, 2540.8,
  2500, 900, 'dauerauftrag', '30.04.2026', 'Commerzbank Origami',
  'offen', '', 3400, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  163, 'Apr 2026', 'origami', 138, 'Nguyen, Chi Linh',
  603, 603, 603, 0, 603,
  0, 500, 'offen', '', '',
  'offen', '', 1800, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  164, 'Apr 2026', 'origami', 118, 'Nguyen, Dinh Son',
  1392, 1392, 949.51, 0, 949.51,
  700, 800, 'dauerauftrag', '30.04.2026', 'Commerzbank Origami',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  165, 'Apr 2026', 'origami', 147, 'Nguyen, Duc Sieu',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  166, 'Apr 2026', 'origami', 142, 'Nguyen, Ha Linh',
  1092, 1092, 723.53, 0, 723.53,
  0, 500, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  167, 'Apr 2026', 'origami', 122, 'Nguyen, Hai My',
  5700, 5837, 3408.06, 0, 3408.06,
  3838.11, 0, 'dauerauftrag', '30.04.2026', 'Commerzbank Origami',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  168, 'Apr 2026', 'origami', 143, 'Nguyen, Thanh Ha',
  600, 600, 600, 0, 600,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  169, 'Apr 2026', 'origami', 129, 'Nguyen, Thi Hong',
  5000, 5887, 2840.89, 0, 2840.89,
  3000, 0, 'dauerauftrag', '30.04.2026', 'Revolut Ultra',
  'offen', '', 4000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  170, 'Apr 2026', 'origami', 139, 'Nguyen, Thi Huong',
  1250, 1387, 1004.32, 0, 1004.32,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  171, 'Apr 2026', 'origami', 205, 'Nguyen, Thi Tuyet',
  603, 603, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  172, 'Apr 2026', 'origami', 149, 'Nguyen, Thi Tuyet',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  173, 'Apr 2026', 'origami', 141, 'Nguyen, Tuan Hai',
  1250, 1387, 1004.32, 0, 1004.32,
  0, 1500, 'offen', '', '',
  'offen', '', 1500, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  175, 'Apr 2026', 'origami', 148, 'Nguyen, Van Tung',
  603, 603, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  176, 'Apr 2026', 'origami', 146, 'Paulino, Vanessa',
  603, 600, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  177, 'Apr 2026', 'origami', 123, 'Pham, Ngoc Anh',
  603, 603, 603, 0, 603,
  0, 500, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  178, 'Apr 2026', 'origami', 116, 'Rau, Ina',
  520, 520, 520, 0, 520,
  520, 0, 'dauerauftrag', '30.04.2026', 'Commerzbank Origami',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  179, 'Apr 2026', 'origami', 132, 'Shirni, Mustafa',
  2400, 2537, 1668.47, 0, 1668.47,
  1500, 1500, 'dauerauftrag', '30.04.2026', 'Revolut Ultra',
  'offen', '', 3000, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  181, 'Apr 2026', 'origami', 133, 'Stanikzai, Nimatullah',
  2800, 2937, 1065.84, 0, 1065.84,
  0, 900, 'offen', '', '',
  'offen', '', 2900, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  180, 'Apr 2026', 'origami', 204, 'Stanikzai, Nimatullah',
  2800, 2937, 0, 0, 0,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  182, 'Apr 2026', 'origami', 145, 'Truong, Quang Tung',
  603, 603, 603, 0, 603,
  0, 1000, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  183, 'Apr 2026', 'origami', 130, 'Vu, Hoang Ngoc Minh',
  603, 2800, 603, 0, 603,
  0, 0, 'offen', '', '',
  'offen', '', 0, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

INSERT INTO gehaelter (
  emp_id, monat, betrieb, pers_nr, name,
  gehalt, brutto, netto, abzuege, netto_ausz,
  ueberweisung, bar_tg, ue_status, ue_datum, ue_bank,
  bar_status, bar_datum, ziel_gehalt, notiz
) VALUES (
  184, 'Apr 2026', 'origami', 136, 'Vu, Thi Ngoc',
  603, 603, 603, 0, 603,
  0, 500, 'offen', '', '',
  'offen', '', 1200, ''
) ON CONFLICT (pers_nr, betrieb, monat) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- DONE: 85 employees + 156 gehaelter
-- ═══════════════════════════════════════════════════════════
