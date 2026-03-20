import React from 'react'
import { Icon } from '../../chat/components'

const SETTING_GROUPS = [
  {
    label: 'Appearance',
    items: [
      { icon: 'dark_mode', title: 'Theme', description: 'Dark mode is active', badge: 'Dark', badgeGreen: true },
      { icon: 'text_fields', title: 'Font Size', description: 'Adjust interface text size', badge: 'Medium' },
    ],
  },
  {
    label: 'Privacy',
    items: [
      { icon: 'history', title: 'Save Chat History', description: 'Store conversations on our servers', badge: 'On', badgeGreen: true },
      { icon: 'data_usage', title: 'Usage Analytics', description: 'Help improve The Curator', badge: 'On', badgeGreen: true },
    ],
  },
  {
    label: 'AI Model',
    items: [
      { icon: 'psychology', title: 'Default Model', description: 'Model used for responses', badge: 'Curator-v4', badgeGreen: true },
      { icon: 'language', title: 'Response Language', description: 'Language for AI responses', badge: 'Auto-detect' },
    ],
  },
]

const SettingsPage = () => (
  <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
    <div className="max-w-2xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#9ffe9a] text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Preferences</p>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-[#adaaaa] text-sm mt-1">Customize how The Curator behaves for you.</p>
      </div>

      <div className="space-y-8">
        {SETTING_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#adaaaa] opacity-40 mb-3 px-1">
              {label}
            </p>
            <div className="bg-[#141414] border border-white/5 rounded-2xl divide-y divide-white/5">
              {items.map(({ icon, title, description, badge, badgeGreen }) => (
                <div key={title} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-[#262626] flex items-center justify-center flex-shrink-0">
                    <Icon name={icon} className="text-[#adaaaa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-[#adaaaa] mt-0.5">{description}</p>
                  </div>
                  {badge && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0 ${
                      badgeGreen
                        ? 'bg-[#9ffe9a]/10 text-[#9ffe9a] border border-[#9ffe9a]/20'
                        : 'bg-white/5 text-[#adaaaa] border border-white/10'
                    }`}>
                      {badge}
                    </span>
                  )}
                  <Icon name="chevron_right" className="text-[#adaaaa]/40 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Version banner */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#141414] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9ffe9a]/10 flex items-center justify-center">
              <Icon name="auto_awesome" fill className="text-[#9ffe9a]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">The Curator</p>
              <p className="text-xs text-[#adaaaa]">Version 1.0.0 — Curator-v4</p>
            </div>
          </div>
          <span className="text-xs bg-[#9ffe9a]/10 text-[#9ffe9a] border border-[#9ffe9a]/20 px-2.5 py-1 rounded-lg font-medium">
            Up to date
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default SettingsPage
