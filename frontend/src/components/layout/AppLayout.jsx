// AppLayout.jsx — keep {children}, just fix the responsive classes
import React, { useState } from 'react';
import Sidebar from "./Sidebar"
import Header from './Header'

const AppLayout = ({ children }) => {  // ✅ keep {children} — correct for your setup

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden'>

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ min-w-0 prevents content from pushing sidebar on mobile */}
      <div className='flex-1 flex flex-col min-w-0 w-full overflow-hidden'>
        <Header toggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {children}  {/* ✅ correct — renders <Outlet /> passed from ProtectedRoute */}
        </main>
      </div>

    </div>
  )
}

export default AppLayout