import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Invites from '@/views/invites/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/invites')

describe('Invite tokens', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches initial list of invtie tokens', async (done) => {
    mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link']
    })

    await flushPromises()
    const inviteTokens = store.state.invites.inviteTokens
    expect(inviteTokens.length).toEqual(3)
    done()
  })

  it('opens and closes dialog window', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link']
    })
    await flushPromises()

    const dialog = wrapper.find('div.el-dialog__wrapper .create-new-token-dialog')
    expect(dialog.isVisible()).toBe(false)

    const openDialogButton = wrapper.find('button.create-invite-token')
    const closeDialogButton = wrapper.find('div.el-dialog__footer button')

    openDialogButton.trigger('click')
    await flushPromises()
    expect(dialog.isVisible()).toBe(true)

    closeDialogButton.trigger('click')
    await flushPromises()
    expect(dialog.isVisible()).toBe(false)
    done()
  })

  it('generates new invtie token', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link']
    })
    await flushPromises()
    expect(store.state.invites.inviteTokens.length).toEqual(3)
    expect(Object.keys(store.state.invites.newToken).length).toEqual(0)

    const openDialogButton = wrapper.find('button.create-invite-token')
    openDialogButton.trigger('click')
    await flushPromises()

    const maxUseInput = wrapper.find('input[name="maxUse"]')
    maxUseInput.element.value = 3
    maxUseInput.trigger('input')

    const expireDate = wrapper.find('input[name="date"]')
    expireDate.element.value = '2019-04-10'
    expireDate.trigger('input')

    const createButton = wrapper.find('.create-new-token-dialog button.el-button--primary')
    createButton.trigger('click')
    await flushPromises()

    expect(store.state.invites.inviteTokens.length).toEqual(4)
    expect(Object.keys(store.state.invites.newToken).length).toEqual(3)
    expect(store.state.invites.newToken.token).toEqual('JYl0SjXW8t-t-pLSZBnZLf6PwjCW-qy6Dq70jfUOuqk=')
    expect(store.state.invites.newToken.expiresAt).toEqual('2019-04-10')
    expect(store.state.invites.newToken.maxUse).toEqual(3)
    done()
  })

  it('revokes invite token', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link']
    })

    await flushPromises()
    expect(store.state.invites.inviteTokens[3].used).toBe(false)

    const revokeButton = wrapper.find('table tr button')
    revokeButton.trigger('click')
    await flushPromises()

    expect(store.state.invites.inviteTokens[0].used).toBe(true)
    done()
  })

  it('invites user via email', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link']
    })

    const dialog = wrapper.find('div.el-dialog__wrapper .invite-via-email-dialog')
    expect(dialog.isVisible()).toBe(false)

    const inviteUserViaEmailStub = jest.fn()
    wrapper.setMethods({ inviteUserViaEmail: inviteUserViaEmailStub })

    const openDialogButton = wrapper.find('button.invite-via-email')
    openDialogButton.trigger('click')
    await flushPromises()
    expect(dialog.isVisible()).toBe(true)

    const email = wrapper.find('input[name="email"]')
    email.element.value = 'bob@gmail.com'
    email.trigger('input')

    const name = wrapper.find('input[name="name"]')
    name.element.value = 'Bob'
    name.trigger('input')

    const createButton = wrapper.find('.invite-via-email-dialog button.el-button--primary')
    createButton.trigger('click')
    await flushPromises()

    expect(wrapper.vm.inviteUserViaEmail).toHaveBeenCalled()
    done()
  })
})