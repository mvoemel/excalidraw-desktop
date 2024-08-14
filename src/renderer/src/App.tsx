import {
  ActionButtonsRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  NotePreviewList,
  RootLayout,
  Sidebar
} from '@/components'
import { useRef } from 'react'
import { ExcalidrawEditor } from './components/ExcalidrawEditor'

const App = () => {
  // TODO: maybe delete resetScroll on mount
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  // BUG: scroll is activated when FloatingNoteTitle is displayed, but should not be scrollable
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>

        <Content ref={contentContainerRef} className="border-l bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className="pt-2" />
          <ExcalidrawEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
