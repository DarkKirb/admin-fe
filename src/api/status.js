import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/statuses/${id}`,
    method: 'put',
    headers: authHeaders(token),
    data: { sensitive, visibility }
  })
}

export async function deleteStatus(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/statuses/${id}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function fetchStatus(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/statuses/${id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchStatuses({ godmode, localOnly, authHost, token, pageSize, page }) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/statuses?godmode=${godmode}&local_only=${localOnly}&page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchStatusesCount(instance, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: instance ? `/api/v1/pleroma/admin/stats?instance=${instance}` : `/api/v1/pleroma/admin/stats`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchStatusesByInstance({ instance, authHost, token, pageSize, page }) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/instances/${instance}/statuses?page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
