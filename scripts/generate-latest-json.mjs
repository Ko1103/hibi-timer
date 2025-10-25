#!/usr/bin/env node

import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const artifactsDirEnv = process.env.ARTIFACTS_DIR
const artifactsDir = artifactsDirEnv
  ? path.resolve(artifactsDirEnv)
  : path.resolve(process.cwd(), 'artifacts')
const version = (process.env.APP_VERSION || '').trim()
const releaseHost = (process.env.RELEASE_HOST || '').trim()
const updateChannel = (process.env.UPDATE_CHANNEL || 'latest').trim()
const s3Prefix = (process.env.AWS_S3_PREFIX || '').trim()
const releaseNotes = (process.env.RELEASE_NOTES || '').trim()

if (!version) {
  console.error('APP_VERSION env var is required')
  process.exit(1)
}

if (!releaseHost) {
  console.error('RELEASE_HOST env var is required')
  process.exit(1)
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursive(fullPath)))
    } else if (entry.isFile()) {
      results.push(fullPath)
    }
  }

  return results
}

function normaliseSegment(value, { isHost = false } = {}) {
  if (!value) return ''
  return isHost ? value.replace(/\/+$/, '') : value.replace(/^\/+|\/+$/g, '')
}

function buildBaseUrl() {
  const parts = [normaliseSegment(releaseHost, { isHost: true })]
  const prefix = normaliseSegment(s3Prefix)
  const channel = normaliseSegment(updateChannel)

  if (prefix) parts.push(prefix)
  if (channel) parts.push(channel)

  return parts.join('/')
}

async function ensureFile(predicate, description, files) {
  const file = files.find(predicate)
  if (!file) {
    throw new Error(`Unable to find ${description} in ${artifactsDir}`)
  }
  return file
}

function signaturePathFor(filePath, filesSet) {
  const candidate = `${filePath}.sig`
  if (filesSet.has(candidate)) return candidate

  const dir = path.dirname(filePath)
  const base = path.basename(filePath)
  const alternative = path.join(dir, `${base}.sig`)
  if (filesSet.has(alternative)) return alternative

  throw new Error(`Missing signature for ${filePath}`)
}

async function sha256For(filePath) {
  const fileBuffer = await fs.readFile(filePath)
  return crypto.createHash('sha256').update(fileBuffer).digest('hex')
}

async function loadSignature(sigPath) {
  const contents = await fs.readFile(sigPath, 'utf8')
  return contents.trim()
}

function relativeUrlPath(filePath) {
  const relative = path.relative(artifactsDir, filePath)
  return relative.split(path.sep).join('/')
}

async function makePlatformEntry({ label, matcher }, files, filesSet, baseUrl) {
  const artifactPath = await ensureFile(matcher, `${label} artifact`, files)
  const sigPath = signaturePathFor(artifactPath, filesSet)
  const [signature, sha256] = await Promise.all([loadSignature(sigPath), sha256For(artifactPath)])

  return {
    label,
    artifactPath,
    url: `${baseUrl}/${relativeUrlPath(artifactPath)}`,
    signature,
    sha256,
  }
}

async function main() {
  const stats = await fs.stat(artifactsDir).catch(() => null)
  if (!stats || !stats.isDirectory()) {
    throw new Error(`Artifacts directory not found: ${artifactsDir}`)
  }

  const files = await listFilesRecursive(artifactsDir)
  if (files.length === 0) {
    throw new Error(`Artifacts directory is empty: ${artifactsDir}`)
  }

  const filesSet = new Set(files)
  const baseUrl = buildBaseUrl()

  const platformMatchers = [
    {
      label: 'darwin-aarch64',
      matcher: (file) =>
        file.endsWith('.app.tar.gz') && file.includes('_aarch64') && !file.endsWith('.sig'),
    },
    {
      label: 'darwin-x86_64',
      matcher: (file) =>
        file.endsWith('.app.tar.gz') && file.includes('_x86_64') && !file.endsWith('.sig'),
    },
    {
      label: 'windows-x86_64',
      matcher: (file) =>
        file.toLowerCase().endsWith('.msi') &&
        /x64|x86_64/i.test(path.basename(file)) &&
        !file.endsWith('.sig'),
    },
  ]

  const platforms = {}

  for (const entry of platformMatchers) {
    try {
      const result = await makePlatformEntry(entry, files, filesSet, baseUrl)
      platforms[entry.label] = {
        url: result.url,
        signature: result.signature,
        sha256: result.sha256,
      }
      console.log(`Added ${entry.label}: ${relativeUrlPath(result.artifactPath)}`)
    } catch (error) {
      if (entry.label.startsWith('darwin')) {
        throw error
      }

      console.warn(`Skipping ${entry.label}: ${error.message}`)
    }
  }

  if (Object.keys(platforms).length === 0) {
    throw new Error('No platform artifacts found – aborting latest.json generation')
  }

  const latest = {
    version,
    pub_date: new Date().toISOString(),
    platforms,
  }

  if (releaseNotes) {
    latest.notes = releaseNotes
  }

  const outputPath = path.join(artifactsDir, 'latest.json')
  await fs.writeFile(outputPath, `${JSON.stringify(latest, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${outputPath}`)
}

main().catch((error) => {
  console.error(`[generate-latest-json] ${error.message}`)
  process.exit(1)
})
