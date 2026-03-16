'use client'

import { useState, KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  isStreaming: boolean
}

export default function InputBar({ onSend, isStreaming }: Props) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Message ChatWave... (Enter to send, Shift+Enter for new line)"
          disabled={isStreaming}
          className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     disabled:opacity-50 disabled:bg-gray-50 max-h-40 overflow-y-auto"
          style={{ minHeight: '48px' }}
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white
                     rounded-xl px-5 py-3 text-sm font-medium transition-colors
                     flex items-center gap-1 flex-shrink-0"
        >
          {isStreaming ? (
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          ) : (
            <>Send ➤</>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        ChatWave
      </p>
    </div>
  )
}
