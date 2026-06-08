// ─────────────────────────────────────────────────────────────
// src/hooks/useMovies.ts
//
// Хук для роботи зі списком фільмів через Apps Script API.
//
// Схема:
//   fetchMovies()   → GET ?action=list   → читає з Sheets
//   saveRating(...) → GET ?action=rate   → пише в Sheets
//
// Polling кожні 30 секунд — щоб бачити зміни інших
// (якщо хтось редагував таблицю напряму).
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import type { MovieItem, ProfileId } from '@/types'
import { fetchMovies, saveRating } from '@/api/sheets'
import { updateRating } from '@/utils/helpers'

const POLL_INTERVAL = 30_000 // оновлювати кожні 30 секунд

interface UseMoviesReturn {
  items: MovieItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateRatingOnly: (id: string, profileId: ProfileId, rating: number) => Promise<void>
}

export function useMovies(): UseMoviesReturn {
  const [items, setItems]     = useState<MovieItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // ── Завантаження списку ──────────────────────────────────
  const load = useCallback(async () => {
    try {
      const data = await fetchMovies()
      setItems(data)
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Невідома помилка'
      setError(`Не вдалось завантажити. ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Перше завантаження + polling ────────────────────────
  useEffect(() => {
    load()

    // Оновлюємо список кожні 30 секунд щоб бачити чужі зміни
    const interval = setInterval(load, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [load])

  // ── Збереження своєї оцінки ─────────────────────────────
  // Оптимістичне оновлення: UI змінюється одразу,
  // потім запит іде у Sheets. Якщо помилка — відкатуємо.
  const updateRatingOnly = async (
    id: string,
    profileId: ProfileId,
    rating: number
  ): Promise<void> => {

    // Зберігаємо попередній стан для відкату
    const prevItems = items

    // Оптимістично оновлюємо UI — не чекаємо відповіді сервера
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      return { ...item, ratings: updateRating(item.ratings, profileId, rating) }
    }))

    try {
      // Відправляємо в Sheets
      await saveRating(id, profileId, rating)
    } catch (err) {
      // Помилка — відкатуємо UI назад
      setItems(prevItems)
      const msg = err instanceof Error ? err.message : 'Невідома помилка'
      setError(`Не вдалось зберегти оцінку. ${msg}`)
    }
  }

  return { items, loading, error, refresh: load, updateRatingOnly }
}
