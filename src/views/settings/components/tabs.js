export const tabs = description => {
  return {
    'activity-pub': {
      label: 'settings.activityPub',
      settings: [':activitypub', ':user']
    },
    'authentication': {
      label: 'settings.auth',
      settings: [':auth', ':ldap', ':oauth2', 'Pleroma.Web.Auth.Authenticator']
    },
    'captcha': {
      label: 'settings.captcha',
      settings: ['Pleroma.Captcha', 'Pleroma.Captcha.Kocaptcha']
    },
    'emoji': {
      label: 'settings.emoji',
      settings: [':emoji']
    },
    'frontend': {
      label: 'settings.frontend',
      settings: [':assets', ':frontends', ':emoji', ':frontend_configurations', ':markup', ':static_fe', 'Pleroma.Web.Preload']
    },
    'http': {
      label: 'settings.http',
      settings: [':cors_plug', ':http', ':http_security', ':web_cache_ttl']
    },
    'instance': {
      label: 'settings.instance',
      settings: [':admin_token', ':instance', ':instance_panel', ':instances_favicons', ':welcome', ':manifest', 'Pleroma.User', 'Pleroma.ScheduledActivity', ':uri_schemes', ':feed', ':streamer', ':restrict_unauthenticated', ':translator', ':deepl', ':libre_translate']
    },
    'job-queue': {
      label: 'settings.jobQueue',
      settings: ['Pleroma.Workers.PurgeExpiredActivity', ':connections_pool', ':hackney_pools', 'Oban', ':pools', ':workers']
    },
    'link-formatter': {
      label: 'settings.linkFormatter',
      settings: ['Pleroma.Formatter']
    },
    'logger': {
      label: 'settings.logger',
      settings: [':console', ':ex_syslogger', ':quack', ':logger']
    },
    'mailer': {
      label: 'settings.mailer',
      settings: [':email_notifications', 'Pleroma.Emails.Mailer', 'Pleroma.Emails.UserEmail', ':swoosh', 'Pleroma.Emails.NewUsersDigestEmail']
    },
    'media-proxy': {
      label: 'settings.mediaProxy',
      settings: [':media_proxy', ':media_preview_proxy', 'Pleroma.Web.MediaProxy.Invalidation.Http', 'Pleroma.Web.MediaProxy.Invalidation.Script']
    },
    'metadata': {
      label: 'settings.metadata',
      settings: ['Pleroma.Web.Metadata', ':rich_media']
    },
    'mrf': {
      label: 'settings.mrf',
      settings: description.filter(el => el.tab === 'mrf').map(setting => setting.key)
    },
    'rate-limiters': {
      label: 'settings.rateLimiters',
      settings: [':rate_limit']
    },
    'web-push': {
      label: 'settings.webPush',
      settings: [':vapid_details']
    },
    'upload': {
      label: 'settings.upload',
      settings: ['Pleroma.Upload.Filter.AnonymizeFilename', 'Pleroma.Upload.Filter.Mogrify', 'Pleroma.Uploaders.S3', 'Pleroma.Uploaders.Local', 'Pleroma.Upload', ':s3']
    },
    'search': {
      label: 'settings.search',
      settings: ['Pleroma.Search', 'Pleroma.Search.Meilisearch', 'Pleroma.Search.Elasticsearch.Cluster']
    },
    'other': {
      label: 'settings.other',
      settings: [':mime', 'Pleroma.User.Backup', 'Pleroma.Web.Plugs.RemoteIp', 'Pleroma.Web.Endpoint.MetricsExporter', ':modules', 'Pleroma.Web.ApiSpec.CastAndValidate', ':terms_of_services']
    }
  }
}
