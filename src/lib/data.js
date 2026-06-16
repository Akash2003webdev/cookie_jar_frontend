export const products = [
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    price: 120,
    description: 'Rich, fudgy brownie made with premium chocolate.',
    longDescription:
      'Rich and fudgy brownie made with premium cocoa and baked fresh daily. A timeless classic with a crackly top and a dense, melt-in-your-mouth centre.',
    stock: 25,
    rating: 4.8,
    category: 'Brownie',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80',
    features: ['Freshly Baked', 'Premium Ingredients', 'Best Seller', 'Made Daily'],
  },
  {
    id: 'black-forest-cake',
    name: 'Black Forest Cake',
    price: 350,
    description: 'Fresh cream cake layered with chocolate sponge.',
    longDescription:
      'Light chocolate sponge layered with whipped fresh cream, dark cherries and delicate chocolate shavings. A celebration in every slice.',
    stock: 12,
    rating: 4.7,
    category: 'Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    features: ['Freshly Baked', 'Premium Ingredients', 'Popular Choice', 'Made Daily'],
  },
  {
    id: 'red-velvet-pastry',
    name: 'Red Velvet Pastry',
    price: 90,
    description: 'Soft pastry with cream cheese frosting.',
    longDescription:
      'Velvety red sponge crowned with a generous swirl of tangy cream cheese frosting. Soft, fluffy and beautifully balanced.',
    stock: 8,
    rating: 4.6,
    category: 'Pastry',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    features: ['Freshly Baked', 'Premium Ingredients', 'Popular Choice'],
  },
  {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    price: 600,
    description: 'Custom birthday cakes in multiple flavours.',
    longDescription:
      'Custom-designed birthday cakes available in a range of flavours. Crafted with premium ingredients and finished with elegant detail for your special day.',
    stock: 5,
    rating: 4.9,
    category: 'Birthday Cake',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    features: ['Freshly Baked', 'Premium Ingredients', 'Best Seller', 'Made Daily'],
  },
]

export const categoryMeta = [
  { name: 'Cake',         slug: 'cake',         image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=70' },
  { name: 'Brownie',      slug: 'brownie',       image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=70' },
  { name: 'Pastry',       slug: 'pastry',        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=70' },
  { name: 'Dessert',      slug: 'dessert',       image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=70' },
  { name: 'Cookies',      slug: 'cookies',       image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=70' },
  { name: 'Birthday Cake',slug: 'birthday-cake', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70' },
]

export const initialReviews = [
  { id: 'r1', name: 'Hari',    rating: 5, message: 'Very tasty cake and excellent service.',                          date: '2 weeks ago' },
  { id: 'r2', name: 'Akash',   rating: 5, message: 'The brownie is absolutely heavenly, rich and full of flavour.',   date: '1 month ago' },
  { id: 'r3', name: 'Vignesh', rating: 4, message: 'Lots of dessert options with reasonable prices.',                 date: '1 month ago' },
]

export const bakery = {
  name:        'Cookie Jar',
  tagline:     'Bakery & Cake Shop',
  rating:      4.6,
  reviewCount: 11,
  address:     'Main Road, Trunk Road, Sattur, Tamil Nadu 626203',
  phone:       '+91 82703 95213',
  phoneRaw:    '+918270395213',
  closes:      '10:00 PM',
  mapsUrl:     'https://www.google.com/maps/search/?api=1&query=Cookie+Jar+Bakery+Sattur+Tamil+Nadu',
}
