// ─────────────────────────────────────────────────────────────
// src/utils/constants.ts
//
// Усі константи в одному місці — профілі, мітки, вкладки.
// Змінюй тут — працює скрізь автоматично.
// ─────────────────────────────────────────────────────────────

import type { Profile, MediaType, TabFilter } from '@/types'

// ─── Профілі чотирьох друзів ─────────────────────────────────

export const PROFILES: Profile[] = [
  {
    id: 'yasya',
    name: 'Яся',
    initials: 'Я',
    color: '#cf8d8e',
    bgColor: '#825859',
    textColor: '#352424',
    addItem: 'Яся'
  },
  {
    id: 'dima',
    name: 'Діма',
    initials: 'Д',
    color: '#ffffff',
    bgColor: '#b2b2b2',
    textColor: '#656565',
    addItem: 'Діма'
  },
  {
    id: 'zhenya',
    name: 'Женя',
    initials: 'Ж',
    color: '#ff00ff',
    bgColor: '#b200b2',
    textColor: '#650065',
    addItem: 'Женя'
  },
  {
    id: 'sasha',
    name: 'Саша',
    initials: 'С',
    color: '#ff9900',
    bgColor: '#b26b00',
    textColor: '#653d00',
    addItem: 'Саша'
  },
]

// ─── Мітки типів контенту ────────────────────────────────────

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  movie: '🎬 Фільм',
  series: '📺 Серіал',
  cartoon: '🎨 Мультик',
  tvshow: '🕺 Теле-шоу',
  anime: '🙃 Аніме',
}

// ─── CSS-класи бейджів типів ──────────────────────────────────

export const MEDIA_TYPE_BADGE: Record<MediaType, string> = {
  movie: 'badge-movie',
  series: 'badge-series',
  cartoon: 'badge-cartoon',
  tvshow: 'badge-tvshow',
  anime: 'badge-anime',
}

// ─── Вкладки головного екрану ────────────────────────────────

export const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'Всі' },
  { id: 'movie', label: 'Фільми' },
  { id: 'series', label: 'Серіали' },
  { id: 'cartoon', label: 'Мультики' },
  { id: 'tvshow', label: 'Теле-шоу' },
  { id: 'anime', label: 'Аніме' },
  { id: 'watched', label: 'Переглянуто' },
  { id: 'unseen', label: 'Не переглянуто' },
]

// ─── Назва колекції Firestore ─────────────────────────────────
// Змінюй тут — не шукай по всіх файлах

export const FIRESTORE_COLLECTION = 'movies'
