## Summary

Adds full Right-to-Left (RTL) language support for Arabic (#458). Arabic users previously experienced broken layouts, overlapping text, and misaligned buttons because the codebase used physical directional CSS properties (`marginLeft`, `left`, `textAlign: 'right'`, etc.) that don't adapt to RTL. This change converts all ~35 physical directional properties to CSS logical properties, adds Arabic as a supported locale with a complete translation file, introduces a dropdown language switcher (replacing the binary EN/FR toggle), and sets `dir="rtl"` on the `<html>` element when an RTL locale is active.

## Linked issue

Closes #458

## Type of change

- [ ] Bug fix
- [x] Feature
- [x] Localization (i18n)
- [ ] Accessibility
- [ ] Smart contract / on-chain wiring
- [ ] Docs / chore

## Screenshots / screencast

<!-- Required for any visible UI change — before/after, light + dark if relevant. -->

## Checklist

- [x] Tied to an accepted issue (`Closes #458`)
- [x] `bun run build` passes locally (builds + type-checks)
- [x] Follows the design system — token CSS vars, sentence case, mono numerals, deltas carry sign + arrow, no emoji, no hardcoded colours
- [x] User-facing strings added to **both** `messages/en.json` and `messages/fr.json` (if any copy changed)
- [x] Accessible — keyboard operable, visible focus, reduced-motion respected
- [x] No secrets committed
- [ ] Docs updated where relevant
