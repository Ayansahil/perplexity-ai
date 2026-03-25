import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../../chat/components'

// Toast banner
const Toast = ({ toast }) => {
  if (!toast) return null
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      toast.success
        ? 'bg-[#9ffe9a]/10 border border-[#9ffe9a]/30 text-[#9ffe9a]'
        : 'bg-red-500/10 border border-red-500/30 text-red-400'
    }`}>
      <Icon name={toast.success ? 'check_circle' : 'error'} className="text-base flex-shrink-0" />
      {toast.message}
    </div>
  )
}

// Section card wrapper
const Card = ({ title, description, children }) => (
  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && <p className="text-[#adaaaa] text-sm mt-1">{description}</p>}
    </div>
    {children}
  </div>
)

// Input field
const Field = ({ label, id, type = 'text', value, onChange, placeholder, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-[#adaaaa] uppercase tracking-wider mb-2">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full bg-[#1a1919] border border-white/8 focus:border-[#9ffe9a]/50 rounded-xl px-4 py-3 text-white placeholder-[#adaaaa]/40 outline-none transition-colors text-sm"
    />
  </div>
)

// AccountPage — /account
const AccountPage = () => {
  const { user } = useSelector((state) => state.auth)
  const { handleUpdateProfile, handleChangePassword } = useAuth()

  // Profile form
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileToast, setProfileToast] = useState(null)

  // Password form
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwToast, setPwToast] = useState(null)

  const showToast = (setter, result) => {
    setter(result)
    setTimeout(() => setter(null), 4000)
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!username.trim() && !email.trim()) return
    setProfileLoading(true)
    const result = await handleUpdateProfile({ username: username.trim(), email: email.trim() })
    setProfileLoading(false)
    showToast(setProfileToast, result)
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (newPw !== confirmPw) {
      showToast(setPwToast, { success: false, message: 'Passwords do not match' })
      return
    }
    if (newPw.length < 6) {
      showToast(setPwToast, { success: false, message: 'New password must be at least 6 characters' })
      return
    }
    setPwLoading(true)
    const result = await handleChangePassword({ currentPassword: currentPw, newPassword: newPw })
    setPwLoading(false)
    showToast(setPwToast, result)
    if (result.success) {
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    }
  }

  // Avatar initials
  const initials = (user?.username ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="max-w-2xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[#9ffe9a] text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Profile</p>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-[#adaaaa] text-sm mt-1">Manage your identity and security preferences.</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9ffe9a]/30 to-[#006319]/40 border border-[#9ffe9a]/20 flex items-center justify-center">
            <span className="text-2xl font-black text-[#9ffe9a]">{initials}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user?.username}</p>
            <p className="text-[#adaaaa] text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${user?.verified ? 'bg-[#9ffe9a]' : 'bg-yellow-400'}`} />
              <span className="text-xs text-[#adaaaa]">{user?.verified ? 'Email verified' : 'Email not verified'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile card */}
          <Card title="Profile Information" description="Update your username and email address.">
            <form onSubmit={handleProfileSave} className="space-y-5">
              <Field
                label="Username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                autoComplete="username"
              />
              <Field
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {profileToast && (
                <Toast toast={profileToast} />
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-[#9ffe9a] text-[#006319] text-sm font-bold rounded-xl hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {profileLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-[#006319]/30 border-t-[#006319] rounded-full animate-spin" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </Card>

          {/* Password card */}
          <Card title="Change Password" description="Use a strong password you don't use elsewhere.">
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <Field
                label="Current Password"
                id="current-pw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Field
                label="New Password"
                id="new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              <Field
                label="Confirm New Password"
                id="confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />

              {/* Password strength indicator */}
              {newPw && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          newPw.length >= level * 3
                            ? level <= 1 ? 'bg-red-500'
                              : level === 2 ? 'bg-yellow-500'
                              : level === 3 ? 'bg-blue-500'
                              : 'bg-[#9ffe9a]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#adaaaa]">
                    {newPw.length < 6 ? 'Too short' : newPw.length < 9 ? 'Fair' : newPw.length < 12 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}

              {pwToast && <Toast toast={pwToast} />}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                  className="px-6 py-2.5 bg-[#9ffe9a] text-[#006319] text-sm font-bold rounded-xl hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {pwLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-[#006319]/30 border-t-[#006319] rounded-full animate-spin" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </Card>

          {/* Danger zone */}
          <Card title="Danger Zone" description="Irreversible actions for your account.">
            <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/15 bg-red-500/5">
              <div>
                <p className="text-sm font-semibold text-white">Delete Account</p>
                <p className="text-xs text-[#adaaaa] mt-0.5">Permanently delete your account and all data.</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 border border-red-500/40 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
