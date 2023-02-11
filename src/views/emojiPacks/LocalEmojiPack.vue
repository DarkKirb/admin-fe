<template>
  <el-collapse-item :title="name" :name="name" class="has-background">
    <el-form :label-width="labelWidth" label-position="left" size="small" class="emoji-pack-metadata">
      <el-form-item :label=" $t('emoji.sharePack')">
        <el-switch v-model="share" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.homepage')">
        <el-input v-model="homepage" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.description')">
        <el-input v-model="description" type="textarea" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.license')">
        <el-input v-model="license" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.fallbackSrc')">
        <el-input v-model="fallbackSrc" />
      </el-form-item>
      <el-form-item
        v-if="fallbackSrc && fallbackSrc.trim() !== ''"
        :label=" $t('emoji.fallbackSrcSha')">
        {{ pack.pack["fallback-src-sha256"] }}
      </el-form-item>
    </el-form>
    <div class="pack-button-container">
      <div class="save-pack-button-container">
        <el-button type="primary" class="save-pack-button" @click="savePackMetadata">{{ $t('emoji.saveMetadata') }}</el-button>
        <el-button class="delete-pack-button" @click="deletePack">{{ $t('emoji.deletePack') }}</el-button>
      </div>
      <div class="download-pack-button-container">
        <el-link
          v-if="pack.pack['can-download']"
          :href="`//${host}//api/v1/pleroma/emoji/packs/archive?name=${name}`"
          :underline="false"
          type="primary"
          target="_blank">
          <el-button class="download-archive">{{ $t('emoji.downloadPackArchive') }}</el-button>
        </el-link>
      </div>
    </div>
    <el-collapse v-model="showPackContent" class="contents-collapse" @change="handleChange($event, name)">
      <el-collapse-item v-if="isLocal" :title=" $t('emoji.addNewEmoji')" name="addEmoji" class="no-background">
        <new-emoji-uploader :pack-name="name"/>
      </el-collapse-item>
      <el-collapse-item :title=" $t('emoji.manageEmoji')" name="manageEmoji" class="no-background">
        <div v-if="pack.files && Object.keys(pack.files).length > 0">
          <div :class="isMobile ? 'emoji-container-flex' : 'emoji-container-grid'">
            <span class="emoji-preview-img emoji-table-head">{{ $t('emoji.image') }}</span>
            <span class="emoji-table-head">{{ $t('emoji.shortcode') }}</span>
            <span class="emoji-table-head">{{ $t('emoji.file') }}</span>
          </div>
          <single-emoji-editor
            v-for="(file, shortcode) in pack.files"
            :key="shortcode"
            :host="host"
            :pack-name="name"
            :shortcode="shortcode"
            :file="file"
            :is-local="isLocal" />
        </div>
        <span v-else class="expl">{{ $t('emoji.emptyPack') }}</span>
        <div class="files-pagination">
          <el-pagination
            :total="localPackFilesCount"
            :current-page="currentFilesPage"
            :page-size="pageSize"
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="handleFilesPageChange"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-collapse-item>
</template>

<script>
import SingleEmojiEditor from './SingleEmojiEditor.vue'
import NewEmojiUploader from './NewEmojiUploader.vue'

export default {
  components: { SingleEmojiEditor, NewEmojiUploader },
  props: {
    name: {
      type: String,
      required: true
    },
    pack: {
      type: Object,
      required: true
    },
    host: {
      type: String,
      required: true
    },
    isLocal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showPackContent: []
    }
  },
  computed: {
    currentFilesPage() {
      return this.$store.state.emojiPacks.currentLocalFilesPage
    },
    currentLocalPacksPage() {
      return this.$store.state.emojiPacks.currentLocalPacksPage
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '90px'
      } else if (this.isTablet) {
        return '155px'
      } else {
        return '155px'
      }
    },
    localPackFilesCount() {
      return this.$store.state.emojiPacks.localPackFilesCount
    },
    pageSize() {
      return this.$store.state.emojiPacks.filesPageSize
    },
    share: {
      get() { return this.pack.pack['share-files'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'share-files', value }
        )
      }
    },
    homepage: {
      get() { return this.pack.pack['homepage'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'homepage', value }
        )
      }
    },
    description: {
      get() { return this.pack.pack['description'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'description', value }
        )
      }
    },
    license: {
      get() { return this.pack.pack['license'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'license', value }
        )
      }
    },
    fallbackSrc: {
      get() { return this.pack.pack['fallback-src'] },
      set(value) {
        if (value.trim() !== '') {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value }
          )
        } else {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value: null }
          )
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src-sha256', value: null }
          )
        }
      }
    }
  },
  methods: {
    collapse() {
      this.showPackContent = []
    },
    deletePack() {
      this.$confirm('This will delete the pack, are you sure?', 'Warning', {
        confirmButtonText: 'Yes, delete the pack',
        cancelButtonText: 'No, leave it be',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeletePack', { name: this.name })
          .then(() => this.$store.dispatch('ReloadEmoji'))
          .then(() => {
            const { [this.name]: value, ...updatedPacks } = this.$store.state.emojiPacks.localPacks
            if (Object.keys(updatedPacks).length === 0 && this.currentLocalPacksPage > 1) {
              this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage - 1)
            } else {
              this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
            }
          })
      }).catch(() => {})
    },
    handleChange(openTabs, name) {
      if (openTabs.includes('manageEmoji')) {
        this.$store.dispatch('FetchLocalSinglePack', { name, page: 1 })
      }
    },
    handleFilesPageChange(page) {
      this.$store.dispatch('FetchLocalSinglePack', { name: this.name, page })
    },
    savePackMetadata() {
      this.$store.dispatch('SavePackMetadata', { packName: this.name })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.download-archive {
  width: 250px
}
.download-pack-button-container {
  width: 265px;
  .el-link {
    width: inherit;
    span {
      width: inherit;
      .download-archive {
        width: inherit;
      }
    }
  }
}
.download-shared-pack {
  display: flex;
  margin-bottom: 10px;
}
.download-shared-pack-button {
  margin-left: 10px;
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-collapse-item__header {
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.emoji-table-head {
  color: #909399;
  font-size: 14px;
  font-weight: 700;
}
.emoji-pack-card {
  margin-top: 5px;
}
.emoji-pack-metadata {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.files-pagination {
  margin: 25px 0;
  text-align: center;
}
.has-background .el-collapse-item__header {
  background: #f6f6f6;
}
.no-background .el-collapse-item__header {
  background: white;
}
.pack-button-container {
  margin: 0 0 18px 120px;
}
.save-pack-button-container {
  margin-bottom: 8px;
  width: 265px;
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width:480px) {
  .delete-pack-button {
    width: 45%;
  }
  .download-pack-button-container {
    width: 100%;
  }
  .download-shared-pack {
    flex-direction: column;
  }
  .download-shared-pack-button {
    margin-left: 0;
    margin-top: 10px;
    padding: 10px;
  }
  .pack-button-container {
    width: 100%;
    margin: 0 0 22px 0;
  }
  .remote-pack-metadata {
    .el-form-item__content {
      line-height: 24px;
      margin-top: 4px;
    }
  }
  .save-pack-button {
    width: 54%;
  }
  .save-pack-button-container {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    button {
      padding: 10px 5px;
    }
    .el-button+.el-button {
      margin-left: 3px;
    }
  }
}
</style>
