import React, { useState, useEffect } from "react"
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import authService from '../../services/authService'
import {useAuth} from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { User, Mail, Lock } from 'lucide-react'


const ProfilePage = () => {

  const [loading, setLoading] = useState(true)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile()
        setUsername(data.username)
        setEmail(data.email)
      } catch (error) {
        toast.error("Failed to fetch profile data")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChangePassword = async(e) => {
    e.preventDefault();
    if(newPassword !== confirmNewPassword){
      toast.error("New password do not match")
      return;
    }

    if(newPassword.length < 6){
      toast.error("New password must be atleast 6 characters long")
      return;
    }
    setPasswordLoading(true)
    try {
      await authService.changePassword({currentPassword, newPassword })
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (error) {
      toast.error(error.message || "Failed to change password.")
    } finally {
      setPasswordLoading(false)
    }
  }

  if(loading) {
    return <Spinner />
  }


return (
  <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
    <PageHeader title="Profile Settings" />

    {/* User Information Card */}
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-5">
        User Information
      </h3>
      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <p className="w-full h-10 pl-9 pr-3 flex items-center border border-slate-200 rounded-lg text-sm text-slate-700 bg-white">
              {username}
            </p>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <p className="w-full h-10 pl-9 pr-3 flex items-center border border-slate-200 rounded-lg text-sm text-slate-700 bg-white">
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Change Password Card */}
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-5">
        Change Password
      </h3>

      <form onSubmit={handleChangePassword} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-150"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-150"
            />
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-150"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={passwordLoading}
            className="group relative inline-flex items-center gap-2 px-5 h-11 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all duration-200 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">
              {passwordLoading ? "Changing..." : "Change Password"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </form>
    </div>
  </div>
)
}

export default ProfilePage