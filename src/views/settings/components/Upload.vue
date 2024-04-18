<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="uploadData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="upload" :data="uploadData"/>
    </el-form>
    <el-divider v-if="upload" class="divider thick-line"/>
    <el-form v-if="showUploadersLocal" :model="uploadersLocalData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uploadersLocal" :data="uploadersLocalData"/>
      <el-divider v-if="uploadersLocal" class="divider thick-line"/>
    </el-form>
    <el-form v-if="showUploadersS3" :model="s3Data" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="s3" :data="s3Data"/>
      <el-divider v-if="s3" class="divider thick-line"/>
    </el-form>
    <el-form v-if="showUploadersS3" :model="uploadersS3Data" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uploadersS3" :data="uploadersS3Data"/>
      <el-divider v-if="uploadersS3" class="divider thick-line"/>
    </el-form>
    <el-form :model="uploadFilterMogrifyData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uploadFilterMogrify" :data="uploadFilterMogrifyData"/>
    </el-form>
    <el-divider v-if="uploadFilterMogrify" class="divider thick-line"/>
    <el-form :model="uploadAnonymizeFilenameData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uploadAnonymizeFilename" :data="uploadAnonymizeFilenameData"/>
    </el-form>
    <el-divider v-if="uploadAnonymizeFilename" class="divider thick-line"/>
    <el-form :model="uploadExiftoolStripMetadataData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uploadExiftoolStripMetadata" :data="uploadExiftoolStripMetadataData"/>
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
  name: 'Upload',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
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
    s3() {
      return this.settings.description.find(setting => setting.key === ':s3')
    },
    s3Data() {
      return _.get(this.settings.settings, [':ex_aws', ':s3']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    showUploadersS3() {
      const uploader = _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload', ':uploader'])
      return uploader === 'Pleroma.Uploaders.S3'
    },
    showUploadersLocal() {
      const uploader = _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload', ':uploader'])
      return uploader === 'Pleroma.Uploaders.Local'
    },
    upload() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload')
    },
    uploadData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload']) || {}
    },
    uploadersLocal() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Uploaders.Local')
    },
    uploadersLocalData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Uploaders.Local']) || {}
    },
    uploadersS3() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Uploaders.S3')
    },
    uploadersS3Data() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Uploaders.S3']) || {}
    },
    uploadFilterMogrify() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload.Filter.Mogrify')
    },
    uploadFilterMogrifyData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload.Filter.Mogrify']) || {}
    },
    uploadAnonymizeFilename() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload.Filter.AnonymizeFilename')
    },
    uploadAnonymizeFilenameData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload.Filter.AnonymizeFilename']) || {}
    },
    uploadExiftoolStripMetadata() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload.Filter.Exiftool.StripMetadata')
    },
    uploadExiftoolStripMetadataData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload.Filter.Exiftool.StripMetadata']) || {}
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
