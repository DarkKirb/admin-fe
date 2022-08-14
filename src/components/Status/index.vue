<template>
  <el-card v-if="!status.deleted" class="status-card" @click.native="handleRouteChange()">
    <div slot="header">
      <div class="status-header">
        <div class="status-account-container">
          <div class="status-account">
            <el-checkbox v-if="showCheckbox" class="status-checkbox" @change="handleStatusSelection(account)"/>
            <router-link
              v-if="propertyExists(account, 'id')"
              :to="{ name: 'UsersShow', params: { id: account.id }}"
              class="router-link"
              @click.native.stop>
              <div class="status-card-header">
                <img v-if="propertyExists(account, 'avatar')" :src="account.avatar" class="status-avatar-img">
                <span v-if="propertyExists(account, 'nickname')" class="status-account-name">{{ account.nickname }}</span>
                <span v-else>
                  <span v-if="propertyExists(account, 'nickname')" class="status-account-name">
                    {{ account.nickname }}
                  </span>
                  <span v-else class="status-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
                </span>
              </div>
            </router-link>
          </div>
        </div>
        <div class="status-actions">
          <div class="status-tags">
            <el-tag v-if="status.sensitive" type="warning" size="large">{{ $t('reports.sensitive') }}</el-tag>
            <el-tag size="large">{{ capitalizeFirstLetter(status.visibility) }}</el-tag>
          </div>
          <el-dropdown trigger="click" @click.native.stop>
            <el-button plain size="small" icon="el-icon-edit" class="status-actions-button">
              {{ $t('reports.changeScope') }}<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="!status.sensitive"
                @click.native="changeStatus(status.id, true, status.visibility)">
                {{ $t('reports.addSensitive') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="status.sensitive"
                @click.native="changeStatus(status.id, false, status.visibility)">
                {{ $t('reports.removeSensitive') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="status.visibility !== 'public'"
                @click.native="changeStatus(status.id, status.sensitive, 'public')">
                {{ $t('reports.public') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="status.visibility !== 'private'"
                @click.native="changeStatus(status.id, status.sensitive, 'private')">
                {{ $t('reports.private') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="status.visibility !== 'unlisted'"
                @click.native="changeStatus(status.id, status.sensitive, 'unlisted')">
                {{ $t('reports.unlisted') }}
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="deleteStatus(status.id)">
                {{ $t('reports.deleteStatus') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="status-body">
      <div v-if="status.spoiler_text">
        <strong>{{ status.spoiler_text }}</strong>
        <el-button v-if="!showHiddenStatus" size="mini" class="show-more-button" @click="showHiddenStatus = true">Show more</el-button>
        <el-button v-if="showHiddenStatus" size="mini" class="show-more-button" @click="showHiddenStatus = false">Show less</el-button>
        <div v-if="showHiddenStatus">
          <span class="status-content" v-html="status.content"/>
          <div v-if="status.poll" class="poll">
            <ul>
              <li v-for="(option, index) in status.poll.options" :key="index">
                {{ option.title }}
                <el-progress :percentage="optionPercent(status.poll, option)" />
              </li>
            </ul>
          </div>
          <div v-for="(attachment, index) in status.media_attachments" :key="index" class="image">
            <img :src="attachment.preview_url">
          </div>
        </div>
      </div>
      <div v-if="!status.spoiler_text">
        <span class="status-content" v-html="status.content"/>
        <div v-if="status.poll" class="poll">
          <ul>
            <li v-for="(option, index) in status.poll.options" :key="index">
              {{ option.title }}
              <el-progress :percentage="optionPercent(status.poll, option)" />
            </li>
          </ul>
        </div>
        <div v-for="(attachment, index) in status.media_attachments" :key="index" class="image">
          <img :src="attachment.preview_url">
        </div>
      </div>
      <div class="status-footer">
        <span class="status-created-at">{{ parseTimestamp(status.created_at) }}</span>
        <a v-if="status.url" :href="status.url" target="_blank" class="account" @click.stop>
          {{ $t('statuses.openStatusInInstance') }}
          <i class="el-icon-top-right"/>
        </a>
      </div>
    </div>
  </el-card>
  <el-card v-else class="status-card">
    <div slot="header">
      <div class="status-header">
        <div class="status-account-container">
          <div class="status-account">
            <h4 class="status-deleted">{{ $t('reports.statusDeleted') }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="status-body">
      <span v-if="status.content" class="status-content" v-html="status.content"/>
      <span v-else class="status-without-content">no content</span>
    </div>
    <div class="status-footer">
      <span v-if="status.created_at" class="status-created-at">{{ parseTimestamp(status.created_at) }}</span>
      <a v-if="status.url" :href="status.url" target="_blank" class="account" @click.stop>
        Open status in instance
        <i class="el-icon-top-right"/>
      </a>
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Status',
  props: {
    account: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    fetchStatusesByInstance: {
      type: Boolean,
      required: false,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      required: true,
      default: false
    },
    status: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      required: false,
      default: 0
    },
    userId: {
      type: String,
      required: false,
      default: ''
    },
    godmode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showHiddenStatus: false
    }
  },
  methods: {
    capitalizeFirstLetter(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    changeStatus(statusId, isSensitive, visibility) {
      this.$store.dispatch('ChangeStatusScope', {
        statusId,
        isSensitive,
        visibility,
        reportCurrentPage: this.page,
        userId: this.userId,
        godmode: this.godmode,
        fetchStatusesByInstance: this.fetchStatusesByInstance
      })
    },
    deleteStatus(statusId) {
      this.$confirm('Are you sure you want to delete this status?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteStatus', {
          statusId,
          reportCurrentPage: this.page,
          userId: this.userId,
          godmode: this.godmode,
          fetchStatusesByInstance: this.fetchStatusesByInstance
        })
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    handleStatusSelection(account) {
      this.$emit('status-selection', account)
    },
    handleRouteChange() {
      this.$router.push({ name: 'StatusShow', params: { id: this.status.id }})
    },
    optionPercent(poll, pollOption) {
      const allVotes = poll.options.reduce((acc, option) => (acc + option.votes_count), 0)
      if (allVotes === 0) {
        return 0
      }
      return +(pollOption.votes_count / allVotes * 100).toFixed(1)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    propertyExists(account, property, _secondProperty) {
      if (_secondProperty) {
        return account[property] && account[_secondProperty]
      }
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.status-card {
  margin-bottom: 10px;
  cursor: pointer;
  .account {
    line-height: 26px;
    font-size: 13px;
    color: #606266;
  }
  .account:hover {
    text-decoration: underline;
  }
  .deactivated {
    color: gray;
    line-height: 28px;
    vertical-align: middle;
  }
  .image {
    width: 20%;
    img {
      width: 100%;
    }
  }
  .router-link {
    text-decoration: none;
  }
  .show-more-button {
    margin-left: 5px;
  }
  .status-account {
    display: flex;
    align-items: center;
  }
  .status-avatar-img {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .status-account-name {
    display: inline-block;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
  }
  .status-body {
    display: flex;
    flex-direction: column;
  }
  .status-card-header {
    display: flex;
    align-items: center;
  }
  .status-checkbox {
    margin-right: 7px;
  }
  .status-content {
    font-size: 15px;
    line-height: 26px;
  }
  .status-created-at {
    font-size: 13px;
    color: #606266;
  }
  .status-deleted {
    font-style: italic;
    margin-top: 3px;
  }
  .status-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status-tags {
    display: inline;
  }
  .status-without-content {
    font-style: italic;
  }
}

@media only screen and (max-width:480px) {
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .status-card {
    .el-card__header {
      padding: 10px 17px;
    }
    .el-tag {
      margin: 3px 0;
    }
    .status-account-container {
      margin-bottom: 5px;
    }
    .status-actions-button {
      margin: 3px 0 3px;
    }
    .status-actions {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .status-footer {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 10px;
    }
    .status-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
