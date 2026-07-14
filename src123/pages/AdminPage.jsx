import { useState, useEffect } from 'react'
import Toast from '../components/Toast'
import ImageUploadField from '../components/ImageUploadField'
import {
  fetchAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  fetchAllReviewsAdmin,
  submitOverallReview,
  updateOverallReview,
  deleteOverallReview,
  fetchAllEnquiriesAdmin,
  deleteEnquiry,
  fetchAllBirthdayEnquiriesAdmin,
  deleteBirthdayEnquiry,
} from '../lib/api'

// ============================================================
// Category form (Add / Edit)
// ============================================================
function CategoryFormModal({ initial, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name || '')
  const [image, setImage] = useState(initial?.image || '')
  const [status, setStatus] = useState(initial?.status || 'active')
  const [imageUploading, setImageUploading] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || imageUploading) return
    onSave({ name: name.trim(), image, status })
  }

  return (
    <div className="fixed inset-0 z-[9997] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full sm:max-w-md shadow-card max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">{initial ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center border-none cursor-pointer text-gray-500">✕</button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Category Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} autoFocus
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              placeholder="e.g. Cake Variety's"
            />
          </div>

          <ImageUploadField
            label="Category Image" value={image} onChange={setImage} bucket="category-images"
            onUploadingChange={setImageUploading}
          />

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Status</label>
            <select
              value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="submit" disabled={saving || imageUploading}
            className="w-full mt-1 bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {imageUploading ? 'Waiting for image upload...' : saving ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Product form (Add / Edit) - includes variants + single image upload
// ============================================================
function ProductFormModal({ initial, categories, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name || '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [status, setStatus] = useState(initial?.status || 'instock')
  const [image, setImage] = useState(initial?.images?.[0] || '')
  const [variants, setVariants] = useState(
    (initial?.variants || []).map((v) => ({ ...v, _deleted: false }))
  )
  const [newVariantName, setNewVariantName] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  function addVariantRow() {
    if (!newVariantName.trim()) return
    setVariants((prev) => [...prev, { id: null, name: newVariantName.trim(), _deleted: false }])
    setNewVariantName('')
  }

  function removeVariantRow(index) {
    setVariants((prev) => {
      const copy = [...prev]
      if (copy[index].id) {
        copy[index] = { ...copy[index], _deleted: true }
      } else {
        copy.splice(index, 1)
      }
      return copy
    })
  }

  function updateVariantField(index, field, value) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !categoryId || imageUploading) return
    onSave({
      name: name.trim(),
      categoryId,
      description: description.trim(),
      status,
      images: image ? [image] : [],
      variants,
    })
  }

  const visibleVariants = variants.filter((v) => !v._deleted)

  return (
    <div className="fixed inset-0 z-[9997] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full sm:max-w-lg shadow-card max-h-[92vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">{initial ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center border-none cursor-pointer text-gray-500">✕</button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Product Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} autoFocus
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              placeholder="e.g. Vanilla Cake"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Category</label>
              <select
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Status</label>
              <select
                value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              >
                <option value="instock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[70px]"
              placeholder="Short description..."
            />
          </div>

          <ImageUploadField
            label="Product Image" value={image} onChange={setImage} bucket="product-images"
            onUploadingChange={setImageUploading}
          />

          {/* Variants */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Variants (e.g. weight, size)</label>
            <div className="flex flex-col gap-2 mb-2">
              {visibleVariants.map((v, i) => {
                const realIndex = variants.indexOf(v)
                return (
                  <div key={v.id || `new-${i}`} className="flex gap-2 items-center bg-gray-50 rounded-2xl p-2">
                    <input
                      value={v.name}
                      onChange={(e) => updateVariantField(realIndex, 'name', e.target.value)}
                      className="flex-1 min-w-0 border border-gray-200 rounded-xl py-1.5 px-3 text-xs outline-none bg-white"
                      placeholder="e.g. 1kg"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantRow(realIndex)}
                      className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer text-sm px-1"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2 items-center">
              <input
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="flex-1 min-w-0 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white"
                placeholder="Variant name e.g. 1/2kg"
              />
              <button
                type="button"
                onClick={addVariantRow}
                className="text-primary font-bold text-xs bg-primary/10 hover:bg-primary/15 rounded-xl px-3 py-2 border-none cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={saving || imageUploading}
            className="w-full mt-1 bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {imageUploading ? 'Waiting for image upload...' : saving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Review form (Add / Edit)
// ============================================================
function ReviewFormModal({ initial, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name || '')
  const [rating, setRating] = useState(initial?.rating || 5)
  const [hover, setHover] = useState(0)
  const [message, setMessage] = useState(initial?.message || '')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    onSave({ name: name.trim(), rating, message: message.trim() })
  }

  return (
    <div className="fixed inset-0 z-[9997] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full sm:max-w-md shadow-card max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">{initial ? 'Edit Review' : 'Add Review'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center border-none cursor-pointer text-gray-500">✕</button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Customer Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} autoFocus
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n} type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  style={{ color: (hover || rating) >= n ? '#f4a261' : '#ddd' }}
                  className="bg-transparent border-none cursor-pointer text-2xl p-0.5 transition-colors"
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Review Message</label>
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[80px]"
              placeholder="Review message..."
            />
          </div>
          <button
            type="submit" disabled={saving}
            className="w-full mt-1 bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Main Admin Page
// ============================================================
export default function AdminPage({ onExit }) {
  const [tab, setTab] = useState('categories') // 'categories' | 'products' | 'reviews' | 'orders' | 'birthday'
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [birthdayEnquiries, setBirthdayEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const [editingCategory, setEditingCategory] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingReview, setEditingReview] = useState(null)

  async function loadAll() {
    setLoading(true)
    try {
      const [c, p, r, e, b] = await Promise.all([
        fetchAllCategoriesAdmin(),
        fetchAllProductsAdmin(),
        fetchAllReviewsAdmin(),
        fetchAllEnquiriesAdmin(),
        fetchAllBirthdayEnquiriesAdmin(),
      ])
      setCategories(c)
      setProducts(p)
      setReviews(r)
      setEnquiries(e)
      setBirthdayEnquiries(b)
    } catch (err) {
      console.error(err)
      setToast('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  // ---------- category actions ----------

  async function saveCategory(payload) {
    setSaving(true)
    try {
      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, payload)
        setToast('✅ Category updated')
      } else {
        await createCategory(payload)
        setToast('✅ Category added')
      }
      setEditingCategory(null)
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast(`❌ ${err?.message || 'Something went wrong saving category'}`)
    } finally {
      setSaving(false)
    }
  }

  async function removeCategory(cat) {
    if (!confirm(`Delete category "${cat.name}"? Products using it will not be deleted.`)) return
    try {
      await deleteCategory(cat.id)
      setToast('🗑 Category deleted')
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Could not delete category (check for linked products)')
    }
  }

  // ---------- product actions ----------

  async function saveProduct(payload) {
    setSaving(true)
    try {
      let productId = editingProduct?.id

      if (productId) {
        await updateProduct(productId, payload)
      } else {
        productId = await createProduct(payload)
      }

      for (const v of payload.variants) {
        if (v._deleted && v.id) {
          await deleteVariant(v.id)
        } else if (!v._deleted && v.id) {
          await updateVariant(v.id, { name: v.name })
        } else if (!v._deleted && !v.id) {
          await createVariant(productId, { name: v.name })
        }
      }

      setToast(editingProduct?.id ? '✅ Product updated' : '✅ Product added')
      setEditingProduct(null)
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast(`❌ ${err?.message || 'Something went wrong saving product'}`)
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(p) {
    if (!confirm(`Delete product "${p.name}"? This also removes its variants and reviews.`)) return
    try {
      await deleteProduct(p.id)
      setToast('🗑 Product deleted')
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Could not delete product')
    }
  }

  // ---------- review actions ----------

  async function saveReview(payload) {
    setSaving(true)
    try {
      if (editingReview?.id) {
        await updateOverallReview(editingReview.id, payload)
        setToast('✅ Review updated')
      } else {
        await submitOverallReview(payload)
        setToast('✅ Review added')
      }
      setEditingReview(null)
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast(`❌ ${err?.message || 'Something went wrong saving review'}`)
    } finally {
      setSaving(false)
    }
  }

  async function removeReview(r) {
    if (!confirm(`Delete review from "${r.name}"?`)) return
    try {
      await deleteOverallReview(r.id)
      setToast('🗑 Review deleted')
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Could not delete review')
    }
  }

  // ---------- enquiry (order) actions ----------

  async function removeEnquiry(e) {
    if (!confirm(`Delete this order from "${e.customerName || 'customer'}"?`)) return
    try {
      await deleteEnquiry(e.id)
      setToast('🗑 Order deleted')
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Could not delete order')
    }
  }

  async function removeBirthdayEnquiry(e) {
    if (!confirm(`Delete birthday cake order from "${e.name}"?`)) return
    try {
      await deleteBirthdayEnquiry(e.id)
      setToast('🗑 Birthday order deleted')
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Could not delete birthday order')
    }
  }

  // NAVIGATION TABS
  const navigationTabs = [
    {
      key: 'categories',
      label: 'Categories',
      svg: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={active ? 'currentColor' : '#71717a'} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      key: 'products',
      label: 'Products',
      svg: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={active ? 'currentColor' : '#71717a'} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    },
    {
      key: 'reviews',
      label: 'Reviews',
      svg: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={active ? 'currentColor' : '#71717a'} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.436.793-.436.966 0l1.819 4.622c.068.174.227.294.412.315l4.988.58c.47.054.658.632.292.96L16.29 13.5c-.135.12-.197.304-.162.483l.893 4.956c.084.468-.403.822-.806.58l-4.475-2.39a.449.449 0 0 0-.42 0l-4.475 2.39c-.403.242-.89-.112-.806-.58l.893-4.956a.45.45 0 0 0-.162-.482L2.73 10.515c-.366-.328-.178-.906.292-.96l4.989-.58a.45.45 0 0 0 .412-.315l1.819-4.623Z" />
        </svg>
      )
    },
    {
      key: 'orders',
      label: 'Enquiry/Orders',
      svg: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={active ? 'currentColor' : '#71717a'} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      )
    },
    {
      key: 'birthday',
      label: 'Birthday',
      svg: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={active ? 'currentColor' : '#71717a'} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v2.5M12 4.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4.5 10.5h15M3 14.25h18M5.25 10.5v8.25a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V10.5M7.5 7.5h9" />
        </svg>
      )
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-10 pb-24 animate-fade-in">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black">Manage Cookie Jar</h1>
        </div>
        <button
          onClick={onExit}
          className="text-sm font-semibold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl px-4 py-2 border-none cursor-pointer"
        >
          ← Exit Admin
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">Loading...</div>
      ) : tab === 'categories' ? (
        <>
          <button
            onClick={() => setEditingCategory({})}
            className="mb-4 bg-primary text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all border-none cursor-pointer"
          >
            + Add Category
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-3 shadow-soft flex gap-3 items-center">
                <img src={c.image} alt={c.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold truncate">{c.name}</p>
                  <p className="text-[11px] text-gray-400">/{c.slug}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setEditingCategory(c)}
                    className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeCategory(c)}
                    className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : tab === 'products' ? (
        <>
          <button
            onClick={() => setEditingProduct({})}
            disabled={categories.length === 0}
            className="mb-4 bg-primary text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all border-none cursor-pointer disabled:opacity-50"
          >
            + Add Product
          </button>
          {categories.length === 0 && (
            <p className="text-xs text-gray-400 mb-4">Add a category first before adding products.</p>
          )}

          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl p-3.5 shadow-soft flex gap-3 items-center">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.category} · {p.status.replace('_', ' ')}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">
                    {p.variants.map((v) => v.name).join(' · ') || 'No variants'}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(p)}
                    className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : tab === 'reviews' ? (
        <>
          <button
            onClick={() => setEditingReview({})}
            className="mb-4 bg-primary text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all border-none cursor-pointer"
          >
            + Add Review
          </button>

          <div className="flex flex-col gap-3">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">No reviews yet.</div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-3.5 shadow-soft flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-extrabold">{r.name}</p>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="text-sm my-1" style={{ color: '#f4a261' }}>
                      {'★'.repeat(r.rating)}<span style={{ color: '#ddd' }}>{'★'.repeat(5 - r.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-600">{r.message}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setEditingReview(r)}
                      className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeReview(r)}
                      className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 border-none cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : tab === 'orders' ? (
        <div className="flex flex-col gap-3">
          {enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">No orders yet.</div>
          ) : (
            enquiries.map((e) => (
              <div key={e.id} className="bg-white rounded-3xl p-3.5 shadow-soft flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-extrabold">{e.customerName || 'No name'}</p>
                    <span className="text-xs text-gray-400">{e.createdAt}</span>
                  </div>
                  {e.customerNote && (
                    <p className="text-xs text-gray-500 mt-0.5">📞 {e.customerNote}</p>
                  )}
                  <div className="mt-1.5 flex flex-col gap-0.5">
                    {e.items.map((it, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        • {it.product_name} ({it.variant_name}) x{it.qty}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeEnquiry(e)}
                  className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 border-none cursor-pointer flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {birthdayEnquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-sm text-gray-400 shadow-soft">No birthday cake orders yet.</div>
          ) : (
            birthdayEnquiries.map((e) => (
              <div key={e.id} className="bg-white rounded-3xl p-3.5 shadow-soft flex gap-3 items-start">
                {e.imageSample && (
                  <img src={e.imageSample} alt="" className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-gray-50" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-extrabold">{e.name}</p>
                    <span className="text-xs text-gray-400">{e.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">📞 {e.contact}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {e.cakeFlavour && `${e.cakeFlavour} · `}
                    {e.cakeWeight && `${e.cakeWeight} · `}
                    Delivery: {e.deliveryDate}
                    {e.birthDate && ` · DOB: ${e.birthDate}`}
                  </p>
                  {e.description && <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>}
                  <p className="text-[11px] text-gray-400 mt-1">
                    {[e.sugarLevel, e.flourType, e.sweetenerType, e.creamType].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <button
                  onClick={() => removeBirthdayEnquiry(e)}
                  className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 border-none cursor-pointer flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR - alignment fixed:
          - items-stretch on row + justify-start in each button keeps icons level
            regardless of label length ("Enquiry/Orders" no longer knocks icon out of line)
          - whitespace-nowrap on label prevents 2-line wrap on small screens
          - removed duplicate bg-white class */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex items-stretch justify-around z-[9996] pt-2 pb-5 px-1">
        {navigationTabs.map((t) => {
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center justify-start gap-1 py-1 px-0.5 border-none bg-transparent cursor-pointer transition-all ${
                isActive ? 'text-primary scale-105' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <div className="flex items-center justify-center h-6 w-6 shrink-0">
                {t.svg(isActive)}
              </div>
              <span
                className={`text-[8.5px] leading-tight font-bold tracking-wide uppercase text-center whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      {editingCategory !== null && (
        <CategoryFormModal
          initial={editingCategory.id ? editingCategory : null}
          onSave={saveCategory}
          onClose={() => setEditingCategory(null)}
          saving={saving}
        />
      )}

      {editingProduct !== null && (
        <ProductFormModal
          initial={editingProduct.id ? editingProduct : null}
          categories={categories}
          onSave={saveProduct}
          onClose={() => setEditingProduct(null)}
          saving={saving}
        />
      )}

      {editingReview !== null && (
        <ReviewFormModal
          initial={editingReview.id ? editingReview : null}
          onSave={saveReview}
          onClose={() => setEditingReview(null)}
          saving={saving}
        />
      )}
    </div>
  )
}
