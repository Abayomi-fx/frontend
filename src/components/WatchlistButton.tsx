'use client'

import { type MouseEvent } from 'react'
import { useTranslations } from 'next-intl'
import { IconButton, type IconButtonSize } from './IconButton'
import { StarIcon, StarFilledIcon } from './icons'
import { useToast } from './Toast'
import { useWatchlist } from '../watchlist/WatchlistProvider'

/**
 * Star toggle that adds/removes a bond from the watchlist (issue #407). Safe to
 * drop inside a clickable card — it stops propagation so the card's own click
 * doesn't also fire. Shows a transient toast on each change.
 */
export interface WatchlistButtonProps {
  bondId: number
  bondName: string
  size?: IconButtonSize
}

export function WatchlistButton({ bondId, bondName, size = 'sm' }: WatchlistButtonProps) {
  const t = useTranslations('Watchlist')
  const { has, toggle } = useWatchlist()
  const { toast } = useToast()
  const saved = has(bondId)

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const nowSaved = toggle(bondId)
    toast({
      tone: nowSaved ? 'success' : 'neutral',
      title: nowSaved ? t('added') : t('removed'),
      message: bondName,
    })
  }

  return (
    <IconButton
      variant="outline"
      size={size}
      label={saved ? t('removeLabel', { name: bondName }) : t('saveLabel', { name: bondName })}
      aria-pressed={saved}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        color: saved ? 'var(--solar)' : 'var(--ink-60)',
      }}
    >
      {saved ? <StarFilledIcon /> : <StarIcon />}
    </IconButton>
  )
}
