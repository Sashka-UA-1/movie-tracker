// ─────────────────────────────────────────────────────────────
// src/types/index.ts
//
// Усі TypeScript-типи застосунку в одному місці.
// Визначаємо один раз — імпортуємо скрізь.
// ─────────────────────────────────────────────────────────────

// ─── Профілі ─────────────────────────────────────────────────

/** Унікальні ідентифікатори чотирьох друзів */
export type ProfileId = 'yasya' | 'dima' | 'zhenya' | 'sasha'

/** Один профіль — ім'я, ініціали, кольори аватара */
export interface Profile {
  id: ProfileId
  name: string       // відображуване ім'я
  initials: string   // літера для аватара
  color: string      // фон аватара
  bgColor: string    // фон картки аватара
  textColor: string  // колір тексту аватара
  addItem: string    // відображуване ім'я хто додавав
}

// ─── Медіа ───────────────────────────────────────────────────

/** Тип контенту */
export type MediaType = 'movie' | 'series' | 'cartoon' | 'tvshow' | 'anime'

/** Оцінки кожного з друзів (ключ — ProfileId, значення — 1..5).
 *  Якщо ключа немає — людина ще не оцінила. */
export type Ratings = Partial<Record<ProfileId, number>>

// ─── Основна сутність ─────────────────────────────────────────

/** Один запис у списку */
export interface MovieItem {
  id: string          // унікальний рядковий UUID
  title: string       // назва фільму / серіалу / мультика
  type: MediaType     // тип контенту
  note: string        // нотатка (може бути порожньою)
  owner: ProfileId    // хто додав (для відображення)
  createdAt: number   // timestamp — для сортування
  ratings: Ratings    // оцінки від кожного з друзів
}

// ─── Форма ───────────────────────────────────────────────────

/** Дані, які вводить користувач у формі.
 *  id, owner, createdAt генеруються автоматично — їх тут немає. */
export type MovieFormData = Pick<MovieItem, 'title' | 'type' | 'note'>

// ─── Вкладки ─────────────────────────────────────────────────

/** Фільтр вкладок у головному списку */
export type TabFilter = 'all' | MediaType | 'watched' | 'unseen'