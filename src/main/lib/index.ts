import {
  APP_DIRECTORY_NAME,
  EXCALIDRAW_STANDARD_CONTENT,
  FILE_ENCODING,
  WELCOME_NOTE_FILENAME
} from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'

/**
 * Gets the root directory path.
 *
 * @returns root directory path as a string
 */
export const getRootDir = () => {
  return `${homedir()}/${APP_DIRECTORY_NAME}`
}

/**
 * Gets an array of NoteInfo objects from the notes directory.
 *
 * @returns a promise of NoteInfo[]
 */
export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.excalidraw'))

  if (isEmpty(notes)) {
    // create the welcome note
    await writeFile(
      `${rootDir}/${WELCOME_NOTE_FILENAME}`,
      JSON.stringify(EXCALIDRAW_STANDARD_CONTENT),
      {
        encoding: FILE_ENCODING
      }
    )

    notes.push(WELCOME_NOTE_FILENAME)
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

/**
 * Gets the NoteInfo object from a given filename.
 *
 * @param filename of the note
 * @returns a NoteInfo object
 */
export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.excalidraw$/, ''),
    lastUpdatedAt: fileStats.mtimeMs
  }
}

/**
 * Reads a note from the filesystem.
 *
 * @param filename
 * @returns a NoteCotent object
 */
export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  const stringFile = await readFile(`${rootDir}/${filename}.excalidraw`, {
    encoding: FILE_ENCODING
  })

  const parsedContent = JSON.parse(stringFile)

  return parsedContent
}

/**
 * Writes a particular note to the filesystem.
 *
 * @param filename name of the file without the extension
 * @param content a NoteContent object to update the file
 */
export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  const stringContent = JSON.stringify(content)
  return writeFile(`${rootDir}/${filename}.excalidraw`, stringContent, { encoding: FILE_ENCODING })
}

/**
 * Creates a new note. Shows a dialog to create a new note.
 *
 * @returns filename if everything is fine, otherwise false
 */
export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}/Untitled.excalidraw`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Excalidraw', extensions: ['excalidraw'] }]
  })

  if (canceled || !filePath) {
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${rootDir}.
      Avoid using other directories!`
    })

    return false
  }

  const stringContent = JSON.stringify(EXCALIDRAW_STANDARD_CONTENT)
  await writeFile(filePath, stringContent)

  return filename
}

/**
 * Deletes a note from the filesystem.
 *
 * @param filename of the note to delete
 * @returns true if the note was deleted, false otherwise
 */
export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Delete', 'Cancel'], // 0 is Delete, 1 is Cancel
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    return false
  }

  await remove(`${rootDir}/${filename}.excalidraw`)
  return true
}
