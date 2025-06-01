'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { fetchUsers } from '../../lib/features/users/usersSlice'
import { fetchCategories } from '../../lib/features/categories/categoriesSlice'
import { fetchProducts } from '../../lib/features/products/productsSlice'
import { Users, FolderOpen, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const dispatch = useDispatch()
    const { users } = useSelector((state) => state.users)
    const { categories } = useSelector((state) => state.categories)
    const { products } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchCategories())
        dispatch(fetchProducts())
    }, [dispatch])

    const stats = [
        {
            name: 'Toplam Kullanıcı',
            value: users.length,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            name: 'Toplam Kategori',
            value: categories.length,
            icon: FolderOpen,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            name: 'Toplam Ürün',
            value: products.length,
            icon: Package,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            name: 'Aktif Ürünler',
            value: products.filter(product => product.is_active).length,
            icon: TrendingUp,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Balkan Backerei yönetim paneline hoş geldiniz
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                        >
                            <dt>
                                <div className={`absolute ${stat.bgColor} rounded-md p-3`}>
                                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                                    {stat.name}
                                </p>
                            </dt>
                            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </dd>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Son Kullanıcılar
                            </h3>
                            <div className="space-y-3">
                                {users.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <Users className="h-4 w-4 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.role}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {users.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Henüz kullanıcı bulunmuyor
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Categories */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Son Kategoriler
                            </h3>
                            <div className="space-y-3">
                                {categories.slice(0, 5).map((category) => (
                                    <div key={category.id} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <FolderOpen className="h-4 w-4 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {category.title}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {category.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Henüz kategori bulunmuyor
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Hızlı İşlemler
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/dashboard/users"
                                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                            >
                                <div>
                                    <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                                        <Users className="h-6 w-6" />
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium">
                                        <span className="absolute inset-0" />
                                        Kullanıcı Yönetimi
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Kullanıcıları görüntüle, ekle, düzenle ve sil
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/categories"
                                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                            >
                                <div>
                                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                                        <FolderOpen className="h-6 w-6" />
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium">
                                        <span className="absolute inset-0" />
                                        Kategori Yönetimi
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Kategorileri görüntüle, ekle, düzenle ve sil
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/products"
                                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                            >
                                <div>
                                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                                        <Package className="h-6 w-6" />
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium">
                                        <span className="absolute inset-0" />
                                        Ürün Yönetimi
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Ürünleri görüntüle, ekle, düzenle ve sil
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
