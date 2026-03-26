import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

// Icon — Material Symbols wrapper
export const Icon = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined select-none ${className}`}
    style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24` }}
  >
    {name}
  </span>
)

// LoadingDots — animated thinking indicator
export const LoadingDots = () => (
  <div className="flex gap-6 mb-8">
    <div className="w-10 h-10 rounded-full bg-[#9ffe9a]/10 flex-shrink-0 flex items-center justify-center border border-[#9ffe9a]/20">
      <Icon name="bolt" fill className="text-[#9ffe9a] text-xl" />
    </div>
    <div className="flex items-center gap-2 pt-3">
      <span className="text-[#9ffe9a]/60 text-sm font-medium animate-pulse">Thinking</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#9ffe9a]/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
)

// MessageBubble — user + AI messages
export const MessageBubble = ({ id, role, content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleSave = () => {
    if (editContent.trim() && editContent.trim() !== content) {
      onEdit(id, editContent.trim())
    }
    setIsEditing(false)
  }

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-8">
        <div className="bg-[#262626] px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] text-white shadow-lg group relative">
          {!isEditing ? (
            <>
              <p className="leading-relaxed">{content}</p>
              {onEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[#adaaaa] hover:text-[#9ffe9a] transition-all p-2 rounded-lg hover:bg-white/5"
                >
                  <Icon name="edit" className="text-sm" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3 min-w-[300px]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-[#1a1919] text-white p-3 rounded-xl outline-none resize-none text-sm border border-[#9ffe9a]/30 focus:border-[#9ffe9a] transition-colors"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setIsEditing(false); setEditContent(content) }}
                  className="text-xs text-[#adaaaa] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs bg-[#9ffe9a] text-[#006319] font-bold px-4 py-1.5 rounded-lg hover:shadow-[0_0_10px_rgba(160,255,155,0.3)] transition-all"
                >
                  Save & Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-5 mb-8">
      <div className="w-9 h-9 rounded-full bg-[#9ffe9a]/10 flex-shrink-0 flex items-center justify-center border border-[#9ffe9a]/20 mt-1">
        <Icon name="bolt" fill className="text-[#9ffe9a]" />
      </div>
      <div className="flex-1 text-[#e0e0e0] leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-[#e0e0e0]">{children}</li>,
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="font-semibold text-white mb-1">{children}</h3>,
            code: ({ children, inline }) =>
              inline
                ? <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-[#9ffe9a] font-mono">{children}</code>
                : <code className="block">{children}</code>,
            pre: ({ children }) => <pre className="mb-3 overflow-x-auto rounded-xl bg-black/40 p-4 border border-white/5">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-[#9ffe9a]/40 pl-4 text-[#adaaaa] italic mb-3">{children}</blockquote>,
            table: ({ children }) => <div className="overflow-x-auto my-3"><table className="w-full border-collapse text-sm">{children}</table></div>,
            thead: ({ children }) => <thead>{children}</thead>,
            th: ({ children }) => <th className="border border-white/20 bg-white/10 px-4 py-2 text-left font-semibold text-[#9ffe9a]">{children}</th>,
            td: ({ children }) => <td className="border border-white/10 px-4 py-2 text-white/80">{children}</td>,
            tr: ({ children }) => <tr className="even:bg-white/[0.03]">{children}</tr>,

          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// ChatInput — shared search bar with Pro Search toggle
export const ChatInput = ({ value, onChange, onSubmit, disabled = false, placeholder = 'Ask anything...' }) => {
  const [proSearch, setProSearch] = useState(false)

  return (
    <div className="absolute bottom-0 left-0 w-full px-8 pb-8 pt-4 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <form onSubmit={onSubmit}>
          <div className="relative group">
            {/* Glow layer */}
            <div className="absolute inset-0 bg-[#9ffe9a]/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative bg-[#1a1919] rounded-2xl p-2 border border-white/5 group-focus-within:border-[#9ffe9a]/40 transition-all duration-300 shadow-2xl">
              <textarea
                value={value}
                onChange={onChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!disabled) onSubmit(e)
                  }
                }}
                rows={2}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-[#adaaaa]/40 resize-none min-h-[56px] py-3 px-4 outline-none text-[15px] leading-relaxed disabled:opacity-60"
              />

              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <div className="flex items-center gap-1">
                  {['attachment', 'image', 'mic'].map((ic) => (
                    <button key={ic} type="button" className="p-2 text-[#adaaaa] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                      <Icon name={ic} />
                    </button>
                  ))}
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  {/* Pro Search Toggle */}
                  <button
                    type="button"
                    onClick={() => setProSearch((p) => !p)}
                    className={`px-3 py-1.5 flex items-center gap-2 rounded-xl text-xs font-medium transition-all duration-200 border ${proSearch
                        ? 'bg-[#9ffe9a]/15 text-[#9ffe9a] border-[#9ffe9a]/40 shadow-[0_0_12px_rgba(159,254,154,0.15)]'
                        : 'bg-[#262626] text-[#adaaaa] hover:text-white border-white/5 hover:border-white/10'
                      }`}
                  >
                    <Icon name={proSearch ? 'stars' : 'public'} fill={proSearch} className="text-sm" />
                    <span className="hidden min-[412px]:inline">Pro Search</span>
                    {proSearch && (
                      <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[#9ffe9a] animate-pulse" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!value.trim() || disabled}
                  className="w-10 h-10 bg-[#9ffe9a] text-[#006319] rounded-xl flex items-center justify-center hover:shadow-[0_0_15px_rgba(160,255,155,0.35)] active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {disabled
                    ? <span className="w-3 h-3 rounded-sm bg-[#006319]" />
                    : <Icon name="arrow_upward" className="font-bold" />
                  }
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-3 flex justify-center gap-6 text-[10px] text-[#adaaaa] font-bold uppercase tracking-[0.2em] opacity-25">
          <span>Precision Mode Active</span>
          <span>Sources Synchronized</span>
          <span>Curator-v4</span>
        </div>
      </div>
    </div>
  )
}
