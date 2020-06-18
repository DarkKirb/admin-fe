import {
  addNewEmojiFile,
  createPack,
  deleteEmojiFile,
  deletePack,
  downloadFrom,
  fetchPack,
  importFromFS,
  listPacks,
  listRemotePacks,
  reloadEmoji,
  savePackMetadata,
  updateEmojiFile
} from '@/api/emojiPacks'
import i18n from '@/lang'
import { Message } from 'element-ui'

import Vue from 'vue'

const emojiPacks = {
  state: {
    activeCollapseItems: [],
    localPacks: {},
    remoteInstance: '',
    remotePacks: {}
  },
  mutations: {
    SET_ACTIVE_COLLAPSE_ITEMS: (state, items) => {
      state.activeCollapseItems = items
    },
    SET_LOCAL_PACKS: (state, packs) => {
      state.localPacks = packs
    },
    SET_PACK_FILES: (state, { name, files }) => {
      state.localPacks = { ...state.localPacks, [name]: { ...state.localPacks[name], files }}
    },
    SET_REMOTE_INSTANCE: (state, name) => {
      state.remoteInstance = name
    },
    SET_REMOTE_PACKS: (state, packs) => {
      state.remotePacks = packs
    },
    UPDATE_LOCAL_PACK_VAL: (state, { name, key, value }) => {
      Vue.set(state.localPacks[name]['pack'], key, value)
    },
    UPDATE_LOCAL_PACK_PACK: (state, { name, pack }) => {
      state.localPacks[name]['pack'] = pack
    },
    UPDATE_LOCAL_PACK_FILES: (state, { name, files }) => {
      // Use vue.set in case "files" was null
      Vue.set(
        state.localPacks[name],
        'files',
        files
      )
    }
  },
  actions: {
    async AddNewEmojiFile({ commit, getters }, { packName, file, shortcode, filename }) {
      let result
      try {
        result = await addNewEmojiFile(packName, file, shortcode, filename, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })

      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
    },
    async DeleteEmojiFile({ commit, getters }, { packName, shortcode }) {
      let result
      try {
        result = await deleteEmojiFile(packName, shortcode, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })

      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
    },
    async CreatePack({ getters }, { name }) {
      await createPack(getters.authHost, getters.token, name)
    },
    async DeletePack({ getters }, { name }) {
      await deletePack(getters.authHost, getters.token, name)
    },
    async DownloadFrom({ getters }, { instanceAddress, packName, as }) {
      const result = await downloadFrom(getters.authHost, instanceAddress, packName, as, getters.token)

      if (result.data === 'ok') {
        Message({
          message: `${i18n.t('settings.successfullyDownloaded')} ${packName}`,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async FetchPack({ getters, commit }, name) {
      const { data } = await fetchPack(name, getters.authHost, getters.token)
      commit('SET_PACK_FILES', { name, files: data.files })
    },
    async ImportFromFS({ getters }) {
      const result = await importFromFS(getters.authHost, getters.token)

      if (result.status === 200) {
        const message = result.data.length > 0
          ? `${i18n.t('settings.successfullyImported')} ${result.data}`
          : i18n.t('settings.nowNewPacksToImport')

        Message({
          message,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async ReloadEmoji({ getters }) {
      await reloadEmoji(getters.authHost, getters.token)
    },
    async SavePackMetadata({ commit, getters, state }, { packName }) {
      const result =
        await savePackMetadata(
          getters.authHost,
          getters.token,
          packName,
          state.localPacks[packName]['pack']
        )

      if (result.status === 200) {
        Message({
          message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_PACK', { name: packName, pack: result.data })
      }
    },
    SetActiveCollapseItems({ commit }, activeItems) {
      commit('SET_ACTIVE_COLLAPSE_ITEMS', activeItems)
    },
    async SetLocalEmojiPacks({ commit, getters }) {
      const { data } = await listPacks(getters.authHost)
      const packs = Object.keys(data).reduce((acc, packName) => {
        const { files, ...pack } = data[packName]
        acc[packName] = pack
        return acc
      }, {})
      commit('SET_LOCAL_PACKS', packs)
    },
    async SetRemoteEmojiPacks({ commit, getters }, { remoteInstance }) {
      const { data } = await listRemotePacks(getters.authHost, getters.token, remoteInstance)

      commit('SET_REMOTE_INSTANCE', remoteInstance)
      commit('SET_REMOTE_PACKS', data)
    },
    SetRemoteInstance({ commit }, instance) {
      commit('SET_REMOTE_INSTANCE', instance)
    },
    async UpdateEmojiFile({ commit, getters }, { packName, shortcode, newShortcode, newFilename, force }) {
      let result
      try {
        result = await updateEmojiFile(packName, shortcode, newShortcode, newFilename, force, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })

      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
    },
    async UpdateLocalPackVal({ commit }, args) {
      commit('UPDATE_LOCAL_PACK_VAL', args)
    }
  }
}

export default emojiPacks
