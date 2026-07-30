'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { CheckIcon, CopyIcon, ExternalIcon } from './icons'
import { useTranslations } from 'next-intl'
import { useToast } from './Toast'

/**
 * Heliobond AddressChip — a Stellar address or tx hash, truncated in the
 * MIDDLE (never the end), mono, with one-tap copy and an explorer link.
 * Embodies "every figure traces to chain in <= 2 taps".
 */
export interface AddressChipProps {
  value: string
  lead?: number
  tail?: number
  explorerUrl?: string
  label?: string
  style?: CSSProperties
}

export function AddressChip({
  value,
  lead = 6,
  tail = 6,
  explorerUrl,
  label = 'address',
  style,
}: AddressChipProps) {
  const t = useTranslations('Common')
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [hover, setHover] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const truncated =
    value && value.length > lead + tail + 1
      ? `${value.slice(0, lead)}…${value.slice(-tail)}`
      : value

  const copy = async () => {
    let success = false
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value)
        success = true
      } catch {
        success = false
      }
    }
    if (!success) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.style.position = 'fixed'
        textarea.style.top = '0'
        textarea.style.left = '0'
        textarea.style.width = '2em'
        textarea.style.height = '2em'
        textarea.style.padding = '0'
        textarea.style.border = 'none'
        textarea.style.outline = 'none'
        textarea.style.boxShadow = 'none'
        textarea.style.background = 'transparent'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch {
        success = false
      }
    }

    if (success) {
      setCopied(true)
      toast({
        tone: 'success',
        title: t('copied'),
        message: value,
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 1400)
    }
  }

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 6px 0 12px',
        background: hover ? 'var(--ink-06)' : 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-pill)',
        transition: 'background var(--dur-press) var(--ease-out)',
        ...style,
      }}
    >
      <span
        title={value}
        style={{
          fontFamily: 'var(--font-data)',
          fontSize: 'var(--type-caption)',
          color: 'var(--ink)',
          letterSpacing: '0.01em',
        }}
      >
        {truncated}
      </span>
      <button
        type="button"
        aria-label={copied ? t('copied') : t('copyAddress', { label })}
        onClick={copy}
        style={iconBtn}
      >
        {copied ? <CheckIcon style={{ color: 'var(--growth)' }} /> : <CopyIcon />}
      </button>
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t('viewOnExplorer', { label })}
          style={iconBtn}
        >
          <ExternalIcon />
        </a>
      )}
    </span>
  )
}

const iconBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--ink-60)',
  textDecoration: 'none',
}
