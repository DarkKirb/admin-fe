import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchRelays(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/relay',
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function addRelay(relay_url, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/relay',
    method: 'post',
    headers: authHeaders(token),
    data: { relay_url }
  })
}

export async function deleteRelay(relay_url, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/relay',
    method: 'delete',
    headers: authHeaders(token),
    data: { relay_url }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
