import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function generateInviteToken(max_use, expires_at, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/invite_token`,
    method: 'post',
    headers: authHeaders(token),
    data: expires_at && expires_at.length > 0 ? { max_use, expires_at } : { max_use }
  })
}

export async function inviteViaEmail(email, name, authHost, token) {
  const data = name.length > 0 ? { email, name } : { email }
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/email_invite',
    method: 'post',
    headers: authHeaders(token),
    data
  })
}

export async function listInviteTokens(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/invites`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function revokeToken(tokenToRevoke, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/revoke_invite`,
    method: 'post',
    headers: authHeaders(token),
    data: { token: tokenToRevoke }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
