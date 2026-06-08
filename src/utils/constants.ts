// ─────────────────────────────────────────────────────────────
// src/utils/constants.ts
//
// Усі константи в одному місці — профілі, мітки, вкладки.
// Змінюй тут — працює скрізь автоматично.
// ─────────────────────────────────────────────────────────────

import type { Profile, MediaType, TabFilter } from '@/types'

// ─── Профілі чотирьох друзів ─────────────────────────────────

export const PROFILES: Profile[] = [
  { id: 'yasya',  name: 'Яся',  initials: 'Я', color: '#FAECE7', textColor: '#993C1D' },
  { id: 'dima',   name: 'Діма', initials: 'Д', color: '#E1F5EE', textColor: '#0F6E56' },
  { id: 'zhenya', name: 'Женя', initials: 'Ж', color: '#EEEDFE', textColor: '#534AB7' },
  { id: 'sasha',  name: 'Саша', initials: 'С', color: '#FAEEDA', textColor: '#854F0B' },
]

// ─── Мітки типів контенту ────────────────────────────────────

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  movie:   '🎬 Фільм',
  series:  '📺 Теле-шоу',
  cartoon: '🎨 Мультик',
}

// ─── CSS-класи бейджів типів ──────────────────────────────────

export const MEDIA_TYPE_BADGE: Record<MediaType, string> = {
  movie:   'badge-movie',
  series:  'badge-series',
  cartoon: 'badge-cartoon',
}

// ─── Вкладки головного екрану ────────────────────────────────

export const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all',     label: 'Всі' },
  { id: 'movie',   label: 'Фільми' },
  { id: 'series',  label: 'Теле-шоу' },
  { id: 'cartoon', label: 'Мультики' },
  { id: 'watched', label: 'Переглянуто' },
  { id: 'unseen',  label: 'Не переглянуто' },
]

// ─── Назва колекції Firestore ─────────────────────────────────
// Змінюй тут — не шукай по всіх файлах

export const FIRESTORE_COLLECTION = 'movies'
