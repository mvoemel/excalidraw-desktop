import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { saveNoteAtom, selectedNoteAtom } from '@renderer/store'
import {
  AUTO_SAVE_INTERVAL,
  EXCALIDRAW_STANDARD_CONTENT_APPSTATE,
  EXCALIDRAW_STANDARD_CONTENT_SOURCE,
  EXCALIDRAW_STANDARD_CONTENT_TYPE,
  EXCALIDRAW_STANDARD_CONTENT_VERSION
} from '@shared/constants'
import { NoteContent } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash'
import { useState } from 'react'

export const useExcalidrawEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI>()

  /**
   * Automatically save the note content every AUTO_SAVE_INTERVAL amount of milliseconds or when the editor loses focus.
   */
  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNote) return

      const dataToBeSaved: NoteContent = {
        type: EXCALIDRAW_STANDARD_CONTENT_TYPE,
        version: EXCALIDRAW_STANDARD_CONTENT_VERSION,
        source: EXCALIDRAW_STANDARD_CONTENT_SOURCE,
        appState: EXCALIDRAW_STANDARD_CONTENT_APPSTATE,
        elements: content.elements,
        files: content.files
      }

      await saveNote(dataToBeSaved)
    },
    AUTO_SAVE_INTERVAL,
    {
      leading: false, // initial auto save not triggered
      trailing: true // last auto save always triggered
    }
  )

  /**
   * This function is called everytime the excalidraw editor loses focus.
   */
  const handleBlur = async () => {
    if (!selectedNote) return

    handleAutoSaving.cancel()

    const elements = excalidrawApi?.getSceneElements() || []
    const files = excalidrawApi?.getFiles() || {}

    const dataToBeSaved: NoteContent = {
      type: EXCALIDRAW_STANDARD_CONTENT_TYPE,
      version: EXCALIDRAW_STANDARD_CONTENT_VERSION,
      source: EXCALIDRAW_STANDARD_CONTENT_SOURCE,
      appState: EXCALIDRAW_STANDARD_CONTENT_APPSTATE,
      elements,
      files
    }

    if (elements != null && files != null) {
      await saveNote(dataToBeSaved)
    }
  }

  return {
    setExcalidrawApi,
    selectedNote,
    handleAutoSaving,
    handleBlur
  }
}
