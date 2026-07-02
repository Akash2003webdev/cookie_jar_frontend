import { useState, useEffect } from 'react'
import Toast from '../components/Toast'
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
} from '../lib/api'

// ============================================================
// Category form (used for both Add and Edit)
// ============================================================
function CategoryFormModal({ initial, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name || '')
  const [image, setImage] = useState(initial?.image || '')
  const [status, setStatus] = useState(initial?.status || 'active')

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), image: image.trim(), status })
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
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Image URL</label>
            <input
              value={image} onChange={(e) => setImage(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              placeholder="https://..."
            />
          </div>
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
            type="submit" disabled={saving}
            className="w-full mt-1 bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Product form (used for both Add and Edit) - includes variants
// ============================================================
function ProductFormModal({ initial, categories, onSave, onClose, saving }) {
  const [name, setName] = useState(initial?.name || '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [status, setStatus] = useState(initial?.status || 'instock')
  const [imagesText, setImagesText] = useState((initial?.images || []).join('\n'))
  const [variants, setVariants] = useState(
    (initial?.variants || []).map((v) => ({ ...v, _deleted: false }))
  )
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')

  function addVariantRow() {
    if (!newVariantName.trim() || !newVariantPrice) return
    setVariants((prev) => [
      ...prev,
      { id: null, name: newVariantName.trim(), price: Number(newVariantPrice), _deleted: false },
    ])
    setNewVariantName('')
    setNewVariantPrice('')
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
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: field === 'price' ? Number(value) : value } : v))
    )
  }

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !categoryId) return
    const images = imagesText.split('\n').map((s) => s.trim()).filter(Boolean)
    onSave({
      name: name.trim(),
      categoryId,
      description: description.trim(),
      status,
      images,
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

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Image URLs (one per line)</label>
            <textarea
              value={imagesText} onChange={(e) => setImagesText(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[60px]"
              placeholder="https://...&#10;https://..."
            />
          </div>

          {/* Variants */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Variants (weight / price)</label>
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
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariantField(realIndex, 'price', e.target.value)}
                      className="w-20 border border-gray-200 rounded-xl py-1.5 px-3 text-xs outline-none bg-white"
                      placeholder="₹"
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
              <input
                type="number"
                value={newVariantPrice}
                onChange={(e) => setNewVariantPrice(e.target.value)}
                className="w-20 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white"
                placeholder="₹"
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
            type="submit" disabled={saving}
            className="w-full mt-1 bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary-light active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Product'}
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
  const [tab, setTab] = useState('categories') // 'categories' | 'products'
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const [editingCategory, setEditingCategory] = useState(null) // null = closed, {} = new, {...} = edit
  const [editingProduct, setEditingProduct] = useState(null)

  async function loadAll() {
    setLoading(true)
    try {
      const [c, p] = await Promise.all([fetchAllCategoriesAdmin(), fetchAllProductsAdmin()])
      setCategories(c)
      setProducts(p)
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
      setToast('Something went wrong saving category')
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

      // Reconcile variants
      for (const v of payload.variants) {
        if (v._deleted && v.id) {
          await deleteVariant(v.id)
        } else if (!v._deleted && v.id) {
          await updateVariant(v.id, { name: v.name, price: v.price })
        } else if (!v._deleted && !v.id) {
          await createVariant(productId, { name: v.name, price: v.price })
        }
      }

      setToast(editingProduct?.id ? '✅ Product updated' : '✅ Product added')
      setEditingProduct(null)
      await loadAll()
    } catch (err) {
      console.error(err)
      setToast('Something went wrong saving product')
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-10 animate-fade-in">
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-soft w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setTab('categories')}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border-none cursor-pointer transition-colors ${
            tab === 'categories' ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:bg-gray-50'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border-none cursor-pointer transition-colors ${
            tab === 'products' ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:bg-gray-50'
          }`}
        >
          Products ({products.length})
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
      ) : (
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
                    {p.variants.map((v) => `${v.name} ₹${v.price}`).join(' · ') || 'No variants'}
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
      )}

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
    </div>
  )
}
