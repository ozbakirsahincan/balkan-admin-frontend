'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu,
    X,
    Home,
    Users,
    FolderOpen,
    Package,
    LogOut,
    User
} from 'lucide-react'
import { logoutUser } from '../../lib/features/auth/authSlice'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Kullanıcılar', href: '/dashboard/users', icon: Users },
    { name: 'Kategoriler', href: '/dashboard/categories', icon: FolderOpen },
    { name: 'Ürünler', href: '/dashboard/products', icon: Package },
]

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const { user, isAuthenticated } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    const handleLogout = () => {
        dispatch(logoutUser())
        router.push('/login')
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <SidebarContent navigation={navigation} pathname={pathname} user={user} onLogout={handleLogout} />
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <SidebarContent navigation={navigation} pathname={pathname} user={user} onLogout={handleLogout} />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top bar */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-lg font-semibold text-gray-900">
                                Balkan Backerei Admin
                            </h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-700">{user?.username}</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function SidebarContent({ navigation, pathname, user, onLogout }) {
    return (
        <div className="flex flex-col h-full bg-indigo-700">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-900">
                <h1 className="text-white text-lg font-bold">Balkan Backerei</h1>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-indigo-800 text-white'
                                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* User info and logout */}
                <div className="flex-shrink-0 p-4 border-t border-indigo-800">
                    <button
                        onClick={onLogout}
                        className="group flex items-center w-full px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </div>
    )
}
