import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Users from '@/views/users/index'
import NewAccountDialog from '@/views/users/components/NewAccountDialog'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}
config.stubs['users-filter'] = '<div />'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/users')

describe('Search and filter users', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches initial list of users', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })

    await flushPromises()
    expect(wrapper.vm.usersCount).toEqual(3)
    done()
  })

  it('starts a search on input change', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })

    wrapper.vm.handleDebounceSearchInput = (query) => {
      store.dispatch('SearchUsers', { query, page: 1 })
    }

    await flushPromises()
    expect(wrapper.vm.usersCount).toEqual(3)
    const input = wrapper.find('.search input.el-input__inner')
    input.element.value = 'bob'
    input.trigger('input')
    await flushPromises()
    expect(wrapper.vm.usersCount).toEqual(1)

    input.element.value = ''
    input.trigger('input')
    await flushPromises()
    expect(wrapper.vm.usersCount).toEqual(3)

    done()
  })
})

describe('Users actions', () => {
  let store
  const htmlElement = (trChild, liChild) =>
    `.el-table__fixed-body-wrapper table tr:nth-child(${trChild}) ul.el-dropdown-menu li:nth-child(${liChild})`

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('grants admin and moderator rights to a local user', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const user = store.state.users.fetchedUsers[2]
    expect(user.roles.admin).toBe(false)
    expect(user.roles.moderator).toBe(false)

    wrapper.find(htmlElement(3, 1)).trigger('click')
    await flushPromises()
    wrapper.find(htmlElement(3, 2)).trigger('click')
    await flushPromises()

    const updatedUser = store.state.users.fetchedUsers[2]
    expect(updatedUser.roles.admin).toBe(true)
    expect(updatedUser.roles.moderator).toBe(true)
    done()
  })

  it('does not show actions that grant admin and moderator rights to external users', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const dropdownMenuItems = wrapper.findAll(
      `.el-table__fixed-body-wrapper table tr:nth-child(2) ul.el-dropdown-menu li`
    )
    expect(dropdownMenuItems.length).toBe(6)
    done()
  })

  it('toggles activation status', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const user = store.state.users.fetchedUsers[1]
    expect(user.deactivated).toBe(false)

    wrapper.find(htmlElement(2, 1)).trigger('click')
    await flushPromises()

    const updatedUser = store.state.users.fetchedUsers[1]
    expect(updatedUser.deactivated).toBe(true)
    done()
  })

  it('deletes user', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()
    expect(store.state.users.fetchedUsers.length).toEqual(3)

    wrapper.find(htmlElement(2, 2)).trigger('click')
    await flushPromises()
    expect(store.state.users.fetchedUsers.length).toEqual(2)
    done()
  })

  it('adds tags', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    expect(user1.tags.length).toBe(0)
    expect(user2.tags.length).toBe(1)

    wrapper.find(htmlElement(1, 5)).trigger('click')
    await flushPromises()
    wrapper.find(htmlElement(2, 5)).trigger('click')
    await flushPromises()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    expect(updatedUser1.tags.length).toBe(1)
    expect(updatedUser2.tags.length).toBe(2)
    done()
  })

  it('deletes tags', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const user = store.state.users.fetchedUsers[1]
    expect(user.tags.length).toBe(1)

    wrapper.find(htmlElement(2, 6)).trigger('click')
    await flushPromises()

    const updatedUser = store.state.users.fetchedUsers[1]
    expect(updatedUser.tags.length).toBe(0)
    done()
  })

  it('shows check icon when tag is added', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    expect(wrapper.find(`${htmlElement(1, 5)} i`).exists()).toBe(false)

    wrapper.find(htmlElement(1, 5)).trigger('click')
    await flushPromises()

    expect(wrapper.find(`${htmlElement(1, 5)} i`).exists()).toBe(true)
    done()
  })

  it('does not change user index in array when tag is added', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const firstUserNickname = store.state.users.fetchedUsers[0].nickname
    const secondUserNickname = store.state.users.fetchedUsers[1].nickname
    expect(firstUserNickname).toBe('allis')
    expect(secondUserNickname).toBe('bob')

    wrapper.find(htmlElement(2, 5)).trigger('click')
    await flushPromises()

    const firstUserNicknameAfterToggle = store.state.users.fetchedUsers[0].nickname
    const secondUserNicknameAfterToggle = store.state.users.fetchedUsers[1].nickname

    expect(firstUserNicknameAfterToggle).toEqual('allis')
    expect(secondUserNicknameAfterToggle).toEqual('bob')
    done()
  })
})

describe('Creates new account', () => {
  let store

  const nicknameInput = 'input[name="nickname"]'
  const emailInput = 'input[name="email"]'
  const passwordInput = 'input[name="password"]'

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('opens and closes dialog window', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()

    const dialog = wrapper.find('div.el-dialog__wrapper')
    expect(dialog.isVisible()).toBe(false)

    const openDialogButton = wrapper.find('button.actions-button')
    const closeDialogButton = wrapper.find('div.el-dialog__footer button')

    openDialogButton.trigger('click')
    await flushPromises()
    expect(dialog.isVisible()).toBe(true)

    closeDialogButton.trigger('click')
    await flushPromises()
    expect(dialog.isVisible()).toBe(false)
    done()
  })

  it('creates new account', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue,
      sync: false
    })
    await flushPromises()
    expect(wrapper.vm.usersCount).toEqual(3)

    const openDialogButton = wrapper.find('button.actions-button')
    openDialogButton.trigger('click')
    await flushPromises()

    const nickname = wrapper.find(nicknameInput)
    nickname.element.value = 'marshall'
    nickname.trigger('input')

    const email = wrapper.find(emailInput)
    email.element.value = 'marshall@marshall.com'
    email.trigger('input')

    const password = wrapper.find(passwordInput)
    password.element.value = '1234'
    password.trigger('input')

    const createButton = wrapper.find('button.el-button--primary')
    createButton.trigger('click')
    await flushPromises()

    expect(wrapper.vm.usersCount).toEqual(4)
    done()
  })

  it('validates data', () => {
    const wrapper = mount(NewAccountDialog, {
      store,
      localVue,
      sync: false
    })

    const validateEmailRule = { validator: wrapper.vm.validateEmail, field: 'email', fullField: 'email', type: 'string' }
    const validatePasswordRule = { validator: wrapper.vm.validatePassword, field: 'password', fullField: 'password', type: 'string' }
    const validateUsernameRule = { validator: wrapper.vm.validateUsername, field: 'nickname', fullField: 'nickname', type: 'string' }
    const identity = val => val

    expect(wrapper.vm.validateUsername(validateUsernameRule, '', identity)).toBeInstanceOf(Error)
    expect(wrapper.vm.validateUsername(validateUsernameRule, 'marshall%$', identity)).toBeInstanceOf(Error)
    expect(wrapper.vm.validateUsername(validateUsernameRule, 'Marshall66', identity)).toBeUndefined()

    expect(wrapper.vm.validateEmail(validateEmailRule, '', identity)).toBeInstanceOf(Error)
    expect(wrapper.vm.validateEmail(validateEmailRule, 'test', identity)).toBeInstanceOf(Error)
    expect(wrapper.vm.validateEmail(validateEmailRule, 'test@test.com', identity)).toBeUndefined()

    expect(wrapper.vm.validatePassword(validatePasswordRule, '', identity)).toBeInstanceOf(Error)
    expect(wrapper.vm.validatePassword(validatePasswordRule, '1234', identity)).toBeUndefined()


  })
})
