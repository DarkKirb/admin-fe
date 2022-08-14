import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import emojiPacks from './modules/emojiPacks'
import errorLog from './modules/errorLog'
import getters from './getters'
import invites from './modules/invites'
import mediaProxyCache from './modules/mediaProxyCache'
import moderationLog from './modules/moderationLog'
import peers from './modules/peers'
import permission from './modules/permission'
import relays from './modules/relays'
import reports from './modules/reports'
import settings from './modules/settings'
import status from './modules/status'
import tagsView from './modules/tagsView'
import user from './modules/user'
import userProfile from './modules/userProfile'
import users from './modules/users'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    emojiPacks,
    invites,
    mediaProxyCache,
    moderationLog,
    peers,
    permission,
    relays,
    reports,
    settings,
    status,
    tagsView,
    user,
    userProfile,
    users
  },
  getters
})

export default store
