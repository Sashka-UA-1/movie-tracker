// ─────────────────────────────────────────────────────────────
// src/api/sheets.ts
//
// HTTP-клієнт для Apps Script Web App.
// Увесь код запитів тут — хуки і компоненти не знають про fetch.
//
// ⚠️  Після розгортання Apps Script вставити URL сюди:
// ─────────────────────────────────────────────────────────────

import type { MovieItem, ProfileId, MovieFormData } from '@/types'

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

interface AddResponse {
  ok: boolean
  id?: string
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
  url.searchParams.set('action', 'rate')
  url.searchParams.set('id', id)
  url.searchParams.set('profileId', profileId)
  url.searchParams.set('rating', String(rating))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP помилка: ${res.status}`)

  const json: RateResponse = await res.json()
  if (!json.ok) throw new Error(json.error ?? 'Помилка збереження оцінки')
}

// ─── GET додавання нового запису ─────────────────────────────
// Використовуємо GET через обмеження Apps Script

export async function addItem(
  data: MovieFormData,
  owner: ProfileId,
  createdAt: number = Date.now()
): Promise<string> {
  const url = new URL(SCRIPT_URL)
  url.searchParams.set('action', 'add')
  url.searchParams.set('title', data.title)
  url.searchParams.set('type', data.type)
  url.searchParams.set('note', data.note)
  url.searchParams.set('owner', owner)
  url.searchParams.set('createdAt', String(createdAt))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP помилка: ${res.status}`)

  const json: AddResponse = await res.json()
  if (!json.ok) throw new Error(json.error ?? 'Помилка додавання')

  return json.id ?? ''
}
