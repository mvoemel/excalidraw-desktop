import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types'

export type NoteInfo = {
  title: string
  lastUpdatedAt: number
}

export type NoteContent = {
  type?: 'excalidraw'
  version?: number
  source?: string
  appState?: Partial<AppState>
  elements: readonly ExcalidrawElement[]
  files: BinaryFiles
}
