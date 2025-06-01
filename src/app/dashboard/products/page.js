'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError
} from '../../../lib/features/products/productsSlice'
import { fetchCategories } from '../../../lib/features/categories/categoriesSlice'
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
    name: yup.string().required('Ürün adı gereklidir'),
    description: yup.string(),
    price: yup.number().positive('Fiyat pozitif olmalıdır').required('Fiyat gereklidir'),
    category_id: yup.number().required('Kategori seçimi gereklidir'),
    stock: yup.number().min(0, 'Stok negatif olamaz').required('Stok miktarı gereklidir'),
    is_active: yup.boolean(),
})

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const dispatch = useDispatch()
    const { products, isLoading, error } = useSelector((state) => state.products)
    const { categories } = useSelector((state) => state.categories)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            category_id: '',
            stock: '',
            is_active: true,
        },
    })

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError())
            }, 5000)
        }
    }, [error, dispatch])

    const filteredProducts = products.filter(product => {
        const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        const matchesCategory = categoryFilter === '' || product.category_id?.toString() === categoryFilter
        const matchesStatus = statusFilter === '' ||
            (statusFilter === 'active' && product.is_active) ||
            (statusFilter === 'inactive' && !product.is_active)

        return matchesSearch && matchesCategory && matchesStatus
    })

    const openModal = (product = null) => {
        setEditingProduct(product)
        setIsModalOpen(true)

        if (product) {
            setValue('name', product.name || '')
            setValue('description', product.description || '')
            setValue('price', product.price || '')
            setValue('category_id', product.category_id || '')
            setValue('stock', product.stock || '')
            setValue('is_active', product.is_active)
        } else {
            reset({
                name: '',
                description: '',
                price: '',
                category_id: '',
                stock: '',
                is_active: true,
            })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingProduct(null)
        reset()
        dispatch(clearError())
    }

    const onSubmit = async (data) => {
        try {
            const productData = {
                ...data,
                price: parseFloat(data.price),
                category_id: parseInt(data.category_id),
                stock: parseInt(data.stock),
            }

            if (editingProduct) {
                await dispatch(updateProduct({ id: editingProduct.id, productData })).unwrap()
            } else {
                await dispatch(createProduct(productData)).unwrap()
            }
            closeModal()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await dispatch(deleteProduct(id)).unwrap()
            } catch (error) {
                console.error('Delete error:', error)
            }
        }
    }

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category ? category.title : 'Kategori bulunamadı'
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Ürünleri yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Yeni Ürün</span>
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
                                placeholder="Ürün ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Tüm Kategoriler</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                        <div className="flex items-center text-sm text-gray-500">
                            <Filter className="h-4 w-4 mr-1" />
                            {filteredProducts.length} ürün bulundu
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Ürün bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.description && product.description.length > 50
                                                        ? `${product.description.substring(0, 50)}...`
                                                        : product.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getCategoryName(product.category_id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.price ? `₺${product.price.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.stock > 0
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.stock || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.is_active ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openModal(product)}
                                                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
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
                        <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
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
                                        Ürün Adı
                                    </label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ürün adı"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ürün açıklaması"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fiyat (₺)
                                        </label>
                                        <input
                                            {...register('price')}
                                            type="number"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Stok
                                        </label>
                                        <input
                                            {...register('stock')}
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="0"
                                        />
                                        {errors.stock && (
                                            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        {...register('category_id')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Kategori seçin</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Aktif ürün
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
                                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Kaydet')}
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
