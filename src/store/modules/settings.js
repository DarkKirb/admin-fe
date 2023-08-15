import {
  deleteInstanceDocument,
  fetchDescription,
  fetchFrontends,
  fetchSettings,
  getInstanceDocument,
  installFrontend,
  removeSettings,
  updateInstanceDocument,
  updateSettings } from '@/api/settings'
import { formSearchObject, parseNonTuples, parseTuples, valueHasTuples, wrapUpdatedSettings } from './normalizers'
import { tabs } from '../../utils/tabs'
import _ from 'lodash'

const settings = {
  state: {
    configDisabled: true,
    frontends: [],
    db: {},
    description: [],
    instancePanel: '',
    loading: true,
    searchData: {},
    searchQuery: '',
    settings: {},
    tabs: [],
    termsOfServices: '',
    updatedSettings: {}
  },
  mutations: {
    CLEAR_UPDATED_SETTINGS: (state) => {
      state.updatedSettings = {}
    },
    SET_INSTANCE_PANEL: (state, data) => {
      state.instancePanel = data
    },
    REMOVE_SETTING_FROM_UPDATED: (state, { group, key, subkeys }) => {
      if (_.get(state.updatedSettings, [group, key, subkeys[0]])) {
        const { [subkeys[0]]: value, ...updatedSettings } = state.updatedSettings[group][key]
        state.updatedSettings = updatedSettings
      }
    },
    SET_DESCRIPTION: (state, data) => {
      state.description = data
    },
    SET_FRONTENDS: (state, data) => {
      state.frontends = data
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_SEARCH: (state, searchObject) => {
      state.searchData = searchObject
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    },
    SET_SETTINGS: (state, data) => {
      const newSettings = data.reduce((acc, { group, key, value }) => {
        const parsedValue = valueHasTuples(key, value)
          ? { value: parseNonTuples(key, value) }
          : parseTuples(value, key)
        acc[group] = acc[group] ? { ...acc[group], [key]: parsedValue } : { [key]: parsedValue }
        return acc
      }, {})

      const newDbSettings = data.reduce((acc, { group, key, db }) => {
        if (db) {
          acc[group] = acc[group] ? { ...acc[group], [key]: db } : { [key]: db }
        }
        return acc
      }, {})

      state.settings = newSettings
      state.db = newDbSettings
    },
    SET_TABS: (state, tabs) => {
      state.tabs = tabs
    },
    SET_TERMS_OF_SERVICES: (state, data) => {
      state.termsOfServices = data
    },
    TOGGLE_TABS: (state, status) => {
      state.configDisabled = status
    },
    UPDATE_SETTINGS: (state, { group, key, input, value, type }) => {
      const updatedSetting = !state.updatedSettings[group] || (key === 'Pleroma.Emails.Mailer' && input === ':adapter')
        ? { [key]: { [input]: [type, value] }}
        : { [key]: { ...state.updatedSettings[group][key], ...{ [input]: [type, value] }}}
      state.updatedSettings[group] = { ...state.updatedSettings[group], ...updatedSetting }
    },
    UPDATE_STATE: (state, { group, key, input, value }) => {
      const updatedState = key === 'Pleroma.Emails.Mailer' && input === ':adapter'
        ? { [key]: { [input]: value }}
        : { [key]: { ...state.settings[group][key], ...{ [input]: value }}}
      state.settings[group] = { ...state.settings[group], ...updatedState }
    }
  },
  actions: {
    async FetchFrontends({ commit, getters }) {
      const { data } = await fetchFrontends(getters.authHost, getters.token)
      commit('SET_FRONTENDS', data)
    },
    async FetchInstanceDocument({ commit, getters }, name) {
      const { data } = await getInstanceDocument(name, getters.authHost, getters.token)
      if (name === 'instance-panel') {
        commit('SET_INSTANCE_PANEL', data)
      } else {
        commit('SET_TERMS_OF_SERVICES', data)
      }
    },
    async FetchSettings({ commit, getters }) {
      commit('SET_LOADING', true)
      try {
        const settings = await fetchSettings(getters.authHost, getters.token)
        commit('SET_SETTINGS', settings.data.configs)

        const { data } = await fetchDescription(getters.authHost, getters.token)
        commit('SET_DESCRIPTION', data)
        const searchObject = formSearchObject(data)
        commit('SET_SEARCH', searchObject)
        commit('SET_TABS', tabs)
      } catch (e) {
        console.error(e)
        commit('TOGGLE_TABS', true)
        commit('SET_LOADING', false)
        return
      }
      commit('TOGGLE_TABS', false)
      commit('SET_LOADING', false)
    },
    async InstallFrontend({ commit, getters }, { name, ref, file, buildUrl, buildDir }) {
      const { data } = await installFrontend({ name, ref, file, build_url: buildUrl, build_dir: buildDir }, getters.authHost, getters.token)
      commit('SET_FRONTENDS', data)
    },
    async RemoveInstanceDocument({ dispatch, getters }, name) {
      await deleteInstanceDocument(name, getters.authHost, getters.token)
      await dispatch('FetchInstanceDocument', name)
    },
    async RemoveSetting({ commit, getters }, configs) {
      await removeSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      const { group, key, subkeys } = configs[0]
      commit('SET_SETTINGS', response.data.configs)
      commit('TOGGLE_REBOOT', response.data.need_reboot)
      commit('REMOVE_SETTING_FROM_UPDATED', { group, key, subkeys: subkeys || [] })
    },
    SetSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query)
    },
    async SubmitChanges({ getters, commit, state }) {
      const configs = Object.keys(state.updatedSettings).reduce((acc, group) => {
        return [...acc, ...wrapUpdatedSettings(group, state.updatedSettings[group], state.settings)]
      }, [])

      await updateSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
      commit('TOGGLE_REBOOT', response.data.need_reboot)
      commit('CLEAR_UPDATED_SETTINGS')
    },
    async UpdateInstanceDocs({ commit, getters }, { name, content }) {
      commit('SET_INSTANCE_PANEL', content)
      const formData = new FormData()
      const blob = new Blob([content], { type: 'text/html' })
      formData.append('file', blob)
      await updateInstanceDocument(name, formData, getters.authHost, getters.token)
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      key
        ? commit('UPDATE_SETTINGS', { group, key, input, value, type })
        : commit('UPDATE_SETTINGS', { group, key: input, input: '_value', value, type })
    },
    async UpdateState({ commit, getters, state }, { group, key, input, value }) {
      if (key === 'Pleroma.Emails.Mailer' && input === ':adapter') {
        const subkeys = Object.keys(state.settings[group][key]).filter(el => el !== ':adapter')
        await removeSettings([{ group, key, delete: true, subkeys }], getters.authHost, getters.token)
      } else if (key === 'Pleroma.Upload' && input === ':uploader') {
        const deletedKey = value === 'Pleroma.Uploaders.Local' ? 'Pleroma.Uploaders.S3' : 'Pleroma.Uploaders.Local'
        await removeSettings([{ group, key: deletedKey, delete: true }], getters.authHost, getters.token)
      }
      key
        ? commit('UPDATE_STATE', { group, key, input, value })
        : commit('UPDATE_STATE', { group, key: input, input: 'value', value })
    }
  }
}

export default settings
