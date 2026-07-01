# Backend Connect Panna Steps

## 1. Package install pannunga
```
npm install @supabase/supabase-js
```

## 2. .env file create pannunga (project root la, package.json irukkura idathula)
`.env.example` ah copy pannunga `.env` nu rename pannunga, appuram unga Supabase project la irundhu values fill pannunga:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Indha values Supabase Dashboard → Project Settings → API la kidaikkum.

## 3. Files edhu edhu maathi irukken

- `src/lib/supabaseClient.js` → puthusa create pannen, Supabase connection setup.
- `src/lib/api.js` → puthusa create pannen, ellame DB fetch/insert functions inga irukku:
  - `fetchCategories()`
  - `fetchProducts()`
  - `fetchProductsByCategoryId(categoryId)`
  - `fetchProductById(productId)`
  - `submitProductReview({...})`
  - `fetchOverallReviews()`
  - `submitOverallReview({...})`
- `src/lib/data.js` → mock products/categories/reviews remove pannitten, `bakery` static info mattum vachirukken.
- `src/pages/HomePage.jsx`, `MenuPage.jsx`, `CategoryPage.jsx`, `ProductDetailPage.jsx`, `ReviewsPage.jsx` → ellame Supabase la irundhu fetch pannuradha maathi irukken (loading + error states udan).
- `src/components/StockBadge.jsx`, `ProductCard.jsx` → DB status (`instock` / `low_stock` / `out_of_stock`) use pannuradha maathi irukken, `stock` number illa.

## 4. Tables namma already create panniruken (Supabase SQL editor la run pannirukom)

- `product_category`
- `product_data`
- `product_variants` (1kg / 1/2kg / piece rate)
- `product_review` (per-product reviews)
- `overall_review` (site-level reviews, ReviewsPage la varum)

## 5. Row Level Security (RLS)

Namma already `public read` policy vacharukom ella tables kum. Review insert panna kuda `public insert` policy vacharukom `product_review` and `overall_review` ku. Adhu illainaachu, indha query run pannunga:

```sql
alter table product_review enable row level security;
create policy "public insert" on product_review for insert with check (true);
```

## 6. Run pannunga

```
npm run dev
```

Category page open pannitu products load aaguthaanu check pannunga. Image bucket URL correct ah irundha images kaanum, illa naana placeholder (picsum) image varum.

## Notes

- Product card la "From ₹X" nu varum, athu product ku multiple variants (1kg/1/2kg) irundha. Single variant (piece) products ku direct price mattum varum.
- Rating illama irundha product card la "New" nu varum (review illama irundha).
- `product_review_id` array column product_data table la use pannala — adha pathi `product_review.product_id` FK use pannirukom, adhu dhan reliable.
