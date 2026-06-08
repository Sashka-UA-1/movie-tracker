// ─────────────────────────────────────────────────────────────
// src/components/MovieTable.tsx
//
// Таблиця — тільки перегляд + клік по своїй оцінці.
// Редагування/видалення прибрано — це через Google Sheets.
// ─────────────────────────────────────────────────────────────

import type { MovieItem, Profile, TabFilter } from '@/types'
import { PROFILES, TABS, MEDIA_TYPE_LABELS, MEDIA_TYPE_BADGE } from '@/utils/constants'
import { isWatched } from '@/utils/helpers'
import styles from './MovieTable.module.css'

interface Props {
  items: MovieItem[]
  currentProfile: Profile
  activeTab: TabFilter
  onTabChange: (tab: TabFilter) => void
  onRatingClick: (item: MovieItem, currentRating: number) => void
}

export function MovieTable({ items, currentProfile, activeTab, onTabChange, onRatingClick }: Props) {

  const filtered = (() => {
    switch (activeTab) {
      case 'movie': case 'series': case 'cartoon':
        return items.filter(i => i.type === activeTab)
      case 'watched': return items.filter(i => isWatched(i))
      case 'unseen':  return items.filter(i => !isWatched(i))
      default: return items
    }
  })()

  return (
    <div>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎬</span>
            <p>
              {items.length === 0
                ? 'Список порожній. Додай фільми у Google Sheets і натисни "Кінотрекер → Синхронізувати"'
                : 'Нічого не знайдено за цим фільтром'
              }
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colTitle}>Назва</th>
                <th className={styles.colType}>Тип</th>
                <th className={styles.colNote}>Нотатка</th>
                <th className={styles.colStatus}>
                  Статус
                  <span className={styles.autoHint}>авто</span>
                </th>
                {PROFILES.map(p => (
                  <th key={p.id} className={styles.colRating} style={{ color: p.textColor }}>
                    {p.initials}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <MovieRow
                  key={item.id}
                  item={item}
                  currentProfile={currentProfile}
                  onRatingClick={(r) => onRatingClick(item, r)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Один рядок ──────────────────────────────────────────────

interface RowProps {
  item: MovieItem
  currentProfile: Profile
  onRatingClick: (currentRating: number) => void
}

function MovieRow({ item, currentProfile, onRatingClick }: RowProps) {
  const watched = isWatched(item)

  return (
    <tr className={styles.row}>
      <td className={styles.titleCell}>{item.title}</td>

      <td>
        <span className={`${styles.badge} ${styles[MEDIA_TYPE_BADGE[item.type]]}`}>
          {MEDIA_TYPE_LABELS[item.type]}
        </span>
      </td>

      <td>
        {item.note
          ? <span className={styles.note}>{item.note}</span>
          : <span className={styles.noteEmpty}>—</span>
        }
      </td>

      <td>
        <span className={`${styles.statusPill} ${watched ? styles.statusWatched : styles.statusUnseen}`}>
          <span className={`${styles.dot} ${watched ? styles.dotWatched : styles.dotUnseen}`} />
          {watched ? 'Переглянуто' : 'Не переглянуто'}
        </span>
      </td>

      {PROFILES.map(p => {
        const val = item.ratings?.[p.id] ?? 0
        const isMe = p.id === currentProfile.id

        return (
          <td key={p.id} className={styles.ratingCell}>
            <div
              className={`${styles.ratingNum} ${val > 0 ? styles.hasVal : ''} ${isMe ? styles.editable : styles.readonly}`}
              title={isMe ? 'Натисни щоб оцінити' : `${p.name}: ${val || '—'}`}
              onClick={isMe ? () => onRatingClick(val) : undefined}
            >
              {val > 0 ? val : '—'}
            </div>
          </td>
        )
      })}
    </tr>
  )
}
