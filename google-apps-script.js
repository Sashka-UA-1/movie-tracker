// ═══════════════════════════════════════════════════════════════
// google-apps-script.js
//
// Вставити у Google Sheets → Розширення → Apps Script
//
// ПІСЛЯ ВСТАВКИ:
//   1. Зберегти (Ctrl+S)
//   2. Розгорнути → Нове розгортання
//      - Тип: Веб-застосунок
//      - Виконувати як: Я (your Google account)
//      - Доступ: Усі (анонімно) ← обов'язково!
//   3. Авторизувати доступ до таблиці
//   4. Скопіювати URL виду:
//      https://script.google.com/macros/s/AKfy.../exec
//      → вставити у src/api/sheets.ts як SCRIPT_URL
//
// СТРУКТУРА ТАБЛИЦІ (рядок 4 = заголовок, дані з рядка 5):
//   A = тип  (Теле-шоу / Мультик / Фільм)
//   B = назва (Title)
//   C = статус (ігнорується — авто з оцінок)
//   D = нотатка (Note)
//   E = Rate  (ігнорується)
//   F = оцінка Яся
//   G = оцінка Діма
//   H = оцінка Женя
//   I = оцінка Саша
// ═══════════════════════════════════════════════════════════════

var DATA_START_ROW = 5;

var TYPE_MAP = {
  'Теле-шоу': 'series',
  'Мультик':  'cartoon',
  'Фільм':    'movie',
  'ФІльм':    'movie',
  'Фільм ':   'movie',
};

// 0-based індекси у масиві рядка (A=0, B=1, ...)
var RATING_COLS = {
  yasya:  5, // колонка F
  dima:   6, // колонка G
  zhenya: 7, // колонка H
  sasha:  8, // колонка I
};

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

// ═══════════════════════════════════════════════════════════════
// doGet — обробляє ВСІ запити з браузера (і читання, і запис).
//
// Чому все через GET, а не POST?
// Apps Script Web App з анонімним доступом не підтримує CORS
// для POST-запитів з браузера. GET — підтримує.
//
// Маршрути (параметр ?action=...):
//   GET ?action=list          → повертає всі фільми
//   GET ?action=rate&...      → зберігає оцінку
// ═══════════════════════════════════════════════════════════════
function doGet(e) {
  var params = e.parameter;
  var action = params.action || 'list';

  try {
    if (action === 'list') {
      return handleList();
    }
    if (action === 'rate') {
      return handleRate(params);
    }
    return ok({ error: 'Невідома дія: ' + action });

  } catch (err) {
    return ok({ ok: false, error: err.message });
  }
}

// ── Список фільмів ────────────────────────────────────────────
function handleList() {
  var sheet   = getSheet();
  var lastRow = sheet.getLastRow();
  var movies  = [];

  if (lastRow >= DATA_START_ROW) {
    var values = sheet
      .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 9)
      .getValues();

    values.forEach(function(row, i) {
      var title = String(row[1] || '').trim();
      if (!title) return; // пропускаємо порожні рядки

      // Збираємо оцінки — тільки валідні 1–5
      var ratings = {};
      Object.keys(RATING_COLS).forEach(function(pid) {
        var val = parseInt(row[RATING_COLS[pid]], 10);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          ratings[pid] = val;
        }
      });

      movies.push({
        id:        'row_' + (DATA_START_ROW + i),
        title:     title,
        type:      TYPE_MAP[String(row[0]).trim()] || 'movie',
        note:      String(row[3] || '').trim(),
        ratings:   ratings,
        createdAt: i,
      });
    });
  }

  return ok({ ok: true, data: movies });
}

// ── Збереження оцінки ─────────────────────────────────────────
// Параметри: id=row_5 & profileId=yasya & rating=4
function handleRate(params) {
  var id        = params.id;
  var profileId = params.profileId;
  var rating    = parseInt(params.rating, 10);

  // Валідація
  if (!id || !profileId) {
    return ok({ ok: false, error: 'Потрібні параметри: id, profileId, rating' });
  }
  if (!RATING_COLS.hasOwnProperty(profileId)) {
    return ok({ ok: false, error: 'Невідомий профіль: ' + profileId });
  }

  var rowNum = parseInt(id.replace('row_', ''), 10);
  if (isNaN(rowNum) || rowNum < DATA_START_ROW) {
    return ok({ ok: false, error: 'Невалідний id: ' + id });
  }

  var sheet  = getSheet();
  // +1 бо getRange використовує 1-based індекси
  var colNum = RATING_COLS[profileId] + 1;
  var cell   = sheet.getRange(rowNum, colNum);

  if (!isNaN(rating) && rating >= 1 && rating <= 5) {
    cell.setValue(rating);   // записуємо оцінку
  } else {
    cell.clearContent();     // 0 або некоректне = прибрати оцінку
  }

  return ok({ ok: true });
}

// ── Допоміжна: повернути JSON-відповідь ──────────────────────
function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Меню у таблиці ───────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎬 Кінотрекер')
    .addItem('🔗 Показати URL скрипту', 'showScriptUrl')
    .addToUi();
}

function showScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert(
    'URL для React застосунку:\n\n' + url +
    '\n\nВстав це у src/api/sheets.ts як SCRIPT_URL'
  );
}
