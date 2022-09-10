<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="searchData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="search" :data="searchData"/>
    </el-form>
    <el-form v-if="isMeilisearch" :model="meilisearchData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="meilisearch" :data="meilisearchData"/>
    </el-form>
    <el-form v-if="isElasticsearch" :model="elasticsearchData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="elasticsearch" :data="elasticsearchData"/>
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
import _ from 'lodash'

export default {
  name: 'Search',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    search() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Search')
    },
    searchData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Search']) || {}
    },
    meilisearch() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Search.Meilisearch')
    },
    isMeilisearch() {
      return (_.get(this.settings.settings, [':pleroma', 'Pleroma.Search', ':module']) || '').toLowerCase().endsWith('meilisearch')
    },
    meilisearchData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Search.Meilisearch']) || {}
    },
    elasticsearch() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Search.Elasticsearch.Cluster')
    },
    isElasticsearch() {
      return (_.get(this.settings.settings, [':pleroma', 'Pleroma.Search', ':module']) || '').toLowerCase().endsWith('elasticsearch')
    },
    elasticsearchData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Search.Elasticsearch.Cluster']) || {}
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
    searchQuery() {
      return this.$store.state.settings.searchQuery
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
