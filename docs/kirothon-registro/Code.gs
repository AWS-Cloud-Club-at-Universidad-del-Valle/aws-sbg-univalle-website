const HEADERS = [
  'Fecha', 'Equipo', 'Líder nombre', 'Líder correo', 'Integrante 2 nombre',
  'Integrante 2 correo', 'Integrante 3 nombre', 'Integrante 3 correo', 'Meetup', 'Consentimiento',
];
const EMAIL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch {
    return failure('La solicitud de inscripción no es válida.');
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return failure('La solicitud de inscripción no es válida.');
  }
  if (payload.website) return json({ ok: true });

  const team = clean(payload.team);
  if (team.length < 2 || team.length > 60) {
    return failure('Escribe un nombre de equipo de 2 a 60 caracteres.');
  }
  if (!Array.isArray(payload.members) || payload.members.length !== 3) {
    return failure('El equipo debe tener exactamente 3 integrantes.');
  }
  if (payload.meetup !== true || payload.consent !== true) {
    return failure('Confirma tu asistencia en Meetup y autoriza el tratamiento de datos.');
  }

  const members = payload.members.map((member) => ({
    name: clean(member?.name),
    email: clean(member?.email).toLowerCase(),
  }));
  const emails = new Set();
  for (const [index, member] of members.entries()) {
    if (!/^\S+\s+\S/.test(member.name)) {
      return failure(`Escribe al menos dos palabras para el nombre del integrante ${index + 1}.`);
    }
    if (!EMAIL_PATTERN.test(member.email)) {
      return failure(`Escribe un correo válido para el integrante ${index + 1}.`);
    }
    if (emails.has(member.email)) return failure('Los correos de los integrantes deben ser distintos.');
    emails.add(member.email);
  }

  const lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) return failure('El registro está ocupado en este momento.');
    // Si el script está ligado a la hoja (Extensiones → Apps Script) usa esa hoja;
    // si no, la propiedad SPREADSHEET_ID.
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    const spreadsheet = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Equipos') || spreadsheet.insertSheet('Equipos');
    const rows = sheet.getLastRow();
    if (rows === 0) sheet.appendRow(HEADERS);
    if (rows > 1) {
      const existing = sheet.getRange(2, 1, rows - 1, HEADERS.length).getValues();
      for (const row of existing) {
        if (clean(String(row[1])).toLowerCase() === team.toLowerCase()) {
          return failure('Ya hay un equipo inscrito con ese nombre.');
        }
        if ([row[3], row[5], row[7]].some((email) => emails.has(clean(email).toLowerCase()))) {
          return failure('Al menos uno de los correos ya está inscrito en otro equipo.');
        }
      }
    }

    sheet.appendRow([
      new Date(), sheetText(team),
      ...members.flatMap(({ name, email }) => [sheetText(name), sheetText(email)]),
      true, true,
    ]);
    SpreadsheetApp.flush();
    return json({ ok: true });
  } catch {
    return failure('No pudimos guardar la inscripción en este momento.');
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sheetText(value) {
  // Guarda el texto literalmente, incluso si comienza con un operador de fórmula.
  return "'" + value;
}

function failure(error) {
  return json({ ok: false, error });
}

function json(result) {
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ejecútala una vez desde el editor: autoriza el script y prepara la pestaña Equipos.
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Equipos') || spreadsheet.insertSheet('Equipos', 0);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#9046FF').setFontColor('#FFFFFF');
  const blank = spreadsheet.getSheetByName('Hoja 1');
  if (blank && blank.getLastRow() === 0 && spreadsheet.getSheets().length > 1) spreadsheet.deleteSheet(blank);
}
