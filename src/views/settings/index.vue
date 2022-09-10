<template>
  <div :class="rebootIsSidebarOpen" class="settings-container">
    <div class="reboot-button-container">
      <reboot-button/>
    </div>
    <div v-if="isDesktop">
      <div :class="isSidebarOpen">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <div class="docs-search-container">
          <el-link
            :underline="false"
            href="https://docs.akkoma.dev/stable/administration/CLI_tasks/config/"
            target="_blank">
            <el-button class="settings-docs-button">
              <span>
                <i class="el-icon-document"/>
                {{ $t('settings.seeDocs') }}
              </span>
            </el-button>
          </el-link>
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="Search"
            prefix-icon="el-icon-search"
            class="settings-search-input"
            @select="handleSearchSelect"/>
        </div>
      </div>
      <component :is="componentName"/>
    </div>
    <div v-if="isMobile || isTablet">
      <div :class="isSidebarOpen" class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <el-link
          :underline="false"
          href="https://docs-develop.pleroma.social/backend/administration/CLI_tasks/config/"
          target="_blank">
          <el-button class="settings-docs-button">
            <span>
              <i class="el-icon-document"/>
              {{ $t('settings.seeDocs') }}
            </span>
          </el-button>
        </el-link>
      </div>
      <div class="settings-search-container">
        <el-autocomplete
          v-model="searchQuery"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          placeholder="Search"
          prefix-icon="el-icon-search"
          class="settings-search-input"
          @select="handleSearchSelect"/>
      </div>
      <component :is="componentName"/>
    </div>
  </div>
</template>

<script>
import { tabs } from './components/tabs'
import {
  ActivityPub,
  Authentication,
  Captcha,
  Emoji,
  Esshd,
  Frontend,
  Http,
  Instance,
  JobQueue,
  LinkFormatter,
  Logger,
  Mailer,
  MediaProxy,
  Metadata,
  Mrf,
  Other,
  RateLimiters,
  Upload,
  Search,
  WebPush
} from './components'
import RebootButton from '@/components/RebootButton'

export default {
  components: {
    ActivityPub,
    Authentication,
    Captcha,
    Emoji,
    Esshd,
    Frontend,
    Http,
    Instance,
    JobQueue,
    LinkFormatter,
    Logger,
    Mailer,
    MediaProxy,
    Metadata,
    Mrf,
    Other,
    RateLimiters,
    RebootButton,
    Upload,
    Search,
    WebPush
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    componentName() {
      return this.$route.path.split('/settings/').pop()
    },
    configDisabled() {
      return this.$store.state.settings.configDisabled
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'header-sidebar-opened' : 'header-sidebar-closed'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    rebootIsSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'reboot-sidebar-opened' : 'reboot-sidebar-closed'
    },
    searchData() {
      return this.$store.state.settings.searchData
    },
    tabs() {
      return tabs(this.$store.state.settings.description)
    }
  },
  mounted: function() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchSettings')
  },
  methods: {
    handleSearchSelect(selectedValue) {
      this.$store.dispatch('SetSearchQuery', selectedValue.key)
      const tab = Object.keys(this.tabs).find(tab => {
        return this.tabs[tab].settings.includes(selectedValue.group === ':pleroma' ? selectedValue.key : selectedValue.group)
      })
      if (this.$router.currentRoute.path === `/settings/${tab}`) {
        this.scrollTo(selectedValue.key)
      } else if (tab) {
        this.$router.push({ path: `/settings/${tab}` })
      }
    },
    scrollTo(searchQuery) {
      const selectedSetting = document.querySelector(`[data-search="${searchQuery}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    },
    querySearch(queryString, cb) {
      const results = this.searchData.filter(searchObj => searchObj.search.find(el => el.includes(queryString.toLowerCase())))
        .map(searchObj => {
          return { value: `${searchObj.label} in ${searchObj.groupLabel}`, group: searchObj.groupKey, key: searchObj.key }
        })
      cb(results)
    },
    settingsCantBeChanged(settings) {
      const existingSettings = settings.filter(setting => {
        if ([':esshd', ':cors_plug', ':quack', ':logger', ':swoosh', ':mime'].includes(setting)) {
          return this.$store.state.settings.description.findIndex(el => el.group === setting) !== -1
        } else if (setting === 'Pleroma.Web.Auth.Authenticator' || setting === ':admin_token') {
          return this.$store.state.settings.description.findIndex(el => el.children[0].key === setting) !== -1
        } else {
          return this.$store.state.settings.description.findIndex(el => el.key === setting) !== -1
        }
      })
      return existingSettings.length === 0
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
@import '../styles/settings';
@include settings
</style>
