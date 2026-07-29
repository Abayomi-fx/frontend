#!/usr/bin/env node

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

const BUDGET_KB = 200

// The landing route's main bundle is in .next/static/chunks
// Specifically, we check the page chunk: static/chunks/app/page-<hash>.js
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

  const allFiles = walkSync(chunksDir)

  // Next.js Webpack: app/page-<hash>.js
  // Next.js Turbopack: often contains 'app_page' or similar
  const pageChunk = allFiles.find((f) => {
    const name = path.basename(f)
    return (
      (f.includes(path.sep + 'app' + path.sep) && name.startsWith('page-') && name.endsWith('.js')) ||
      (name.includes('app_page') && name.endsWith('.js'))
    )
  })

  if (!pageChunk) {
    console.error('❌ Could not find landing page chunk in', chunksDir)
    console.error('   Available files (first 5):', allFiles.slice(0, 5))
    process.exit(1)
  }

  return pageChunk
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
