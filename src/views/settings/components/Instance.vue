<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="instanceData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="instance" :data="instanceData"/>
    </el-form>
    <editor-input v-model="instancePanelContent" :name="'instance-panel'" @input="handleEditorUpdate"/>
    <el-divider v-if="instance" class="divider thick-line"/>
    <el-form :model="restrictUnauthenticatedData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="restrictUnauthenticated" :data="restrictUnauthenticatedData"/>
    </el-form>
    <el-divider v-if="restrictUnauthenticated" class="divider thick-line"/>
    <el-form :model="adminTokenData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="adminToken" :data="adminTokenData"/>
    </el-form>
    <el-divider v-if="adminToken" class="divider thick-line"/>
    <el-form :model="welcomeData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="welcome" :data="welcomeData"/>
    </el-form>
    <el-divider v-if="welcome" class="divider thick-line"/>
    <el-form :model="scheduledActivityData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="scheduledActivity" :data="scheduledActivityData"/>
    </el-form>
    <el-divider v-if="scheduledActivity" class="divider thick-line"/>
    <el-form :model="manifestData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="manifest" :data="manifestData"/>
    </el-form>
    <el-divider v-if="manifest" class="divider thick-line"/>
    <el-form :model="pleromaUserData" :label-position="labelPosition" :label-width="labelWidth" data-search="Pleroma.User">
      <setting :setting-group="pleromaUser" :data="pleromaUserData"/>
    </el-form>
    <el-divider v-if="pleromaUser" class="divider thick-line"/>
    <el-form :model="faviconsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="favicons" :data="faviconsData"/>
    </el-form>
    <el-divider v-if="favicons" class="divider thick-line"/>
    <el-form :model="uriSchemesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uriSchemes" :data="uriSchemesData"/>
    </el-form>
    <el-divider v-if="uriSchemes" class="divider thick-line"/>
    <el-form :model="feedData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="feed" :data="feedData"/>
    </el-form>
    <el-divider v-if="feed" class="divider thick-line"/>
    <el-form :model="streamerData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="streamer" :data="streamerData"/>
    </el-form>
    <el-divider v-if="translator" class="divider thick-line"/>
    <el-form :model="translatorData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="translator" :data="translatorData"/>
    </el-form>
    <el-form v-if="usesDeepL" :model="deeplData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="deepl" :data="deeplData"/>
    </el-form>
    <el-form v-if="usesLibreTranslate" :model="libretranslateData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="libre_translate" :data="libretranslateData"/>
    </el-form>

    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import { EditorInput } from './inputComponents'
import _ from 'lodash'

export default {
  name: 'Instance',
  components: {
    EditorInput,
    Setting
  },
  data() {
    return {
      editorContent: ''
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    adminToken() {
      return this.settings.description.find(setting => setting.children && setting.children[0].key === ':admin_token')
    },
    adminTokenData() {
      return _.get(this.settings.settings, [':pleroma', ':admin_token']) || {}
    },
    instancePanelContent: {
      get() {
        return this.$store.state.settings.instancePanel
      },
      set(content) {
        this.editorContent = content
      }
    },
    favicons() {
      return this.settings.description.find(setting => setting.key === ':instances_favicons')
    },
    faviconsData() {
      return _.get(this.settings.settings, [':pleroma', ':instances_favicons']) || {}
    },
    feed() {
      return this.settings.description.find(setting => setting.key === ':feed')
    },
    feedData() {
      return _.get(this.settings.settings, [':pleroma', ':feed']) || {}
    },
    instance() {
      return this.settings.description.find(setting => setting.key === ':instance')
    },
    instanceData() {
      return _.get(this.settings.settings, [':pleroma', ':instance']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'sidebar-opened' : 'sidebar-closed'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    loading() {
      return this.settings.loading
    },
    manifest() {
      return this.settings.description.find(setting => setting.key === ':manifest')
    },
    manifestData() {
      return _.get(this.settings.settings, [':pleroma', ':manifest']) || {}
    },
    pleromaUser() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.User')
    },
    pleromaUserData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.User']) || {}
    },
    restrictUnauthenticated() {
      return this.settings.description.find(setting => setting.key === ':restrict_unauthenticated')
    },
    restrictUnauthenticatedData() {
      return _.get(this.settings.settings, [':pleroma', ':restrict_unauthenticated']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    scheduledActivity() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.ScheduledActivity')
    },
    scheduledActivityData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.ScheduledActivity']) || {}
    },
    streamer() {
      return this.$store.state.settings.description.find(setting => setting.key === ':streamer')
    },
    streamerData() {
      return _.get(this.settings.settings, [':pleroma', ':streamer']) || {}
    },
    uriSchemes() {
      return this.settings.description.find(setting => setting.key === ':uri_schemes')
    },
    uriSchemesData() {
      return _.get(this.settings.settings, [':pleroma', ':uri_schemes']) || {}
    },
    welcome() {
      return this.settings.description.find(setting => setting.key === ':welcome')
    },
    welcomeData() {
      return _.get(this.settings.settings, [':pleroma', ':welcome']) || {}
    },
    translator() {
      return this.$store.state.settings.description.find(setting => setting.key === ':translator')
    },
    translatorData() {
      return _.get(this.settings.settings, [':pleroma', ':translator']) || {}
    },
    usesDeepL() {
      return (_.get(this.settings.settings, [':pleroma', ':translator', ':module']) || '').toLowerCase().endsWith('deepl')
    },
    usesLibreTranslate() {
      return (_.get(this.settings.settings, [':pleroma', ':translator', ':module']) || '').toLowerCase().endsWith('libretranslate')
    },
    deepl() {
      return this.$store.state.settings.description.find(setting => setting.key === ':deepl')
    },
    deeplData() {
      return _.get(this.settings.settings, [':pleroma', ':deepl']) || {}
    },
    libre_translate() {
      return this.$store.state.settings.description.find(setting => setting.key === ':libre_translate')
    },
    libretranslateData() {
      return _.get(this.settings.settings, [':pleroma', ':libre_translate']) || {}
    }
  },
  async mounted() {
    if (this.searchQuery.length > 0) {
      const selectedSetting = document.querySelector(`[data-search="${this.searchQuery}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
      this.$store.dispatch('SetSearchQuery', '')
    }

    await this.$store.dispatch('FetchInstanceDocument', 'instance-panel')
  },
  methods: {
    handleEditorUpdate(content) {
      this.editorContent = content
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
        await this.$store.dispatch('UpdateInstanceDocs', {
          name: 'instance-panel',
          content: this.editorContent.length > 0 ? this.editorContent : this.instancePanelContent
        })
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
