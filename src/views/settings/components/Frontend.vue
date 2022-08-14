<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <frontends-table />
    <el-divider v-if="frontend" class="divider thick-line"/>
    <el-form :model="frontendData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="frontend" :data="frontendData"/>
    </el-form>
    <el-divider v-if="frontend" class="divider thick-line"/>
    <el-form :model="staticFeData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="staticFe" :data="staticFeData"/>
    </el-form>
    <el-divider v-if="staticFe" class="divider thick-line"/>
    <el-form :model="frontendsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="frontends" :data="frontendsData"/>
    </el-form>
    <el-divider v-if="frontends" class="divider thick-line"/>
    <el-form :model="assetsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="assets" :data="assetsData"/>
    </el-form>
    <el-divider v-if="assets" class="divider thick-line"/>
    <el-form :model="markupData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="markup" :data="markupData"/>
    </el-form>
    <el-divider v-if="preload" class="divider thick-line"/>
    <el-form :model="preloadData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="preload" :data="preloadData"/>
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
import FrontendsTable from './inputComponents/FrontendsTable'
import _ from 'lodash'

export default {
  name: 'Frontend',
  components: { FrontendsTable, Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    assets() {
      return this.settings.description.find(setting => setting.key === ':assets')
    },
    assetsData() {
      return _.get(this.settings.settings, [':pleroma', ':assets']) || {}
    },
    frontend() {
      return this.settings.description.find(setting => setting.key === ':frontend_configurations')
    },
    frontendData() {
      return _.get(this.settings.settings, [':pleroma', ':frontend_configurations']) || {}
    },
    frontends() {
      return this.settings.description.find(setting => setting.key === ':frontends')
    },
    frontendsData() {
      return _.get(this.settings.settings, [':pleroma', ':frontends']) || {}
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
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
    markup() {
      return this.settings.description.find(setting => setting.key === ':markup')
    },
    markupData() {
      return _.get(this.settings.settings, [':pleroma', ':markup']) || {}
    },
    preload() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Preload')
    },
    preloadData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Web.Preload']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    staticFe() {
      return this.settings.description.find(setting => setting.key === ':static_fe')
    },
    staticFeData() {
      return _.get(this.settings.settings, [':pleroma', ':static_fe']) || {}
    }
  },
  mounted() {
    if (this.searchQuery.length > 0) {
      const selectedSetting = document.querySelector(`[data-search="${this.searchQuery}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
      this.$store.dispatch('SetSearchQuery', '')
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
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
