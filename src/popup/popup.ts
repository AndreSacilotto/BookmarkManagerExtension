import browser from "webextension-polyfill";

browser.tabs.create({ url: browser.runtime.getURL("src/page/index.html") })