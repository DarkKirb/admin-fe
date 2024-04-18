# Pleroma AdminFE

![screenshot](./public/index.png)

## About

Admin UI for pleroma instance owners.

### Branches

There are two main branches here:

- `develop`: ongoing work and all merge requests go here, *unstable*
- `master`: after `develop` is stabilized it is merged to `master`, `master` is *stable*, allegedly

### Features

1. User administration: grant roles to users (admin/moderator), deactivate/delete as well as force their statuses to have NSFW tag, strip media and many more
1. Invites management: generate invite tokens & send invites via email
1. Moderation log: track moderator/admin actions
1. Settings: configure your pleroma instance via friendly (hopefully) UI
1. Emoji packs: configure your emoji packs

You can have any combination of these features (i.e. you can disable anything, but user administration, see "Disabling features" section below).

## Usage

### Bundled

AdminFE is bundled with Pleroma, i.e. you can just visit `https://your.instance/pleroma/admin/` to try it out.

### Development

To run AdminFE locally execute

```
# install dependencies
npm install -g yarn
yarn

# run AdminFE locally
NODE_OPTIONS=--openssl-legacy-provider yarn dev
```

### Build

To compile everything for production run

```
# install dependencies
npm install -g yarn
yarn

# compile everything for production
NODE_OPTIONS=--openssl-legacy-provider yarn build:prod
```

This will build admin-fe into `dist` folder, which you will need to upload to your server and/or point your webserver of choice to.

#### Disabling features

You can disable certain AdminFE features, like reports or settings by modifying `config/prod.env.js` env variable `DISABLED_FEATURES`, e.g. if you want to compile AdminFE without "Settings" you'll need to set it to: `DISABLED_FEATURES: '["settings"]'`.

Features, that can be disabled:

- reports: `DISABLED_FEATURES: '["reports"]'`
- invites: `DISABLED_FEATURES: '["invites"]'`
- moderation log: `DISABLED_FEATURES: '["moderationLog"]'`
- settings: `DISABLED_FEATURES: '["settings"]'`
- emoji packs: `DISABLED_FEATURES: '["emojiPacks"]'`

Of course, you can disable multiple features just by adding to the array, e.g. `DISABLED_FEATURES: '["emojiPacks", "settings"]'` will have both emoji packs and settings disabled.

Users administration cannot be disabled.

## Changelog

Detailed changes for each release are documented in the [CHANGELOG](./CHANGELOG.md).

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

Pleroma AdminFE is build on top of the [Vue Element Admin](https://github.com/PanJiaChen/vue-element-admin), which is licensed under [MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) license.

AdminFE's own code is licensed under [AGPL](./AGPL-3)
