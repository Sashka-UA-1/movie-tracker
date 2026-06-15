import React, { useMemo } from 'react'
import styles from './SceneSelection.module.css'

interface Props {
  onChooseMain: () => void
}

export function SceneSelection({ onChooseMain }: Props) {
  const randHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

  const bg = useMemo(() => randHex(), [])

  const isMonday = useMemo(() => {
    try {
      return new Date().getDay() === 1
    } catch (e) {
      return false
    }
  }, [])

  const btnClass = [
    styles.btnPrimary, isMonday ? styles.blink : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вибір сцени</h2>
      <button
        className={btnClass}
        onClick={onChooseMain}
        style={{ background: bg }}
      >
        Перейти за 4-а билетами в ад, пожалуйста
      </button>
    </div>
  )
}
