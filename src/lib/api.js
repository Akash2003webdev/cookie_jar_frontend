import { supabase } from './supabaseClient'

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/placeholder/600/600'

// ---------- helpers ----------

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function mapProduct(row) {
  const variants = (row.product_variants || [])
    .slice()
    .sort((a, b) => Number(a.price) - Number(b.price))

  const minPrice = variants.length ? Math.min(...variants.map((v) => Number(v.price))) : 0

  const reviews = row.product_review || []
  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length) * 10
      ) / 10
    : 0

  const images =
    row.product_images && row.product_images.length ? row.product_images : [PLACEHOLDER_IMAGE]

  return {
    id: row.id,
    name: row.product_name,
    price: minPrice,
    description: row.product_discription || '',
    longDescription: row.product_discription || '',
    status: row.product_status || 'instock',
    rating: avgRating,
    reviewCount: reviews.length,
    category: row.product_category?.category_name || 'Uncategorized',
    categoryId: row.category_id,
    image: images[0],
    images,
    features: ['Freshly Baked', 'Premium Ingredients'],
    variants: variants.map((v) => ({ id: v.id, name: v.variant_name, price: Number(v.price) })),
    reviews: reviews
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((r) => ({
        id: r.id,
        name: r.cus_name,
        rating: Number(r.rating),
        message: r.review_message,
        date: formatDate(r.created_at),
      })),
  }
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.category_name,
    slug: row.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    image: row.category_image || PLACEHOLDER_IMAGE,
  }
}

const PRODUCT_SELECT = `
  *,
  product_category ( id, category_name ),
  product_variants ( id, variant_name, price ),
  product_review ( id, rating, cus_name, review_message, created_at )
`

// ---------- categories ----------

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('product_category')
    .select('*')
    .eq('category_status', 'active')
    .order('category_name')

  if (error) throw error
  return (data || []).map(mapCategory)
}

// ---------- products ----------

export async function fetchProducts() {
  const { data, error } = await supabase.from('product_data').select(PRODUCT_SELECT)
  if (error) throw error
  return (data || []).map(mapProduct)
}

export async function fetchProductsByCategoryId(categoryId) {
  const { data, error } = await supabase
    .from('product_data')
    .select(PRODUCT_SELECT)
    .eq('category_id', categoryId)

  if (error) throw error
  return (data || []).map(mapProduct)
}

export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from('product_data')
    .select(PRODUCT_SELECT)
    .eq('id', productId)
    .single()

  if (error) throw error
  return mapProduct(data)
}

// ---------- product-level reviews ----------

export async function submitProductReview({ productId, name, rating, message }) {
  const { error } = await supabase
    .from('product_review')
    .insert({ product_id: productId, cus_name: name, rating, review_message: message })

  if (error) throw error
}

// ---------- overall (site-level) reviews ----------

export async function fetchOverallReviews() {
  const { data, error } = await supabase
    .from('overall_review')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return (data || []).map((r) => ({
    id: r.id,
    name: r.cus_name,
    rating: Number(r.rating),
    message: r.review_message,
    date: formatDate(r.date),
  }))
}

export async function submitOverallReview({ name, rating, message }) {
  const { error } = await supabase
    .from('overall_review')
    .insert({ cus_name: name, rating, review_message: message })

  if (error) throw error
}
