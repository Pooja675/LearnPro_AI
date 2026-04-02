import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, User, Menu } from 'lucide-react'

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Spacer — pushes right section to the end */}
        <div className="hidden md:block" />

        {/* Right section — bell + profile */}
        <div className="flex items-center gap-3">

          {/* Bell */}
          <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 group transition-all duration-200">
            <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="w-px h-8" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-1 border-l border-slate-200/60">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <User size={18} strokeWidth={2.5} className="text-white" />
              </div>
              {/* Name + email */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header