
//#region GLOBAL

/** @type {HTMLDivElement} */
const search_bar = document.getElementById("search-bar");
/** @type {HTMLTextAreaElement} */
const search_bar_text = document.getElementById("search-bar-search");
/** @type {HTMLDivElement} */
const container = document.getElementById("container");

/** @type {NodeBookmarkSearchItem} */
const poll = {}

/** @type {BookmarkItem} */
const _flatBookmarks = [];

// #endregion

//#region Entry Point

async function _main() {
	const b = await getBookmarksTree()
	console.log(b);
	const c = await getBookmarksFlat();
	console.log(c);
}
_main();

function Update() {
	_main();
}

// #endregion

//#region Functions


class BookmarkItem {
	/** @param {chrome.bookmarks.BookmarkTreeNode} item */
	constructor(item) {
		this.isFolder = Object.hasOwn(item, "children");

		this.id = item.id;
		this.parentId = item.parentId;
		this.index = item.index;

		this.title = item.title;
		this.url = item.url;
		resetIcon();
	}
	resetIcon() {
		this.iconURL = this.isFolder ? "/public/icon_folder.svg" : "/public/icon_missing.png";
	}
	setIcon(iconPath) {
		this.iconURL = getFaviconUrl(iconPath, 16);
	}
}

class NodeBookmarkSearchItem {
	constructor() {
		/** @type {BookmarkItem|null} */
		this.ref = null;

		this.item = document.createElement("div");
		item.className = "bookmark-item";

		this.icon = this.item.appendChild(document.createElement("img"));
		icon.className = "bookmark-item-icon";

		this.title = this.item.appendChild(document.createElement("div"));
		title.className = "bookmark-item-title";

		this.link = this.item.appendChild(document.createElement("div"));
		link.className = "bookmark-item-link";

		this.edit = this.item.appendChild(document.createElement("div"));
		edit.className = "bookmark-item-edit";
	}
	/** @param {BookmarkItem} item */
	fill(item) {
		this.ref = item;
		this.icon.src = item.iconURL;
		this.link.innerHTML = item.url;
		this.title.innerHTML = item.title;
	}
}

async function getBookmarksTree() {
	return await chrome.bookmarks.getTree();
}

/** @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarks */
async function getBookmarksFlat(bookmarks) {
	const books = bookmarks ?? await chrome.bookmarks.getTree();
	/** @type {chrome.bookmarks.BookmarkTreeNode[]} */
	const arr = [];

	deep(arr, books[0]);

	/** @param {chrome.bookmarks.BookmarkTreeNode} item */
	function deep(buffer, item) {
		arr.push(item);
		const c = item.children;
		if (c)
			for (let i = 0; i < c.length; i++)
				deep(buffer, c[i]);
	}

	return arr;
}


/** @param {string} url @param {Number} size */
function getFaviconUrl(url, size) {
	if (!url || url.length === 0 || size <= 0)
		return "";

	if (chrome.runtime)
	{
		const faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
		faviconUrl.searchParams.append('pageUrl', url);
		faviconUrl.searchParams.append('size', size);
		return faviconUrl.href;
	}
	else
	{
		const faviconUrl = new URL(`https://www.google.com/s2/favicons?sz=${size}&domain_url=${url}`);
		// faviconUrl.searchParams.append('sz', size);
		// faviconUrl.searchParams.append('domain_url', url);
		return faviconUrl.href;
	}
}

// #endregion

//#region Util

// #endregion