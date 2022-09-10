<template>
  <div class="input-container">
    <div v-if="setting.type === 'keyword'" class="keyword-container">
      <el-form-item
        :label-width="customLabelWidth"
        :class="labelClass"
        :style="`margin-left:${margin}px;margin-bottom:0`"
        :data-search="setting.key || setting.group">
        <span slot="label">
          {{ setting.label }}
          <el-tooltip v-if="canBeDeleted && isDesktop" :content="$t('settings.removeFromDB')" placement="bottom-end">
            <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
          </el-tooltip>
        </span>
      </el-form-item>
      <el-form-item v-for="subSetting in setting.children" :key="subSetting.key">
        <inputs
          :setting-group="settingGroup"
          :setting-parent="[...settingParent, subSetting]"
          :setting="subSetting"
          :data="data[setting.key]"
          :custom-label-width="isMobile ? '100px' : '120px'"
          :label-class="subSetting.type === 'keyword' ? 'center-label' : ''"
          :margin="isDesktop ? margin + 15 : margin + 8"
          :nested="true"/>
      </el-form-item>
    </div>
    <el-form-item v-if="setting.type !== 'keyword'" :label-width="customLabelWidth" :class="labelClass" :style="isDesktop ? '' : `margin-left:${margin}px`">
      <span slot="label">
        {{ setting.label }}
        <el-tooltip v-if="canBeDeleted && (isDesktop || isMobile)" :content="$t('settings.removeFromDB')" placement="bottom-end">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
        </el-tooltip>
      </span>
      <div class="input-row">
        <image-upload-input
          v-if="isImageUrl"
          :data="data"
          :setting-group="settingGroup"
          :setting="setting"
          :input-value="inputValue"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"
        />
        <el-input
          v-if="textareaInput"
          :value="inputValue"
          :placeholder="setting.suggestions ? setting.suggestions[0] : null"
          :data-search="setting.key || setting.group"
          type="textarea"
          class="input"
          @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
        <el-input
          v-else-if="setting.type === 'string' ||
          (Array.isArray(setting.type) && setting.type.includes('string') && setting.type.includes('atom'))"
          :value="inputValue"
          :placeholder="setting.suggestions ? setting.suggestions[0] : null"
          :data-search="setting.key || setting.group"
          class="input"
          @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
        <el-switch
          v-if="setting.type === 'boolean' && ![':registrations_open', ':invites_enabled'].includes(setting.key)"
          :value="inputValue"
          :data-search="setting.key || setting.group"
          class="switch-input"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
        <el-input-number
          v-if="setting.type === 'integer'"
          :value="inputValue === null ? undefined : inputValue"
          :placeholder="setting.suggestions ? setting.suggestions[0].toString() : null"
          :min="0"
          :size="isDesktop ? 'large' : 'medium'"
          :data-search="setting.key || setting.group"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
        <el-select
          v-if="renderSingleSelect(setting.type)"
          :value="inputValue === false ? 'false' : inputValue"
          :data-search="setting.key || setting.group"
          clearable
          class="input"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
          <el-option
            v-for="(option, index) in setting.suggestions"
            :value="option"
            :key="index"/>
        </el-select>
        <el-select
          v-if="renderMultipleSelect(setting.type)"
          :value="inputValue"
          :data-search="setting.key || setting.group"
          multiple
          filterable
          allow-create
          class="input"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
          <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
        </el-select>
        <el-input
          v-if="setting.key === ':ip'"
          :value="inputValue"
          :data-search="setting.key || setting.group"
          placeholder="xxx.xxx.xxx.xx"
          class="input"
          @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
        <el-input
          v-if="setting.type === 'atom'"
          :value="inputValue"
          :placeholder="setting.suggestions && setting.suggestions[0] ? setting.suggestions[0].substr(1) : ''"
          :data-search="setting.key || setting.group"
          class="input"
          @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
          <template slot="prepend">:</template>
        </el-input>
        <!-- special inputs -->
        <editable-keyword-input v-if="editableKeyword(setting.key, setting.type)" :data="keywordData" :setting-group="settingGroup" :setting="setting" :parents="settingParent"/>
        <icons-input v-if="setting.key === ':icons'" :data="iconsData" :setting-group="settingGroup" :setting="setting"/>
        <boolean-combined-input v-if="booleanCombinedInput" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <mascots-input v-if="setting.key === ':mascots'" :data="keywordData" :setting-group="settingGroup" :setting="setting"/>
        <prune-input v-if="setting.key === ':prune'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
        <rate-limit-input v-if="settingGroup.key === ':rate_limit'" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <reg-invites-input v-if="[':registrations_open', ':invites_enabled'].includes(setting.key)" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <select-input-with-reduced-labels v-if="reducedSelects" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <specific-multiple-select v-if="setting.key === ':backends' || setting.key === ':args'" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <sender-input v-if="senderInput(setting)" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting" :parents="settingParent"/>
        <!-------------------->
        <el-tooltip v-if="canBeDeleted && isTablet" :content="$t('settings.removeFromDB')" placement="bottom-end" class="delete-setting-button-container">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
        </el-tooltip>
      </div>
      <div
        v-if="setting.description && setting.type !== 'keyword'"
        class="expl"
        v-html="getFormattedDescription(setting.description)"/>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '@/lang'
import {
  EditableKeywordInput,
  IconsInput,
  ImageUploadInput,
  BooleanCombinedInput,
  MascotsInput,
  ProxyUrlInput,
  PruneInput,
  RateLimitInput,
  RegInvitesInput,
  SelectInputWithReducedLabels,
  SenderInput,
  SpecificMultipleSelect } from './inputComponents'
import { getBooleanValue, processNested } from '@/store/modules/normalizers'
import _ from 'lodash'
import marked from 'marked'

export default {
  name: 'Inputs',
  components: {
    EditableKeywordInput,
    IconsInput,
    ImageUploadInput,
    BooleanCombinedInput,
    MascotsInput,
    ProxyUrlInput,
    PruneInput,
    RateLimitInput,
    RegInvitesInput,
    SelectInputWithReducedLabels,
    SenderInput,
    SpecificMultipleSelect
  },
  props: {
    customLabelWidth: {
      type: String,
      default: function() {
        return this.labelWidth
      },
      required: false
    },
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    labelClass: {
      type: String,
      default: function() {
        return 'label'
      },
      required: false
    },
    margin: {
      type: Number,
      default: function() {
        return 0
      },
      required: false
    },
    nested: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingParent: {
      type: Array,
      default: function() {
        return []
      },
      required: false
    }
  },
  computed: {
    booleanCombinedInput() {
      return Array.isArray(this.setting.type) && this.setting.type.includes('boolean')
    },
    canBeDeleted() {
      const { group, key } = this.settingGroup
      return _.get(this.$store.state.settings.db, [group, key]) &&
        this.$store.state.settings.db[group][key].includes(this.setting.key)
    },
    iconsData() {
      return Array.isArray(this.data) ? this.data : []
    },
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':tesla', ':swoosh'].includes(this.settingGroup.group) &&
        this.data[this.setting.key]) {
        return this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':'
          ? this.data[this.setting.key].value.substr(1)
          : this.data[this.setting.key].value
      } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
        this.setting.key === 'Pleroma.Web.Auth.Authenticator' ||
        this.setting.key === ':admin_token') {
        return this.data.value
      } else if (this.settingGroup.group === ':mime' && this.settingParent[0].key === ':types') {
        return this.data.value ? this.data.value[this.setting.key] : []
      } else if (this.setting.type === 'atom') {
        return this.data[this.setting.key] && this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
      } else if (Array.isArray(this.setting.type) &&
          this.setting.type.find(el => Array.isArray(el) && el.includes('list'))) {
        return typeof this.data[this.setting.key] === 'string' ? [this.data[this.setting.key]] : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
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
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    keywordData() {
      if (this.settingParent.length > 0 ||
        (Array.isArray(this.setting.type) && this.setting.type.includes('tuple') && this.setting.type.includes('list'))) {
        return Array.isArray(this.data[this.setting.key]) ? this.data[this.setting.key] : []
      }
      return Array.isArray(this.data) ? this.data : []
    },
    reducedSelects() {
      return [
        ':filters',
        ':uploader',
        ':federation_publisher_modules',
        ':scrub_policy',
        ':ttl_setters',
        ':parsers',
        ':providers',
        ':method',
        ':policies',
        'Pleroma.Web.Auth.Authenticator'
      ].includes(this.setting.key) ||
        (this.settingGroup.key === 'Pleroma.Emails.Mailer' && this.setting.key === ':adapter')
    },
    settings() {
      return this.$store.state.settings.settings
    },
    textareaInput() {
      return this.settingGroup.key === ':welcome' && this.setting.key === ':message'
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    },
    isImageUrl() {
      return Array.isArray(this.setting.type) && this.setting.type.includes('image')
    }
  },
  methods: {
    editableKeyword(key, type) {
      return Array.isArray(type) && (
        (type.includes('map') && type.includes('string')) ||
        (type.includes('map') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1) ||
        (type.includes('keyword') && type.includes('integer')) ||
        (type.includes('keyword') && type.includes('string')) ||
        (type.includes('tuple') && type.includes('list')) ||
        (type.includes('keyword') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1)
      )
    },
    getFormattedDescription(desc) {
      return marked(desc)
    },
    processNestedData(value, group, parentKey, parents) {
      const { valueForState,
        valueForUpdatedSettings,
        setting } = processNested(value, value, group, parentKey, parents.reverse(), this.settings, this.updatedSettings)

      this.$store.dispatch('UpdateSettings',
        { group, key: parentKey, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
      this.$store.dispatch('UpdateState',
        { group, key: parentKey, input: setting.key, value: valueForState })
    },
    async removeSetting() {
      this.$confirm(
        this.$t('settings.removeSettingConfirmation'),
        {
          confirmButtonText: this.$t('users.ok'),
          cancelButtonText: this.$t('users.cancel'),
          type: 'warning'
        }).then(async() => {
        const config = this.settingGroup.key
          ? [{ group: this.settingGroup.group, key: this.settingGroup.key, delete: true, subkeys: [this.setting.key] }]
          : [{ group: this.settingGroup.group, key: this.setting.key, delete: true }]
        try {
          await this.$store.dispatch('RemoveSetting', config)
        } catch (e) {
          return
        }
        this.$message({
          type: 'success',
          message: i18n.t('settings.successfullyRemoved')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('users.canceled')
        })
      })
    },
    renderMultipleSelect(type) {
      return !this.reducedSelects && Array.isArray(type) && this.setting.key !== ':backends' && this.setting.key !== ':args' && (
        this.setting.key === ':ip_whitelist' ||
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (!type.includes('keyword') && type.includes('regex') && type.includes('string'))
      )
    },
    renderSingleSelect(type) {
      return !this.reducedSelects && (
        type === 'module' ||
        (Array.isArray(type) && type.includes('atom') && type.includes('dropdown'))
      )
    },
    senderInput({ key, type }) {
      return Array.isArray(type) && type.includes('string') && type.includes('tuple') && key === ':sender'
    },
    update(value, group, key, parents, input, type, nested) {
      const updatedValue = this.renderSingleSelect(type) ? getBooleanValue(value) : value
      nested
        ? this.processNestedData(updatedValue, group, key, parents)
        : this.updateSetting(updatedValue, group, key, input, type)
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
