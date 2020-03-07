<template>
  <div v-if="!loading">
    <el-form-item v-if="settingGroup.description" class="description-container">
      <span class="description" v-html="getFormattedDescription(settingGroup.description)"/>
    </el-form-item>
    <div v-if="settingGroup.key === 'Pleroma.Emails.Mailer'">
      <div v-for="setting in settingGroup.children.filter(setting => !setting.group)" :key="setting.key">
        <inputs
          :setting-group="settingGroup"
          :setting="setting"
          :data="data"/>
      </div>
      <div
        v-for="setting in emailAdapterChildren"
        :key="setting.key">
        <inputs
          :setting-group="settingGroup"
          :setting="setting"
          :data="data"/>
      </div>
    </div>
    <div v-else>
      <div v-for="setting in settingGroup.children" :key="setting.key">
        <div v-if="!compound(setting)">
          <inputs
            :setting-group="settingGroup"
            :setting="setting"
            :data="data"
            :nested="false"/>
        </div>
        <div v-if="compound(setting)">
          <el-divider v-if="divideSetting(setting.key)" class="divider"/>
          <div v-if="!setting.children">
            <inputs
              :setting-group="settingGroup"
              :setting="setting"
              :data="data[setting.key]"
              :nested="true"/>
          </div>
          <div v-else>
            <div class="input-container">
              <el-form-item class="grouped-settings-header">
                <span slot="label">
                  <el-tooltip v-if="isDesktop && canBeDeleted(setting.key)" :content="$t('settings.removeFromDB')" placement="bottom-end">
                    <el-button icon="el-icon-delete" circle size="mini" style="margin-left:5px" @click="removeSetting(setting.key)"/>
                  </el-tooltip>
                </span>
                <span class="label-font">{{ setting.label }}</span>
                <el-tooltip v-if="canBeDeleted(setting.key) && (isMobile || isTablet)" :content="$t('settings.removeFromDB')" placement="bottom-end">
                  <el-button icon="el-icon-delete" circle size="mini" class="settings-delete-button" @click="removeSetting(setting.key)"/>
                </el-tooltip>
              </el-form-item>
            </div>
            <div v-for="subSetting in setting.children" :key="subSetting.key">
              <inputs
                :setting-group="settingGroup"
                :setting-parent="[setting, subSetting]"
                :setting="subSetting"
                :data="data[setting.key]"
                :nested="true"/>
            </div>
          </div>
          <el-divider class="divider"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Inputs from './Inputs'
import i18n from '@/lang'
import _ from 'lodash'
import marked from 'marked'

export default {
  name: 'Setting',
  components: {
    Inputs
  },
  props: {
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    emailAdapterChildren() {
      const adapter = this.$store.state.settings.settings[':pleroma']['Pleroma.Emails.Mailer'][':adapter']
      return this.settingGroup.children.filter(child => child.group && child.group.includes(adapter))
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
    canBeDeleted(settingKey) {
      const { group, key } = this.settingGroup
      const existingKey = key || settingKey
      return _.get(this.$store.state.settings.db, [group, existingKey]) &&
        this.$store.state.settings.db[group][existingKey].includes(settingKey)
    },
    compound({ type, key, children }) {
      return type === 'keyword' ||
        type === 'map' ||
        type.includes('keyword') ||
        key === ':replace'
    },
    divideSetting(key) {
      return [':sslopts', ':tlsopts', ':adapter', ':poll_limits', ':queues', ':styling', ':proxy_opts'].includes(key)
    },
    getFormattedDescription(desc) {
      return marked(desc)
    },
    async removeSetting(key) {
      const config = this.settingGroup.key
        ? [{ group: this.settingGroup.group, key: this.settingGroup.key, delete: true, subkeys: [key] }]
        : [{ group: this.settingGroup.group, key, delete: true }]
      try {
        await this.$store.dispatch('RemoveSetting', config)
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.successfullyRemoved')
      })
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>