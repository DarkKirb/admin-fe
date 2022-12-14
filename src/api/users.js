import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function activateUsers(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/activate`,
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function addRight(nicknames, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/permission_group/${right}`,
    method: 'post',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function createNewAccount(nickname, email, password, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users',
    method: 'post',
    headers: authHeaders(token),
    data: { users: [{ nickname, email, password }] }
  })
}

export async function deactivateUsers(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/deactivate`,
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function deleteRight(nicknames, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/permission_group/${right}`,
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function deleteUsers(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users`,
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function disableMfa(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/disable_mfa`,
    method: 'put',
    headers: authHeaders(token),
    data: { nickname }
  })
}

export async function fetchUser(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/${id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchUserCredentials(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/${nickname}/credentials`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function updateUserCredentials(nickname, credentials, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/${nickname}/credentials`,
    method: 'patch',
    headers: authHeaders(token),
    data: credentials
  })
}

export async function fetchUsers(filters, actorTypeFilters, authHost, token, page = 1) {
  const url = actorTypeFilters.length === 0
    ? `/api/v1/pleroma/admin/users?page=${page}&filters=${filters}`
    : actorTypeFilters.reduce((acc, filter) => {
      const newAcc = acc.concat(`&actor_types[]=${filter}`)
      return newAcc
    }, `/api/v1/pleroma/admin/users?page=${page}&filters=${filters}`)

  return await request({
    baseURL: baseName(authHost),
    url,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function getPasswordResetToken(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/${nickname}/password_reset`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function forcePasswordReset(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/force_password_reset`,
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function searchUsers(query, filters, actorTypeFilters, authHost, token, page = 1) {
  const url = actorTypeFilters.length === 0
    ? `/api/v1/pleroma/admin/users?query=${query}&page=${page}&filters=${filters}`
    : actorTypeFilters.reduce((acc, filter) => {
      const newAcc = acc.concat(`&actor_types[]=${filter}`)
      return newAcc
    }, `/api/v1/pleroma/admin/users?query=${query}&page=${page}&filters=${filters}`)

  return await request({
    baseURL: baseName(authHost),
    url,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function tagUser(nicknames, tags, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/tag',
    method: 'put',
    headers: authHeaders(token),
    data: { nicknames, tags }
  })
}

export async function untagUser(nicknames, tags, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/tag',
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames, tags }
  })
}

export async function fetchUserStatuses(id, authHost, godmode, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/users/${id}/statuses?godmode=${godmode}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function approveUserAccount(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/approve',
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function confirmUserEmail(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/confirm_email',
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function resendConfirmationEmail(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/v1/pleroma/admin/users/resend_confirmation_email',
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
