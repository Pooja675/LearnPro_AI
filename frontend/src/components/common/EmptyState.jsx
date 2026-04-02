import React from 'react'
import { FileText, Plus } from 'lucide-react'

const EmptyState = ({onActionClick, title, description, buttonText}) => {
 return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 border border-slate-200 mb-4">
            <FileText className='w-8 h-8 text-slate-400' strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
        {buttonText && onActionClick && (
            <button
                onClick={onActionClick}
                className="group relative inline-flex items-center gap-2 px-6 h-11 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 mt-6"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <Plus className='w-4 h-4' strokeWidth={2.5} />
                    {buttonText}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
            </button>
        )}
    </div>
)
}

export default EmptyState