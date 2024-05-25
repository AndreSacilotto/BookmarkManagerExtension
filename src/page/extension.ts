import browser from "webextension-polyfill";

export async function getBookmarksTree() {
	return await  browser.bookmarks.getTree();
}

export async function getBookmarksFlat(bookmarks:  browser.Bookmarks.BookmarkTreeNode[] | null) {
	const books = bookmarks ?? await getBookmarksTree();
	const arr : browser.Bookmarks.BookmarkTreeNode[] = [];

	// 0 root | 0,0 bookmarks bar | 0,1 all bookmarks
	[...books[0].children[0].children, ...books[0].children[1].children].forEach(deep);

	function deep(item : browser.Bookmarks.BookmarkTreeNode) {
		arr.push(item);
		item.children && item.children.forEach(deep)
	}

	return arr;
}

export function getFaviconUrl(url : string, size : number) {
	if (!url || url.length === 0 || size <= 0)
		return "";

	if (chrome.runtime)
	{
		const faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
		faviconUrl.searchParams.append('pageUrl', url);
		faviconUrl.searchParams.append('size', String(size));
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
