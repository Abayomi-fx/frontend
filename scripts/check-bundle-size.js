#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

/**
 * Bundle size checker for the landing route.
 *
 * The landing route pulls in React Three Fiber and three.js, which are
 * significant dependencies. This script ensures the bundle doesn't silently
 * grow past an acceptable threshold.
 *
 * Budget: 200 KB gzip (landing route JS only)
 */

const fs = require('fs')
const path = require('path')

const BUDGET_KB = 250

// The landing route's main bundle is in .next/static/chunks
function findLandingPageChunk() {
  const chunksDir = path.join(process.cwd(), '.next/static/chunks')

  if (!fs.existsSync(chunksDir)) {
    console.error('❌ Build output not found. Run `npm run build` first.')
    process.exit(1)
  }

  function walkSync(dir, fileList = []) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        walkSync(filePath, fileList)
      } else {
        fileList.push(filePath)
      }
    }
    return fileList
  }

  const allFiles = walkSync(chunksDir).filter((f) => f.endsWith('.js'))

  // Filter out Next.js internals to isolate application chunks
  const appChunks = allFiles.filter((f) => {
    const name = path.basename(f)
    return (
      !name.includes('webpack') &&
      !name.includes('main-app') &&
      !name.includes('framework') &&
      !name.includes('polyfills')
    )
  })

  if (appChunks.length === 0) {
    console.error('❌ Could not find any application chunks in', chunksDir)
    process.exit(1)
  }

  // The landing route includes Three.js/R3F, which is guaranteed to be the largest chunk.
  // Finding the largest chunk makes this robust against Turbopack/Webpack filename hashes.
  let largestChunk = appChunks[0]
  let maxSize = 0

  for (const f of appChunks) {
    const size = fs.statSync(f).size
    if (size > maxSize) {
      maxSize = size
      largestChunk = f
    }
  }

  return largestChunk
}

function getGzipSize(filePath) {
  const zlib = require('zlib')
  const buffer = fs.readFileSync(filePath)
  const compressed = zlib.gzipSync(buffer)
  return compressed.length
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2)
}

try {
  const chunkPath = findLandingPageChunk()
  const gzipBytes = getGzipSize(chunkPath)
  const gzipKb = gzipBytes / 1024
  const rawBytes = fs.statSync(chunkPath).size
  const rawKb = rawBytes / 1024

  console.log('\n📦 Landing Route Bundle Size')
  console.log('─'.repeat(50))
  console.log(`Raw:     ${formatBytes(rawBytes)} KB`)
  console.log(`Gzipped: ${formatBytes(gzipBytes)} KB (budget: ${BUDGET_KB} KB)`)
  console.log('─'.repeat(50))

  if (gzipKb > BUDGET_KB) {
    console.log(`\n❌ FAILED: Bundle ${formatBytes(gzipBytes)} KB exceeds budget ${BUDGET_KB} KB`)
    console.log(`   Overage: +${formatBytes(gzipBytes - BUDGET_KB * 1024)} KB\n`)
    process.exit(1)
  } else {
    const headroom = BUDGET_KB - gzipKb
    console.log(`\n✅ PASSED: ${formatBytes(headroom * 1024)} KB headroom remaining\n`)
    process.exit(0)
  }
} catch (error) {
  console.error('❌ Error checking bundle size:', error.message)
  process.exit(1)
}
