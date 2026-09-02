# Configurable New Tab Redirect

A minimal Chrome extension that immediately opens a configured URL whenever a
new tab is created. The initial URL is:

<https://github.com/Malugeli/Notes>

## Configure

Open `config.js` and change the URL:

```js
const TARGET_URL = "https://example.com";
```

Then open `chrome://extensions` and select the extension's **Reload** button.

The URL is part of the extension code, so the redirect can use it immediately:
there is no storage lookup, packaged redirect page, or Chrome new-tab override.
The extension uses `tabs` only to recognize and navigate new blank tabs. It does
not request access to website contents and does not change Chrome's **On
startup** setting.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.
