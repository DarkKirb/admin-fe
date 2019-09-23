export default {
  route: {
    dashboard: 'Dashboard',
    introduction: 'Introduction',
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    componentIndex: 'Introduction',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: 'Mixin',
    backToTop: 'BackToTop',
    dragDialog: 'Drag Dialog',
    dragSelect: 'Drag Select',
    dragKanban: 'Drag Kanban',
    charts: 'Charts',
    keyboardChart: 'Keyboard Chart',
    lineChart: 'Line Chart',
    mixChart: 'Mix Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    Table: 'Table',
    dynamicTable: 'Dynamic Table',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Complex Table',
    treeTable: 'Tree Table',
    customTreeTable: 'Custom TreeTable',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    users: 'Users',
    reports: 'Reports',
    settings: 'Settings',
    'emoji-packs': 'Emoji packs'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Log in',
    logInViaPleromaFE: 'Log in via PleromaFE',
    username: 'username@host',
    password: 'password',
    omitHostname: 'omit hostname if Pleroma is located on this domain',
    errorMessage: 'Username must contain username and host, e.g. john@pleroma.social',
    any: 'any',
    thirdparty: 'Or connect with',
    pleromaFELoginFailed: 'Failed to login via PleromaFE, please login with username/password',
    pleromaFELoginSucceed: 'Logged in via PleromaFE'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases it is not suitable to use v-permission, such as element Tab component or el-table-column and other asynchronous rendering dom cases which can only be achieved by manually setting the v-if.'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading pdf.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  users: {
    users: 'Users',
    localUsersOnly: 'Local users only',
    search: 'Search',
    id: 'ID',
    name: 'Name',
    status: 'Status',
    local: 'local',
    external: 'external',
    deactivated: 'deactivated',
    active: 'active',
    actions: 'Actions',
    activate: 'Activate',
    deactivate: 'Deactivate',
    admin: 'admin',
    moderator: 'moderator',
    moderation: 'Moderation',
    revokeAdmin: 'Revoke Admin',
    grantAdmin: 'Grant Admin',
    revokeModerator: 'Revoke Moderator',
    grantModerator: 'Grant Moderator',
    activateAccount: 'Activate Account',
    activateAccounts: 'Activate Accounts',
    deactivateAccount: 'Deactivate Account',
    deactivateAccounts: 'Deactivate Accounts',
    deleteAccount: 'Delete Account',
    deleteAccounts: 'Delete Accounts',
    forceNsfw: 'Force posts to be NSFW',
    stripMedia: 'Force posts not to have media',
    forceUnlisted: 'Force posts to be unlisted',
    sandbox: 'Force posts to be followers-only',
    disableRemoteSubscription: 'Disallow following user from remote instances',
    disableRemoteSubscriptionForMultiple: 'Disallow following users from remote instances',
    disableAnySubscription: 'Disallow following user at all',
    disableAnySubscriptionForMultiple: 'Disallow following users at all',
    selectUsers: 'Select users to apply actions to multiple users',
    moderateUsers: 'Moderate multiple users',
    createAccount: 'Create new account',
    apply: 'apply',
    remove: 'remove',
    grantRightConfirmation: 'Are you sure you want to grant {right} rights to all selected users?',
    revokeRightConfirmation: 'Are you sure you want to revoke {right} rights from all selected users?',
    activateMultipleUsersConfirmation: 'Are you sure you want to activate accounts of all selected users?',
    deactivateMultipleUsersConfirmation: 'Are you sure you want to deactivate accounts of all selected users?',
    deleteMultipleUsersConfirmation: 'Are you sure you want to delete accounts of all selected users?',
    addTagForMultipleUsersConfirmation: 'Are you sure you want to apply tag to all selected users?',
    removeTagFromMultipleUsersConfirmation: 'Are you sure you want to remove tag from all selected users?',
    ok: 'Okay',
    completed: 'Completed',
    cancel: 'Cancel',
    canceled: 'Canceled',
    username: 'Username',
    email: 'E-mail',
    password: 'Password',
    create: 'Create',
    submitFormError: 'There are invalid values in the form. Please fix them before continuing.',
    emptyEmailError: 'Please input the e-mail',
    invalidEmailError: 'Please input valid e-mail',
    emptyPasswordError: 'Please input the password',
    emptyNicknameError: 'Please input the username',
    invalidNicknameError: 'Username can include "a-z", "A-Z" and "0-9" characters',
    getPasswordResetToken: 'Get password reset token',
    passwordResetTokenCreated: 'Password reset token was created',
    accountCreated: 'New account was created!'
  },
  userProfile: {
    tags: 'Tags',
    moderator: 'Moderator',
    admin: 'Admin',
    local: 'Local',
    nickname: 'Nickname',
    deactivated: 'Deactivated',
    recentStatuses: 'Recent Statues',
    showPrivateStatuses: 'Show private statuses'
  },
  usersFilter: {
    inputPlaceholder: 'Select filter',
    byUserType: 'By user type',
    local: 'Local',
    external: 'External',
    byStatus: 'By status',
    active: 'Active',
    deactivated: 'Deactivated'
  },
  reports: {
    reports: 'Reports',
    reply: 'Reply',
    from: 'From',
    showNotes: 'Show notes',
    newNote: 'New note',
    submit: 'Submit',
    confirmMsg: 'Are you sure you want to delete this note?',
    delete: 'Delete',
    cancel: 'Cancel',
    deleteCompleted: 'Delete comleted',
    deleteCanceled: 'Delete canceled',
    noNotes: 'No notes to display',
    changeState: 'Change report state',
    changeScope: 'Change scope',
    moderateUser: 'Moderate user',
    resolve: 'Resolve',
    reopen: 'Reopen',
    close: 'Close',
    addSensitive: 'Add Sensitive flag',
    removeSensitive: 'Remove Sensitive flag',
    public: 'Make status public',
    private: 'Make status private',
    unlisted: 'Make status unlisted',
    sensitive: 'Sensitive',
    deleteStatus: 'Delete status'
  },
  reportsFilter: {
    inputPlaceholder: 'Select filter',
    open: 'Open',
    closed: 'Closed',
    resolved: 'Resolved'
  },
  settings: {
    settings: 'Settings',
    instance: 'Instance',
    upload: 'Upload',
    mailer: 'Mailer',
    logger: 'Logger',
    activityPub: 'ActivityPub',
    auth: 'Authentication',
    autoLinker: 'Auto Linker',
    captcha: 'Captcha',
    frontend: 'Frontend',
    http: 'HTTP',
    mrf: 'MRF',
    mediaProxy: 'Media Proxy',
    metadata: 'Metadata',
    gopher: 'Gopher',
    endpoint: 'Endpoint',
    jobQueue: 'Job queue',
    webPush: 'Web push encryption',
    esshd: 'BBS / SSH access',
    rateLimiters: 'Rate limiters',
    database: 'Database',
    other: 'Other',
    success: 'Settings changed successfully!'
  },
  invites: {
    inviteTokens: 'Invite tokens',
    createInviteToken: 'Generate invite token',
    pickDate: 'Pick a date',
    maxUse: 'Max use',
    expiresAt: 'Expires at',
    tokenCreated: 'Invite token was created',
    token: 'Token',
    uses: 'Uses',
    used: 'Used',
    cancel: 'Cancel',
    create: 'Create',
    revoke: 'Revoke',
    id: 'ID',
    actions: 'Actions',
    active: 'Active',
    inviteUserViaEmail: 'Invite user via email',
    sendRegistration: 'Send registration invite via email',
    email: 'Email',
    name: 'Name',
    emptyEmailError: 'Please input the e-mail',
    invalidEmailError: 'Please input valid e-mail',
    emailSent: 'Invite was sent',
    submitFormError: 'There are invalid values in the form. Please fix them before continuing.',
    inviteViaEmailAlert: 'To send invite via email make sure to enable `invites_enabled` and disable `registrations_open`'
  }
}
