import app from '@/store/modules/app'
import user from '@/store/modules/user'
import invites from '@/store/modules/invites'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    invites,
    user
  },
  getters
}
