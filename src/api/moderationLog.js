import _ from 'lodash'

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchLog(authHost, token, params, page = 1) {
  const normalizedParams = new URLSearchParams(
    _.omitBy({ ...params, page }, _.isUndefined)
  ).toString()

  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/moderation_log?${normalizedParams}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchAdmins(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users?filters=is_admin`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchModerators(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users?filters=is_moderator`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
