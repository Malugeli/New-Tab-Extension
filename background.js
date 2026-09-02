"use strict";

importScripts("config.js");

const NEW_TAB_URLS = new Set([
  "chrome://newtab/",
  "chrome://new-tab-page/"
]);
const redirectedTabIds = new Set();

function getConfiguredTargetUrl() {
  const url = new URL(TARGET_URL);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("TARGET_URL must use http:// or https://");
  }

  return url.href;
}

const CONFIGURED_TARGET_URL = getConfiguredTargetUrl();

function navigateToTarget(tabId) {
  if (typeof tabId !== "number" || redirectedTabIds.has(tabId)) {
    return;
  }

  redirectedTabIds.add(tabId);
  chrome.tabs.update(tabId, { url: CONFIGURED_TARGET_URL }).catch(() => {
    redirectedTabIds.delete(tabId);
  });
}

chrome.tabs.onCreated.addListener((tab) => {
  const initialUrl = tab.pendingUrl ?? tab.url;
  const isUnclaimedActiveTab =
    !initialUrl && tab.active && typeof tab.openerTabId !== "number";

  if (NEW_TAB_URLS.has(initialUrl) || isUnclaimedActiveTab) {
    navigateToTarget(tab.id);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const currentUrl = changeInfo.url ?? tab.pendingUrl ?? tab.url;

  if (NEW_TAB_URLS.has(currentUrl)) {
    navigateToTarget(tabId);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  redirectedTabIds.delete(tabId);
});
