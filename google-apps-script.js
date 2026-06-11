// ═══════════════════════════════════════════════════════════════
// google-apps-script.js
//
// СТРУКТУРА ТАБЛИЦІ:
//   A = тип  (Теле-шоу / Мультик / Фільм / Серіал / Аніме)
//   B = назва (Title)
//   C = статус (ігнорується)
//   D = нотатка (Note)
//   E = Rate  (ігнорується)
//   F = оцінка Яся
//   G = оцінка Діма
//   H = оцінка Женя
//   I = оцінка Саша
//   J = хто додав (відображуване ім'я: Яся/Діма/Женя/Саша)
//
// Рядок 3 = заголовок, дані з рядка 4
// ═══════════════════════════════════════════════════════════════

var DATA_START_ROW = 4; // перший рядок з даними

var TYPE_MAP = {
  'Теле-шоу': 'tvshow',
  'Мультик': 'cartoon',
  'Мульт': 'cartoon',
  'Фільм': 'movie',
  'Серіал': 'series',
  'Аніме': 'anime',
};

var TYPE_MAP_REVERSE = {
  'movie': 'Фільм',
  'series': 'Серіал',
  'cartoon': 'Мультик',
  'tvshow': 'Теле-шоу',
  'anime': 'Аніме',
};

// 0-based індекси (A=0)
var RATING_COLS = {
  yasya: 5, // F
  dima: 6, // G
  zhenya: 7, // H
  sasha: 8, // I
};

var OWNER_COL = 9; // J — хто додав (0-based)

var OWNER_DISPLAY_NAME = {
  yasya: 'Яся',
  dima: 'Діма',
  zhenya: 'Женя',
  sasha: 'Саша',
};

var OWNER_ID_FROM_NAME = {
  'Яся': 'yasya',
  'Діма': 'dima',
  'Женя': 'zhenya',
  'Саша': 'sasha',
};

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

// ── Маршрутизація ─────────────────────────────────────────────
function doGet(e) {
  var params = e.parameter;
  var action = params.action || 'list';
  try {
    if (action === 'list') return handleList();
    if (action === 'rate') return handleRate(params);
    if (action === 'add') return handleAdd(params);
    return ok({ ok: false, error: 'Невідома дія: ' + action });
  } catch (err) {
    return ok({ ok: false, error: err.message });
  }
}

// ── Список фільмів ────────────────────────────────────────────
function handleList() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  var movies = [];

  if (lastRow >= DATA_START_ROW) {
    // Читаємо 10 колонок (A–J)
    var values = sheet
      .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 10)
      .getValues();

    values.forEach(function (row, i) {
      var title = String(row[1] || '').trim();
      if (!title) return;

      var ratings = {};
      Object.keys(RATING_COLS).forEach(function (pid) {
        var val = parseInt(row[RATING_COLS[pid]], 10);
        if (!isNaN(val) && val >= 1 && val <= 5) ratings[pid] = val;
      });

      // Колонка J — хто додав, записано як відображуване ім'я
      var ownerName = String(row[OWNER_COL] || '').trim() || 'Яся';
      var owner = OWNER_ID_FROM_NAME[ownerName] || 'yasya';

      movies.push({
        id: 'row_' + (DATA_START_ROW + i),
        title: title,
        type: TYPE_MAP[String(row[0]).trim()] || 'movie',
        note: String(row[3] || '').trim(),
        owner: owner,
        ratings: ratings,
        createdAt: i,
      });
    });
  }

  return ok({ ok: true, data: movies });
}

// ── Додати новий фільм ────────────────────────────────────────
// Записує новий рядок у таблицю + owner у колонку J
function handleAdd(params) {
  var title = params.title || '';
  var type = params.type || 'movie';
  var note = params.note || '';
  var owner = params.owner || 'yasya';
  var ownerName = OWNER_DISPLAY_NAME[owner] || 'Яся';

  if (!title.trim()) return ok({ ok: false, error: 'Назва обов\'язкова' });

  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  var newRow = Math.max(lastRow + 1, DATA_START_ROW);

  // A=тип, B=назва, C=FALSE, D=нотатка, E='', F-I=порожні оцінки, J=owner display name
  sheet.getRange(newRow, 1, 1, 10).setValues([[
    TYPE_MAP_REVERSE[type] || 'Фільм',
    title.trim(),
    false,
    note.trim(),
    '',     // E — Rate (порожньо)
    '', '', '', '', // F G H I — оцінки порожні
    ownerName,  // J — хто додав
  ]]);

  return ok({ ok: true, id: 'row_' + newRow });
}

// ── Зберегти оцінку ───────────────────────────────────────────
function handleRate(params) {
  var id = params.id;
  var profileId = params.profileId;
  var rating = parseInt(params.rating, 10);

  if (!id || !profileId) return ok({ ok: false, error: 'Потрібні: id, profileId, rating' });
  if (!RATING_COLS.hasOwnProperty(profileId)) return ok({ ok: false, error: 'Невідомий профіль: ' + profileId });

  var rowNum = parseInt(id.replace('row_', ''), 10);
  if (isNaN(rowNum) || rowNum < DATA_START_ROW) return ok({ ok: false, error: 'Невалідний id: ' + id });

  var sheet = getSheet();
  var colNum = RATING_COLS[profileId] + 1; // 1-based
  var cell = sheet.getRange(rowNum, colNum);

  if (!isNaN(rating) && rating >= 1 && rating <= 5) {
    cell.setValue(rating);
  } else {
    cell.clearContent();
  }

  return ok({ ok: true });
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎬 Кінотрекер')
    .addItem('🔗 Показати URL скрипту', 'showScriptUrl')
    .addToUi();
}

function showScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert('URL для React:\n\n' + url);
}