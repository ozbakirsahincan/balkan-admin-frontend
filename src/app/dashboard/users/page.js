'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError
} from '../../../lib/features/users/usersSlice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Plus,
    Edit,
    Trash2,
    X,
    Eye,
    EyeOff,
    Search,
    Filter
} from 'lucide-react'

const schema = yup.object({
    username: yup.string().required('Kullanıcı adı gereklidir'),
    password: yup.string().when('isEdit', {
        is: false,
        then: (schema) => schema.required('Şifre gereklidir').min(6, 'Şifre en az 6 karakter olmalıdır'),
        otherwise: (schema) => schema.min(6, 'Şifre en az 6 karakter olmalıdır')
    }),
    role: yup.string().required('Rol seçimi gereklidir'),
    is_active: yup.boolean(),
})

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const dispatch = useDispatch()
    const { users, isLoading, error } = useSelector((state) => state.users)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: '',
            role: 'clerk',
            is_active: true,
        },
    })

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError())
            }, 5000)
        }
    }, [error, dispatch])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        const matchesRole = roleFilter === '' || user.role === roleFilter
        const matchesStatus = statusFilter === '' ||
            (statusFilter === 'active' && user.is_active) ||
            (statusFilter === 'inactive' && !user.is_active)

        return matchesSearch && matchesRole && matchesStatus
    })

    const openModal = (user = null) => {
        setEditingUser(user)
        setIsModalOpen(true)
        setShowPassword(false)

        if (user) {
            setValue('username', user.username)
            setValue('role', user.role)
            setValue('is_active', user.is_active)
            setValue('password', '')
        } else {
            reset({
                username: '',
                password: '',
                role: 'clerk',
                is_active: true,
            })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingUser(null)
        reset()
        dispatch(clearError())
    }

    const onSubmit = async (data) => {
        try {
            if (editingUser) {
                const updateData = { ...data }
                if (!updateData.password) {
                    delete updateData.password
                }
                await dispatch(updateUser({ id: editingUser.id, userData: updateData })).unwrap()
            } else {
                await dispatch(createUser(data)).unwrap()
            }
            closeModal()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                await dispatch(deleteUser(id)).unwrap()
            } catch (error) {
                console.error('Delete error:', error)
            }
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800'
            case 'supervisor':
                return 'bg-yellow-100 text-yellow-800'
            case 'clerk':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin'
            case 'supervisor':
                return 'Süpervizör'
            case 'clerk':
                return 'Personel'
            default:
                return role
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Sistem kullanıcılarını yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Yeni Kullanıcı</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kullanıcı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Tüm Roller</option>
                            <option value="admin">Admin</option>
                            <option value="supervisor">Süpervizör</option>
                            <option value="clerk">Personel</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                        <div className="flex items-center text-sm text-gray-500">
                            <Filter className="h-4 w-4 mr-1" />
                            {filteredUsers.length} kullanıcı bulundu
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Oluşturulma
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            Kullanıcı bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.username}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {user.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleDisplayName(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.is_active ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openModal(user)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kullanıcı Adı
                                    </label>
                                    <input
                                        {...register('username')}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Kullanıcı adı"
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Şifre {editingUser && '(Boş bırakılırsa değiştirilmez)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Şifre"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <select
                                        {...register('role')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="clerk">Personel</option>
                                        <option value="supervisor">Süpervizör</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Aktif kullanıcı
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Kaydediliyor...' : (editingUser ? 'Güncelle' : 'Kaydet')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
