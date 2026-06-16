import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ReviewsPage from './pages/ReviewsPage'

export default function App() {
  const [splash, setSplash]               = useState(true)
  const [page, setPage]                   = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  function navigate(p) {
    setPage(p)
    setSelectedProduct(null)
    setSelectedCategory(null)
    window.scrollTo(0, 0)
  }

  function viewProduct(product) {
    setSelectedProduct(product)
    setPage('product')
    window.scrollTo(0, 0)
  }

  function viewCategory(category) {
    setSelectedCategory(category)
    setPage('category')
    window.scrollTo(0, 0)
  }

  if (splash) return <SplashScreen onFinish={() => setSplash(false)} />

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-20 sm:pb-0">
      <Header page={page} onNav={navigate} />

      {page === 'home'     && <HomePage onViewProduct={viewProduct} onNav={navigate} />}
      {page === 'menu'     && <MenuPage onViewCategory={viewCategory} />}
      {page === 'category' && selectedCategory && (
        <CategoryPage
          category={selectedCategory}
          onBack={() => navigate('menu')}
          onViewProduct={viewProduct}
        />
      )}
      {page === 'product'  && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => { setPage('home'); setSelectedProduct(null); window.scrollTo(0, 0) }}
        />
      )}
      {page === 'reviews'  && <ReviewsPage onBack={() => navigate('home')} />}

      <BottomNav page={page} onNav={navigate} />
    </div>
  )
}
