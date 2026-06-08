// ─────────────────────────────────────────────────────────────
// src/api/sheets.ts
//
// HTTP-клієнт для Apps Script Web App.
// Увесь код запитів тут — хуки і компоненти не знають про fetch.
//
// ⚠️  Після розгортання Apps Script вставити URL сюди:
// ─────────────────────────────────────────────────────────────

import type { MovieItem, ProfileId } from '@/types'

// URL твого Apps Script Web App
// Виглядає так: https://script.google.com/macros/s/AKfy.../exec
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOc89oUwDHATa7boFxtbQNgVK3f4XxIjFXsh8gSndcf8Hymkoo_3KjGSnCvU_eUlLPuw/exec'

// ─── Типи відповідей ─────────────────────────────────────────

interface ListResponse {
  ok: boolean
  data?: MovieItem[]
  error?: string
}

interface RateResponse {
  ok: boolean
  error?: string
}

// ─── GET список фільмів ──────────────────────────────────────

export async function fetchMovies(): Promise<MovieItem[]> {
  const url = `${SCRIPT_URL}?action=list`
  const res = await fetch(url)

  if (!res.ok) throw new Error(`HTTP помилка: ${res.status}`)

  const json: ListResponse = await res.json()
  if (!json.ok) throw new Error(json.error ?? 'Помилка завантаження')

  return json.data ?? []
}

// ─── GET збереження оцінки ───────────────────────────────────
// Використовуємо GET (не POST) бо Apps Script CORS не підтримує POST

export async function saveRating(
  id: string,
  profileId: ProfileId,
  rating: number
): Promise<void> {
  const url = new URL(SCRIPT_URL)
  url.searchParams.set('action',    'rate')
  url.searchParams.set('id',        id)
  url.searchParams.set('profileId', profileId)
  url.searchParams.set('rating',    String(rating))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP помилка: ${res.status}`)

  const json: RateResponse = await res.json()
  if (!json.ok) throw new Error(json.error ?? 'Помилка збереження оцінки')
}
