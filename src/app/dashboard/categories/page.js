'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
} from '../../../lib/features/categories/categoriesSlice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    Filter
} from 'lucide-react'

const schema = yup.object({
    title: yup.string().required('Kategori adı gereklidir'),
    is_active: yup.boolean(),
})

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const dispatch = useDispatch()
    const { categories, isLoading, error } = useSelector((state) => state.categories)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            is_active: true,
        },
    })

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError())
            }, 5000)
        }
    }, [error, dispatch])

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        const matchesStatus = statusFilter === '' ||
            (statusFilter === 'active' && category.is_active) ||
            (statusFilter === 'inactive' && !category.is_active)

        return matchesSearch && matchesStatus
    })

    const openModal = (category = null) => {
        setEditingCategory(category)
        setIsModalOpen(true)

        if (category) {
            setValue('title', category.title)
            setValue('is_active', category.is_active)
        } else {
            reset({
                title: '',
                is_active: true,
            })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingCategory(null)
        reset()
        dispatch(clearError())
    }

    const onSubmit = async (data) => {
        try {
            if (editingCategory) {
                await dispatch(updateCategory({ id: editingCategory.id, categoryData: data })).unwrap()
            } else {
                await dispatch(createCategory(data)).unwrap()
            }
            closeModal()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            try {
                await dispatch(deleteCategory(id)).unwrap()
            } catch (error) {
                console.error('Delete error:', error)
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Ürün kategorilerini yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Yeni Kategori</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kategori ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                        <div className="flex items-center text-sm text-gray-500">
                            <Filter className="h-4 w-4 mr-1" />
                            {filteredCategories.length} kategori bulundu
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori Adı
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
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            Kategori bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {category.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {category.is_active ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.created_at ? new Date(category.created_at).toLocaleDateString('tr-TR') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openModal(category)}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
                                    {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
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
                                        Kategori Adı
                                    </label>
                                    <input
                                        {...register('title')}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Kategori adı"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Aktif kategori
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
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Kaydet')}
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
