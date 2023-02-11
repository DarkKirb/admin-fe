import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function addNewEmojiFile(packName, file, shortcode, filename, host, token) {
  const data = new FormData()
  if (filename.trim() !== '') {
    data.set('filename', filename)
  }
  if (shortcode.trim() !== '') {
    data.set('shortcode', shortcode)
  }
  data.set('file', file)

  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/packs/files?name=${packName}`,
    method: 'post',
    headers: authHeaders(token),
    data
  })
}

export function addressOfEmojiInPack(host, packName, name) {
  return `${baseName(host)}/emoji/${encodeUri(packName)}/${name}`
}

export async function createPack(host, token, packName) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/pack?name=${packName}`,
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function deleteEmojiFile(packName, shortcode, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/packs/files?name=${packName}&shortcode=${shortcode}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function deletePack(host, token, packName) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/pack?name=${packName}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function downloadFrom(instanceAddress, packName, as, host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/v1/pleroma/emoji/packs/download',
    method: 'post',
    headers: authHeaders(token),
    data: as.trim() === ''
      ? { url: baseName(instanceAddress), name: packName }
      : { url: baseName(instanceAddress), name: packName, as },
    timeout: 0
  })
}

export async function fetchPack(packName, page, pageSize, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/pack?name=${packName}&page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function importFromFS(host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/v1/pleroma/emoji/packs/import',
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function listPacks(page, pageSize, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/packs?page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function listRemotePacks(instance, page, pageSize, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/packs/remote?url=${baseName(instance)}&page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function reloadEmoji(host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/v1/pleroma/admin/reload_emoji',
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function savePackMetadata(host, token, packName, metadata) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/pack?name=${packName}`,
    method: 'patch',
    headers: authHeaders(token),
    data: { metadata },
    timeout: 0 // This might take a long time
  })
}

export async function updateEmojiFile(packName, shortcode, newShortcode, newFilename, force, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/v1/pleroma/emoji/packs/files?name=${packName}`,
    method: 'patch',
    headers: authHeaders(token),
    data: { shortcode, new_shortcode: newShortcode, new_filename: newFilename, force }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}

const encodeUri = (name) => encodeURIComponent(name)
