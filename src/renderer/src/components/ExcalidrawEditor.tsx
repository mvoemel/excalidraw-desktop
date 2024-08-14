import { Excalidraw } from '@excalidraw/excalidraw'
import { useExcalidrawEditor } from '@renderer/hooks/useExcalidrawEditor'

export const ExcalidrawEditor = () => {
  const { setExcalidrawApi, selectedNote, handleAutoSaving, handleBlur } = useExcalidrawEditor()

  if (!selectedNote) return null

  // BUG: handleBlur does not work as expected, because the onChange event is also triggered when the editor loses focus.
  return (
    <div className="h-full" onBlur={handleBlur}>
      <Excalidraw
        key={selectedNote.title}
        excalidrawAPI={(api) => setExcalidrawApi(api)}
        initialData={selectedNote.content}
        onChange={(elements, appState, files) =>
          handleAutoSaving({
            elements,
            files
          })
        }
      />
    </div>
  )
}
