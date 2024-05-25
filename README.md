# BookmarkManagerExtension
A custom Bookmark Manager Extension, reason chrome default is slow and don't have the features I want

## TODO (features only)

#### Bookmark Search
- [X] Search Bookmark
- [] Custom Search Syntax
	- [] Start/End with
	- [] Regex support
	- [] Casing support
- [] Add Filters
	- [] Bookmark/Folders Only
	- [] Search from Title/Link/Both

#### Bookmark Manager
- [] Open Folder
- [] Multiple Selection
- [] Add Bookmark/Folder
- [] Edit/Delete Bookmarks
- [] Move Bookmarks
- [] Enable Drag & Drop

#### Config
- [] Whitelist of folders
- [] Blacklist of folders
- [] Custom themes

## Commands

#### Development, HMR
Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.
```sh
npm run dev
```
> HMR requires Chromium version >= 110.0.5480.0.

#### Development, Watch
Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)
```sh
npm run watch
```

#### Production
Minifies and optimizes extension build
```sh
npm run build
```

### Load extension in browser
Loads the contents of the dist/ directory into the specified browser
```sh
npm run serve:chrome
```
```sh
npm run serve:firefox
```
