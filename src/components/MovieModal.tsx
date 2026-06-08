// ─────────────────────────────────────────────────────────────
// src/components/MovieModal.tsx
//
// Модальне вікно для двох сценаріїв:
//  1. Додавання нового фільму (editItem = null)
//  2. Редагування існуючого (editItem = MovieItem)
//
// Поля: назва, тип, нотатка + пікер своєї оцінки 1–5.
// Статус більше не вибирається вручну — він авто з оцінок.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import type { MovieItem, MovieFormData, MediaType, Profile } from '@/types'
import { MEDIA_TYPE_LABELS } from '@/utils/constants'
import styles from './MovieModal.module.css'

interface Props {
  // null = режим додавання, MovieItem = режим редагування
  editItem: MovieItem | null
  // поточний профіль — потрібен щоб знати чия оцінка
  currentProfile: Profile
  onSave: (data: MovieFormData, rating: number) => void
  onClose: () => void
}

export function MovieModal({ editItem, currentProfile, onSave, onClose }: Props) {
  // ── Стан форми ──────────────────────────────────────────
  const [title, setTitle]   = useState('')
  const [type, setType]     = useState<MediaType>('movie')
  const [note, setNote]     = useState('')
  // Оцінка поточного профілю: 0 = не оцінено
  const [rating, setRating] = useState(0)

  // Фокус на полі назви при відкритті
  const titleRef = useRef<HTMLInputElement>(null)

  // ── Заповнюємо форму при редагуванні ────────────────────
  // useEffect з [editItem] — запускається коли змінюється запис
  useEffect(() => {
    if (editItem) {
      // Режим редагування — підставляємо поточні значення
      setTitle(editItem.title)
      setType(editItem.type)
      setNote(editItem.note)
      // Підставляємо свою оцінку (або 0 якщо ще не оцінював)
      setRating(editItem.ratings[currentProfile.id] ?? 0)
    } else {
      // Режим додавання — очищаємо форму
      setTitle('')
      setType('movie')
      setNote('')
      setRating(0)
    }

    // Фокусуємо поле назви після рендеру
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [editItem, currentProfile.id])

  // ── Закриття по Escape ───────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // ── Збереження ───────────────────────────────────────────
  const handleSave = () => {
    // Валідація: назва обов'язкова
    if (!title.trim()) {
      titleRef.current?.focus()
      return
    }
    onSave({ title: title.trim(), type, note: note.trim() }, rating)
  }

  const isEditing = editItem !== null

  return (
    // Фон-оверлей — клік закриває модал
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {isEditing ? 'Редагувати' : 'Додати фільм або серіал'}
        </h2>

        {/* ── Назва ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-title">Назва</label>
          <input
            id="f-title"
            ref={titleRef}
            className={styles.input}
            type="text"
            placeholder="Наприклад: Дюна"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // Enter зберігає форму
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        {/* ── Тип контенту ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-type">Тип</label>
          <select
            id="f-type"
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as MediaType)}
          >
            {/* Генеруємо опції з константи — не дублюємо мітки */}
            {(Object.entries(MEDIA_TYPE_LABELS) as [MediaType, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Нотатка ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-note">Нотатка</label>
          <textarea
            id="f-note"
            className={styles.textarea}
            placeholder="Сезон, сім'я, рекомендація..."
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* ── Оцінка (лише своя) ── */}
        <div className={styles.field}>
          <label className={styles.label}>
            Моя оцінка&nbsp;
            <span className={styles.optional}>(необов'язково)</span>
          </label>
          <div className={styles.ratingPicker}>
            {/* Кнопка "скинути оцінку" */}
            <button
              className={`${styles.ratingBtn} ${rating === 0 ? styles.selected : ''}`}
              onClick={() => setRating(0)}
            >
              —
            </button>

            {/* Кнопки 1–5 */}
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`${styles.ratingBtn} ${rating === n ? styles.selected : ''}`}
                onClick={() => setRating(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ── Дії ── */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Скасувати
          </button>
          <button className={styles.btnSave} onClick={handleSave}>
            {isEditing ? 'Зберегти' : 'Додати'}
          </button>
        </div>
      </div>
    </div>
  )
}
