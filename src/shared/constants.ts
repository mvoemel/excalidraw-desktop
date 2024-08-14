export const APP_DIRECTORY_NAME = 'ExcalidrawDesktop'
export const FILE_ENCODING = 'utf8'

export const AUTO_SAVE_INTERVAL = 3000 // milliseconds

export const WELCOME_NOTE_FILENAME = 'Welcome.excalidraw'

export const EXCALIDRAW_STANDARD_CONTENT_TYPE = 'excalidraw'
export const EXCALIDRAW_STANDARD_CONTENT_VERSION = 2
export const EXCALIDRAW_STANDARD_CONTENT_SOURCE = 'https://excalidraw.com'
export const EXCALIDRAW_STANDARD_CONTENT_APPSTATE = {
  gridSize: null,
  viewBackgroundColor: '#ffffff'
}
export const EXCALIDRAW_STANDARD_CONTENT = {
  type: EXCALIDRAW_STANDARD_CONTENT_TYPE,
  version: EXCALIDRAW_STANDARD_CONTENT_VERSION,
  source: EXCALIDRAW_STANDARD_CONTENT_SOURCE,
  elements: [],
  appState: EXCALIDRAW_STANDARD_CONTENT_APPSTATE,
  files: {}
}
