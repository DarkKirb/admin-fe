import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'
import _ from 'lodash'

export async function deleteInstanceDocument(name, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/instance_document/${name}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function fetchDescription(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/config/descriptions`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchDescription2(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v2/pleroma/admin/config/descriptions`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchSettings(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/config`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function getInstanceDocument(name, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/instance_document/${name}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function updateInstanceDocument(name, formData, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/instance_document/${name}`,
    method: 'patch',
    data: formData,
    headers: { ...authHeaders(token), 'Content-Type': 'multipart/form-data' }
  })
}

export async function updateSettings(configs, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/config`,
    method: 'post',
    headers: authHeaders(token),
    data: { configs }
  })
}

export async function removeSettings(configs, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/config`,
    method: 'post',
    headers: authHeaders(token),
    data: { configs }
  })
}

export async function fetchFrontends(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/frontends`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function installFrontend(data, authHost, token) {
  const filteredData = _.pickBy(data)
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/pleroma/admin/frontends/install`,
    method: 'post',
    headers: authHeaders(token),
    data: filteredData
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
