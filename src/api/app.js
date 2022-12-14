import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function needReboot(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/need_reboot`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function restartApp(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/restart`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
