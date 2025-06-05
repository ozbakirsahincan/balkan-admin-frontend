'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

// export default function ImageUpload({ value, onChange, error }) {
//     const [isDragOver, setIsDragOver] = useState(false)
//     const [preview, setPreview] = useState('')
//     const [selectedFile, setSelectedFile] = useState(null)
//     const fileInputRef = useRef(null)

//     // Initialize preview from existing value (for edit mode)
//     useEffect(() => {
//         if (value && typeof value === 'string' && value.startsWith('/uploads/')) {
//             // If value is a URL path, show it as preview
//             setPreview(`http://localhost:4000${value}`)
//         } else if (value && typeof value === 'string' && value.startsWith('http')) {
//             // If value is already a full URL
//             setPreview(value)
//         }
//     }, [value])

//     const handleFileSelect = (file) => {
//         if (file && file.type.startsWith('image/')) {
//             // Create preview URL
//             const reader = new FileReader()
//             reader.onload = (e) => {
//                 setPreview(e.target.result)
//             }
//             reader.readAsDataURL(file)

//             // Store the file object
//             setSelectedFile(file)
//             onChange(file) // Pass the file object to parent
//         }
//     }

//     const handleDrop = (e) => {
//         e.preventDefault()
//         setIsDragOver(false)

//         const files = Array.from(e.dataTransfer.files)
//         if (files.length > 0) {
//             handleFileSelect(files[0])
//         }
//     }

//     const handleDragOver = (e) => {
//         e.preventDefault()
//         setIsDragOver(true)
//     }

//     const handleDragLeave = (e) => {
//         e.preventDefault()
//         setIsDragOver(false)
//     }

//     const handleFileInputChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             handleFileSelect(file)
//         }
//     }

//     const handleRemoveImage = () => {
//         setPreview('')
//         setSelectedFile(null)
//         onChange(null)
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }
//     }

//     const handleClick = () => {
//         fileInputRef.current?.click()
//     }

//     return (
//         <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//                 Ürün Resmi
//             </label>

//             {preview ? (
//                 <div className="relative">
//                     <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
//                         <Image
//                             src={preview}
//                             alt="Ürün önizleme"
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                                 console.error('Image load error:', e)
//                                 // If image fails to load, show placeholder
//                                 e.target.style.display = 'none'
//                             }}
//                         />
//                         <button
//                             type="button"
//                             onClick={handleRemoveImage}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                         >
//                             <X className="h-4 w-4" />
//                         </button>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handleClick}
//                         className="mt-2 w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
//                     >
//                         Resmi Değiştir
//                     </button>
//                 </div>
//             ) : (
//                 <div
//                     onClick={handleClick}
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     className={`
//                         relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
//                         ${isDragOver
//                             ? 'border-purple-500 bg-purple-50'
//                             : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
//                         }
//                         ${error ? 'border-red-300' : ''}
//                     `}
//                 >
//                     <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                         <div className={`
//                             p-3 rounded-full mb-3 transition-colors
//                             ${isDragOver ? 'bg-purple-100' : 'bg-gray-100'}
//                         `}>
//                             {isDragOver ? (
//                                 <Upload className="h-8 w-8 text-purple-500" />
//                             ) : (
//                                 <ImageIcon className="h-8 w-8 text-gray-400" />
//                             )}
//                         </div>
//                         <p className="text-sm font-medium mb-1">
//                             {isDragOver ? 'Resmi buraya bırakın' : 'Resim yüklemek için tıklayın'}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                             veya sürükleyip bırakın
//                         </p>
//                         <p className="text-xs text-gray-400 mt-2">
//                             PNG, JPG, GIF (Max 5MB)
//                         </p>
//                     </div>
//                 </div>
//             )}

//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileInputChange}
//                 className="hidden"
//             />

//             {error && (
//                 <p className="text-sm text-red-600">{error}</p>
//             )}
//         </div>
//     )
// }

// ImageUpload.js veya ilgili component dosyası

const ImageUpload = ({ value, onChange }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (value instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(value);
        } else if (typeof value === 'string') {
            setPreview(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Görseli
            </label>
            <div className="mt-1 flex items-center">
                {preview ? (
                    <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill

                            className="object-contain rounded-lg"
                            sizes="(max-width: 200px) 100vw, 200px"
                            onError={(e) => {
                                console.error('Image load error:', e);
                                e.target.style.display = 'none';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                onChange(null);
                                setPreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="cursor-pointer flex justify-center items-center w-24 h-24 rounded-lg border-2 border-gray-300 border-dashed hover:border-purple-500">
                        <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-1 text-xs text-gray-500">Resim Yükle</span>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;