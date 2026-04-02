import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, FileText, User,
  LogOut, BookOpen, X, Layers,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard",  icon: LayoutDashboard, text: "Dashboard"  },
    { to: "/documents",  icon: FileText,         text: "Documents"  },
    { to: "/flashcards", icon: BookOpen,          text: "Flashcards" },
    { to: "/profile",    icon: User,              text: "Profile"    },
  ];

  return (
    <>
      {/* ✅ Overlay — z-40 sits above header (z-30) but below sidebar (z-50) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ✅ Sidebar — z-50 sits above everything including header */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64
        bg-white border-r border-slate-200/60
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/60 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Layers className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight truncate">
              LearnPro AI
            </span>
          </div>

          {/* X button — mobile only */}
          <button
            onClick={toggleSidebar}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 flex-shrink-0 ml-2"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
          {navLinks.map(({ to, icon: Icon, text }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => { if (isSidebarOpen) toggleSidebar(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-200/50"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="truncate">{text}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-200/60 flex-shrink-0 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut
              size={18}
              strokeWidth={2}
              className="flex-shrink-0 text-slate-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200"
            />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;