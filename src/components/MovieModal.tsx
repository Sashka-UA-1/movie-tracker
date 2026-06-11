// src/components/MovieModal.tsx
import { useState, useEffect, useRef } from 'react'
import type { MovieItem, MovieFormData, MediaType, Profile } from '@/types'
import { MEDIA_TYPE_LABELS } from '@/utils/constants'
import styles from './MovieModal.module.css'

interface Props {
  editItem: MovieItem | null
  currentProfile: Profile
  onSave: (data: MovieFormData, rating: number) => void
  onClose: () => void
  saving?: boolean  // ← новий prop: блокує кнопки під час запиту
}

export function MovieModal({ editItem, currentProfile, onSave, onClose, saving }: Props) {
  const [title, setTitle]   = useState('')
  const [type, setType]     = useState<MediaType>('movie')
  const [note, setNote]     = useState('')
  const [rating, setRating] = useState(0)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title)
      setType(editItem.type)
      setNote(editItem.note)
      setRating(editItem.ratings[currentProfile.id] ?? 0)
    } else {
      setTitle(''); setType('movie'); setNote(''); setRating(0)
    }
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [editItem, currentProfile.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, saving])

  const handleSave = () => {
    if (!title.trim()) { titleRef.current?.focus(); return }
    onSave({ title: title.trim(), type, note: note.trim() }, rating)
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {editItem ? 'Редагувати' : 'Додати фільм або серіал'}
        </h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-title">Назва</label>
          <input
            id="f-title" ref={titleRef} className={styles.input}
            type="text" placeholder="Наприклад: Дюна"
            value={title} onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            disabled={saving}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-type">Тип</label>
          <select
            id="f-type" className={styles.select}
            value={type} onChange={(e) => setType(e.target.value as MediaType)}
            disabled={saving}
          >
            {(Object.entries(MEDIA_TYPE_LABELS) as [MediaType, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="f-note">Нотатка</label>
          <textarea
            id="f-note" className={styles.textarea}
            placeholder="Сезон, сім'я, рекомендація..."
            rows={2} value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* <div className={styles.field}>
          <label className={styles.label}>
            Моя оцінка&nbsp;
            <span className={styles.optional}>(необов'язково)</span>
          </label>
          <div className={styles.ratingPicker}>
            <button
              className={`${styles.ratingBtn} ${rating === 0 ? styles.selected : ''}`}
              onClick={() => setRating(0)} disabled={saving}
            >—</button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`${styles.ratingBtn} ${rating === n ? styles.selected : ''}`}
                onClick={() => setRating(n)} disabled={saving}
              >{n}</button>
            ))}
          </div>
        </div> */}

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose} disabled={saving}>
            Скасувати
          </button>
          <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? 'Збереження...' : editItem ? 'Зберегти' : 'Додати'}
          </button>
        </div>
      </div>
    </div>
  )
}