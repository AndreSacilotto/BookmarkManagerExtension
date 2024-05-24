
//#region DOM
/** @type {HTMLDivElement} */
const search_bar = document.getElementById("search-bar");
/** @type {HTMLTextAreaElement} */
const search_bar_area = document.getElementById("search-bar-area");
/** @type {HTMLDivElement} */
const container = document.getElementById("container");
/** @type {HTMLDivElement} */
const sidebar = document.getElementById("sidebar");

/** @type {HTMLDivElement} */
const splitter = document.getElementById("splitter");
splitter.ondrag = splitter.ondragend = (ev) => {
	sidebar.style.width = ev.pageX + "px";
}
splitter.ondragstart = (ev) => {
	ev.dataTransfer.effectAllowed = "none";
}

const searchChange = (ev) => searchText(ev.target.value);
search_bar_area.addEventListener("keyup", searchChange);
search_bar_area.addEventListener("change", searchChange);

//#endregion

//#region Vars

/** @type {NodeBookmarkSearchItem[]} */
var bookmarksNodes;

// #endregion

//#region Entry Point

async function _main() {
	const c = await getBookmarksFlat();
	bookmarksNodes = buildBookmarks(c);
	// console.log(bookmarksNodes);
}
_main();

function Update() {
	_main();
}

// #endregion

//#region Functions

/** @type {HTMLDivElement} */
var itemContainer;
function newItemContainer() {
	if (itemContainer)
		container.removeChild(itemContainer);
	itemContainer = document.createElement("div");
	itemContainer.className = "items-container";
	container.appendChild(itemContainer);
}

/** @type {string} */
var lastText;
/** @param {string} str */
function searchText(str) {
	if (!str || str.length == 0)
		return;
	str = str.toLowerCase();
	if (lastText === str)
		return;
	lastText = str;

	newItemContainer();

	bookmarksNodes.forEach(x => {
		const r = x.ref;
		if (r.title.includes(str) || (r.url && r.url.includes(str)))
			itemContainer.appendChild(x.item);
	});
	
	requestAnimationFrame(() => {});
}

class BookmarkItem {
	/** @param {chrome.bookmarks.BookmarkTreeNode} item */
	constructor(item) {
		/** @type {boolean} */
		this.isFolder = item.url === undefined || Object.hasOwn(item, "children");
		/** @type {string} */
		this.id = item.id;
		/** @type {string|undefined} */
		this.parentId = item.parentId;
		/** @type {number|undefined} */
		this.index = item.index;
		/** @type {string} */
		this.title = item.title;
		/** @type {string|undefined} */
		this.url = item.url;
		this.resetIcon();
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
		this.item.className = "bookmark-item";
		// this.item.target = "_blank";
		// this.item.rel = "noopener noreferrer";
		this.item.addEventListener("click", () => this.select());
		this.item.addEventListener("dblclick", () => this.openUrl());

		this.icon = this.item.appendChild(document.createElement("img"));
		this.icon.className = "bookmark-item-icon";
		this.icon.alt = "bookmark-icon"

		this.title = this.item.appendChild(document.createElement("div"));
		this.title.className = "bookmark-item-title";

		this.link = this.item.appendChild(document.createElement("div"));
		this.link.className = "bookmark-item-link";

		this.edit = this.item.appendChild(document.createElement("div"));
		this.edit.className = "bookmark-item-edit";

		this.selected = false;
	}
	/** @param {BookmarkItem} item */
	fill(item) {
		this.ref = item;
		this.icon.src = item.iconURL;
		this.title.innerHTML = item.title;
		if (item.url)
		{
			this.link.innerHTML = item.url;
			this.item.href = item.url;
		}
		this.item.classList.add(item.isFolder ? "folder" : "not-folder");
	}
	select(){
		this.selected = !this.selected;
		if(this.selected)
			this.item.classList.add("selected");
		else
			this.item.classList.remove("selected");
		console.log(this.selected);
	}
	openUrl(){
		const url = this.ref.url;
		if(!url)
			return;
		chrome.tabs.create({ url })
	}
}

/** @param {chrome.bookmarks.BookmarkTreeNode[]} buffer  */
function buildBookmarks(buffer) {
	return buffer.map(el => {
		const item = new BookmarkItem(el);
		// item.setIcon();
		const node = new NodeBookmarkSearchItem();
		node.fill(item);
		return node;
	});
}

// #endregion

//#region Chrome

async function getBookmarksTree() {
	return await chrome.bookmarks.getTree();
}

/** @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarks */
async function getBookmarksFlat(bookmarks) {
	const books = bookmarks ?? await chrome.bookmarks.getTree();
	/** @type {chrome.bookmarks.BookmarkTreeNode[]} */
	const arr = [];

	// 0 root | 0,0 bookmarks bar | 0,1 all bookmarks
	[...books[0].children[0].children, ...books[0].children[1].children].forEach(x => deep(arr, x));

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