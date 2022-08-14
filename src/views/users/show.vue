<template>
  <main v-if="!userProfileLoading">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container">
        <el-avatar v-if="propertyExists(user, 'avatar')" :src="user.avatar" size="large" />
        <h1 v-if="propertyExists(user, 'nickname')">{{ user.nickname }}</h1>
        <h1 v-else class="invalid">({{ $t('users.invalidNickname') }})</h1>
        <a v-if="propertyExists(user, 'url')" :href="user.url" target="_blank">
          <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
        </a>
      </div>
      <div class="left-header-container">
        <moderation-dropdown
          v-if="propertyExists(user, 'nickname')"
          :user="user"
          :page="'userPage'"
          @open-reset-token-dialog="openResetPasswordDialog"/>
        <reboot-button/>
      </div>
    </header>
    <div v-if="isMobile" class="user-page-header-container">
      <header class="user-page-header">
        <div class="avatar-name-container">
          <el-avatar v-if="propertyExists(user, 'avatar')" :src="user.avatar" size="large" />
          <h1 v-if="propertyExists(user, 'nickname')">{{ user.nickname }}</h1>
          <h1 v-else class="invalid">({{ $t('users.invalidNickname') }})</h1>
        </div>
        <reboot-button/>
      </header>
      <moderation-dropdown
        v-if="propertyExists(user, 'nickname')"
        :user="user"
        :page="'userPage'"
        @open-reset-token-dialog="openResetPasswordDialog"/>
    </div>
    <reset-password-dialog
      :reset-password-dialog-open="resetPasswordDialogOpen"
      @close-reset-token-dialog="closeResetPasswordDialog"/>
    <div class="user-profile-container">
      <div class="user-cards-container">
        <el-card class="user-profile-card">
          <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table--medium">
            <el-tag v-if="!propertyExists(user, 'nickname')" type="info" class="invalid-user-tag">
              {{ $t('users.invalidAccount') }}
            </el-tag>
            <table class="user-profile-table">
              <tbody>
                <tr class="el-table__row">
                  <td class="name-col">ID</td>
                  <td>
                    {{ user.id }}
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.actorType') }}</td>
                  <td>
                    <el-tag
                      :type="userCredentials.actor_type === 'Person' ? 'success' : 'warning'">
                      {{ userCredentials.actor_type }}
                    </el-tag>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.tags') }}</td>
                  <td>
                    <span v-if="user.tags.length === 0 || !propertyExists(user, 'tags')">—</span>
                    <el-tag v-for="tag in user.tags" v-else :key="tag" class="user-profile-tag">{{ humanizeTag(tag) }}</el-tag>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.roles') }}</td>
                  <td>
                    <el-tag v-if="user.roles.admin" class="user-profile-tag">
                      {{ $t('users.admin') }}
                    </el-tag>
                    <el-tag v-if="user.roles.moderator" class="user-profile-tag">
                      {{ $t('users.moderator') }}
                    </el-tag>
                    <span v-if="!propertyExists(user, 'roles') || (!user.roles.moderator && !user.roles.admin)">—</span>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.accountType') }}</td>
                  <td>
                    <el-tag v-if="user.local" type="info">{{ $t('userProfile.local') }}</el-tag>
                    <el-tag v-if="!user.local" type="info">{{ $t('userProfile.external') }}</el-tag>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.status') }}</td>
                  <td>
                    <el-tag v-if="!user.is_approved" type="info">{{ $t('userProfile.pending') }}</el-tag>
                    <el-tag v-if="user.is_active && user.is_approved" type="success">{{ $t('userProfile.active') }}</el-tag>
                    <el-tag v-if="!user.is_active" type="danger">{{ $t('userProfile.deactivated') }}</el-tag>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="user.registration_reason">
              <div class="reason-label">{{ $t('userProfile.reason') }}</div>
              "{{ user.registration_reason }}"
            </div>
          </div>
          <el-button v-if="propertyExists(user, 'nickname')" icon="el-icon-lock" class="security-setting-button" @click="securitySettingsModalVisible = true">
            {{ $t('userProfile.securitySettings.securitySettings') }}
          </el-button>
          <SecuritySettingsModal
            v-if="propertyExists(user, 'nickname')"
            :user="user"
            :visible="securitySettingsModalVisible"
            @close="securitySettingsModalVisible = false" />
        </el-card>
      </div>
      <div class="recent-statuses-container">
        <h2 class="recent-statuses">{{ $t('userProfile.recentStatuses') }}</h2>
        <el-checkbox v-model="showPrivate" class="show-private-statuses" @change="onTogglePrivate">
          {{ $t('statuses.showPrivateStatuses') }}
        </el-checkbox>
        <el-timeline v-if="!statusesLoading" class="statuses">
          <el-timeline-item v-for="status in statuses" :key="status.id">
            <status :status="status" :account="status.account" :show-checkbox="false" :user-id="user.id" :godmode="showPrivate"/>
          </el-timeline-item>
          <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
        </el-timeline>
      </div>
    </div>
  </main>
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from './components/ModerationDropdown'
import SecuritySettingsModal from './components/SecuritySettingsModal'
import RebootButton from '@/components/RebootButton'
import ResetPasswordDialog from './components/ResetPasswordDialog'

export default {
  name: 'UsersShow',
  components: { ModerationDropdown, RebootButton, ResetPasswordDialog, Status, SecuritySettingsModal },
  data() {
    return {
      showPrivate: false,
      resetPasswordDialogOpen: false,
      securitySettingsModalVisible: false
    }
  },
  computed: {
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
      return this.$store.state.users.loading
    },
    statuses() {
      return this.$store.state.userProfile.statuses
    },
    statusesLoading() {
      return this.$store.state.userProfile.statusesLoading
    },
    user() {
      return this.$store.state.userProfile.user
    },
    userProfileLoading() {
      return this.$store.state.userProfile.userProfileLoading
    },
    userCredentials() {
      return this.$store.state.userProfile.userCredentials
    }
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchUserProfile', { userId: this.$route.params.id, godmode: false })
  },
  methods: {
    closeResetPasswordDialog() {
      this.resetPasswordDialogOpen = false
      this.$store.dispatch('RemovePasswordToken')
    },
    humanizeTag(tag) {
      const mapTags = {
        'mrf_tag:media-force-nsfw': 'Force NSFW',
        'mrf_tag:media-strip': 'Strip Media',
        'mrf_tag:force-unlisted': 'Force Unlisted',
        'mrf_tag:sandbox': 'Sandbox',
        'mrf_tag:disable-remote-subscription': 'Disable remote subscription',
        'mrf_tag:disable-any-subscription': 'Disable any subscription'
      }
      return mapTags[tag]
    },
    onTogglePrivate() {
      this.$store.dispatch('FetchUserProfile', { userId: this.$route.params.id, godmode: this.showPrivate })
    },
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    },
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
header {
  align-items: center;
  display: flex;
  margin: 22px 0;
  padding-left: 15px;
  h1 {
    margin: 0 0 0 10px;
  }
}
table {
  margin: 10px 0 0 15px;
  .name-col {
    width: 150px;
  }
}
.avatar-name-container {
  display: flex;
  align-items: center;
  .el-icon-top-right {
    font-size: 2em;
    line-height: 36px;
    color: #606266;
  }
}
.invalid {
  color: gray;
}
.el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: transparent;
}
.image {
  width: 20%;
  img {
    width: 100%;
  }
}
.invalid-user-tag {
  font-size: 14px;
  width: inherit;
  height: auto;
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
}
.left-header-container {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.no-statuses {
  margin-left: 28px;
  color: #606266;
}
.password-reset-token {
  margin: 0 0 14px 0;
}
.password-reset-token-dialog {
  width: 50%
}
.poll ul {
  list-style-type: none;
  padding: 0;
  width: 30%;
}
.reboot-button {
  padding: 10px;
  margin-left: 10px;
}
.recent-statuses-container {
  display: flex;
  flex-direction: column;
  width: 67%;
}
.recent-statuses-header {
  margin-top: 10px;
}
.reset-password-link {
  text-decoration: underline;
}
.security-setting-button {
  margin-top: 20px;
  width: 100%;
}
.statuses {
  padding: 0 20px 0 0;
}
.show-private {
  width: 200px;
  text-align: left;
  line-height: 67px;
  margin-right: 20px;
}
.show-private-statuses {
  margin-left: 28px;
  margin-bottom: 20px;
}
.recent-statuses {
  margin-left: 28px;
}
.user-page-header {
  display: flex;
  justify-content: space-between;
  margin: 22px 15px 22px 20px;
  padding: 0;
  align-items: center;
  h1 {
    display: inline
  }
}
.user-cards-container {
  display: flex;
  flex-direction: column;
  width: 30%;
  min-width: 300px;
  margin: 0 20px;
}
.user-profile-card {
  height: fit-content;
  width: auto;
  margin-bottom: 20px;
}
.user-profile-container {
  display: flex;
}
.user-profile-table {
  margin: 0;
  width: inherit;
}
.user-profile-tag {
  margin: 0 4px 4px 0;
}
.reason-label {
  color: #878d99;
  font-weight: bold;
  margin: 5px 0;
}

@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
  .password-reset-token-dialog {
    width: 85%
  }
  .recent-statuses {
    margin: 20px 10px 15px 10px;
  }
  .recent-statuses-container {
    width: 100%;
    margin: 0;
  }
  .show-private-statuses {
    margin: 0 10px 20px 10px;
  }
  .status-container {
    margin: 0 10px;
  }
  .statuses {
    padding-right: 10px;
    margin-left: 8px;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 15px 10px;
  }
  .user-page-header-container {
    .el-dropdown {
      width: 95%;
      margin: 0 15px 15px 10px;
    }
  }
  .user-profile-card {
    margin: 0 10px 20px;
    width: 95%;
    td {
      width: 80px;
    }
  }
  .user-profile-container {
    flex-direction: column;
  }
  .user-cards-container {
    width: 100%;
    margin: 0;
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .recent-statuses {
    margin: 20px 10px 15px 0;
  }
  .recent-statuses-container {
    width: 97%;
    margin: 0 20px;
  }
  .show-private-statuses {
    margin: 0 10px 20px 0;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 20px 20px;
  }
  .user-profile-container {
    flex-direction: column;
  }
  .user-cards-container {
    width: 66%;
    padding-left: 28px;
  }
}
</style>
