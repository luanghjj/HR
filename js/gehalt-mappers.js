// ═══════════════════════════════════════════════════════════
// gehalt-mappers.js — DB ↔ App Data Mapping (Global)
// ═══════════════════════════════════════════════════════════

function gmMapGehaltFromDB(row) {
  return {
    id: row.id, monat: row.monat, betrieb: row.betrieb, persNr: row.pers_nr,
    name: row.name, eintritt: row.eintritt || '',
    gehalt: parseFloat(row.gehalt)||0, brutto: parseFloat(row.brutto)||0,
    netto: parseFloat(row.netto)||0, abzuege: parseFloat(row.abzuege)||0,
    prozent: parseFloat(row.prozent)||0, netto_ausz: parseFloat(row.netto_ausz)||0,
    ueberweisung: parseFloat(row.ueberweisung)||0, bar_tg: parseFloat(row.bar_tg)||0,
    ue_status: row.ue_status||'offen', ue_datum: row.ue_datum||'', ue_bank: row.ue_bank||'',
    bar_status: row.bar_status||'offen', bar_datum: row.bar_datum||'',
    ziel_gehalt: parseFloat(row.ziel_gehalt)||0, notiz: row.notiz||'',
    stb_importiert: row.stb_importiert||false,
    stb_steuerBrutto: parseFloat(row.stb_steuer_brutto)||0,
    stb_lohnsteuer: parseFloat(row.stb_lohnsteuer)||0,
    stb_kist: parseFloat(row.stb_kist)||0, stb_soli: parseFloat(row.stb_soli)||0,
    stb_svAN: parseFloat(row.stb_sv_an)||0, stb_svAG: parseFloat(row.stb_sv_ag)||0,
    stb_kvAN: parseFloat(row.stb_kv_an)||0, stb_rvAN: parseFloat(row.stb_rv_an)||0,
    stb_avAN: parseFloat(row.stb_av_an)||0, stb_pvAN: parseFloat(row.stb_pv_an)||0,
    stb_kvAG: parseFloat(row.stb_kv_ag)||0, stb_rvAG: parseFloat(row.stb_rv_ag)||0,
    stb_avAG: parseFloat(row.stb_av_ag)||0, stb_pvAG: parseFloat(row.stb_pv_ag)||0,
    stb_nettoverdienst: parseFloat(row.stb_nettoverdienst)||0,
    stb_nettoabzuege: parseFloat(row.stb_nettoabzuege)||0,
    stb_auszahlung: parseFloat(row.stb_auszahlung)||0,
    stb_lohnarten: row.stb_lohnarten||[], stb_nba: row.stb_nba||null, stb_name: row.stb_name||'',
  };
}

function gmMapGehaltToDB(obj) {
  return {
    monat: obj.monat, betrieb: obj.betrieb, pers_nr: obj.persNr, name: obj.name,
    eintritt: obj.eintritt||'', gehalt: obj.gehalt||0, brutto: obj.brutto||0,
    netto: obj.netto||0, abzuege: obj.abzuege||0, prozent: obj.prozent||0,
    netto_ausz: obj.netto_ausz||0, ueberweisung: obj.ueberweisung||0, bar_tg: obj.bar_tg||0,
    ue_status: obj.ue_status||'offen', ue_datum: obj.ue_datum||'', ue_bank: obj.ue_bank||'',
    bar_status: obj.bar_status||'offen', bar_datum: obj.bar_datum||'',
    ziel_gehalt: obj.ziel_gehalt||0, notiz: obj.notiz||'',
    stb_importiert: obj.stb_importiert||false, stb_steuer_brutto: obj.stb_steuerBrutto||0,
    stb_lohnsteuer: obj.stb_lohnsteuer||0, stb_kist: obj.stb_kist||0, stb_soli: obj.stb_soli||0,
    stb_sv_an: obj.stb_svAN||0, stb_sv_ag: obj.stb_svAG||0,
    stb_kv_an: obj.stb_kvAN||0, stb_rv_an: obj.stb_rvAN||0,
    stb_av_an: obj.stb_avAN||0, stb_pv_an: obj.stb_pvAN||0,
    stb_kv_ag: obj.stb_kvAG||0, stb_rv_ag: obj.stb_rvAG||0,
    stb_av_ag: obj.stb_avAG||0, stb_pv_ag: obj.stb_pvAG||0,
    stb_nettoverdienst: obj.stb_nettoverdienst||0, stb_nettoabzuege: obj.stb_nettoabzuege||0,
    stb_auszahlung: obj.stb_auszahlung||0, stb_lohnarten: obj.stb_lohnarten||[],
    stb_nba: obj.stb_nba||null, stb_name: obj.stb_name||'',
  };
}

function gmMapMitarbeiterFromDB(row) {
  return {
    id: row.id, persNr: row.pers_nr, betrieb: row.betrieb, name: row.name,
    mittelname: row.mittelname||'', person_id: row.person_id||'',
    ignore_link: row.ignore_link||[], eintritt: row.eintritt||'', austritt: row.austritt||'',
    aktiv: row.aktiv !== false,
    gehalt: parseFloat(row.gehalt)||0, brutto: parseFloat(row.brutto)||0, netto: parseFloat(row.netto)||0,
    stamm: {
      typ: row.typ||'', eurStd: parseFloat(row.eur_std)||0,
      stdWoche: parseFloat(row.std_woche)||0, stdMonat: parseFloat(row.std_monat)||0,
      steuerklasse: row.steuerklasse||'', steuerId: row.steuer_id||'',
      svNr: row.sv_nr||'', krankenkasse: row.krankenkasse||'',
      iban: row.iban||'', geburtsdatum: row.geburtsdatum||'',
      nationalitaet: row.nationalitaet||'', adresse: row.adresse||'',
      aufenthaltstitel: row.aufenthaltstitel||'', arbeitserlaubnisBis: row.arbeitserlaubnis_bis||'',
    },
    extras: {
      kita: parseFloat(row.benefit_kita)||0, jobticket: parseFloat(row.benefit_jobticket)||0,
      jobrad: parseFloat(row.benefit_jobrad)||0, erholung: parseFloat(row.benefit_erholung)||0,
      diensthandy: row.benefit_diensthandy||false, gesundheit: parseFloat(row.benefit_gesundheit)||0,
      custom: row.extras_custom||[],
    },
    stb_name: row.stb_name||'', ma_notiz: row.ma_notiz||'', std_lohnarten: row.std_lohnarten||[],
  };
}

function gmMapMitarbeiterToDB(obj) {
  return {
    pers_nr: obj.persNr, betrieb: obj.betrieb, name: obj.name,
    mittelname: obj.mittelname||'', person_id: obj.person_id||'',
    ignore_link: obj.ignore_link||[], eintritt: obj.eintritt||'', austritt: obj.austritt||'',
    aktiv: obj.aktiv !== false, gehalt: obj.gehalt||0, brutto: obj.brutto||0, netto: obj.netto||0,
    typ: obj.stamm?.typ||'', eur_std: obj.stamm?.eurStd||0,
    std_woche: obj.stamm?.stdWoche||0, std_monat: obj.stamm?.stdMonat||0,
    steuerklasse: obj.stamm?.steuerklasse||'', steuer_id: obj.stamm?.steuerId||'',
    sv_nr: obj.stamm?.svNr||'', krankenkasse: obj.stamm?.krankenkasse||'',
    iban: obj.stamm?.iban||'', geburtsdatum: obj.stamm?.geburtsdatum||'',
    nationalitaet: obj.stamm?.nationalitaet||'', adresse: obj.stamm?.adresse||'',
    aufenthaltstitel: obj.stamm?.aufenthaltstitel||'',
    arbeitserlaubnis_bis: obj.stamm?.arbeitserlaubnisBis||'',
    benefit_kita: obj.extras?.kita||0, benefit_jobticket: obj.extras?.jobticket||0,
    benefit_jobrad: obj.extras?.jobrad||0, benefit_erholung: obj.extras?.erholung||0,
    benefit_diensthandy: obj.extras?.diensthandy||false, benefit_gesundheit: obj.extras?.gesundheit||0,
    extras_custom: obj.extras?.custom||[],
    stb_name: obj.stb_name||'', ma_notiz: obj.ma_notiz||'', std_lohnarten: obj.std_lohnarten||[],
  };
}
