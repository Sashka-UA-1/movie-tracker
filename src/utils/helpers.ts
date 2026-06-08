// ─────────────────────────────────────────────────────────────
// src/utils/helpers.ts
//
// Чисті допоміжні функції без залежностей від React або Firebase.
// Тестувати легко — на вхід дані, на вихід результат.
// ─────────────────────────────────────────────────────────────

import type { MovieItem, Ratings } from '@/types'

/**
 * Визначає, чи переглянуто фільм.
 * Логіка: якщо хоч одна людина поставила оцінку > 0 — переглянуто.
 * Статус НЕ зберігається у базі, а обчислюється динамічно з ratings.
 */
export function isWatched(item: MovieItem): boolean {
  return Object.values(item.ratings).some(v => v !== undefined && v > 0)
}

/**
 * Оновлює оцінку одного профілю у ratings.
 * Якщо оцінка 0 — видаляє ключ (немає оцінки).
 * Повертає новий об'єкт — не мутує оригінал.
 */
export function updateRating(ratings: Ratings, profileId: string, value: number): Ratings {
  const next = { ...ratings }
  if (value > 0) {
    // зберігаємо оцінку
    (next as Record<string, number>)[profileId] = value
  } else {
    // скидаємо оцінку — видаляємо ключ
    delete (next as Record<string, number>)[profileId]
  }
  return next
}

/**
 * Генерує унікальний id на основі поточного часу.
 * Для продакшну краще використовувати crypto.randomUUID(),
 * але це рішення добре підходить для невеликого командного застосунку.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
