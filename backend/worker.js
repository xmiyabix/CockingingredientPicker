import { Hono } from 'hono'
import nutritionData from '../backend/nutrition_data_mini.json'

const app = new Hono()

// CORS middleware
app.use('*', (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type')
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }
  return next()
})

// 全食品データ
app.get('/api/foods', (c) => c.json(nutritionData))

// 食品名で検索
app.get('/api/foods/search', (c) => {
  const query = c.req.query('q')
  if (!query) return c.json([])
  const results = nutritionData.filter(food =>
    food['食品名'] && food['食品名'].toLowerCase().includes(query.toLowerCase())
  )
  return c.json(results)
})

// 食品群で検索
app.get('/api/foods/category/:category', (c) => {
  const category = c.req.param('category')
  const results = nutritionData.filter(food => food['食品群'] === category)
  return c.json(results)
})

// カロリー範囲で検索
app.get('/api/foods/calories', (c) => {
  const min = parseInt(c.req.query('min') || '0', 10)
  const max = parseInt(c.req.query('max') || '1000', 10)
  const results = nutritionData.filter(food => {
    const calories = parseInt(food['kcal']) || 0
    return calories >= min && calories <= max
  })
  return c.json(results)
})

// ルート
app.get('/', (c) => c.text('Nutrition Picker API (Hono)'))

export default app 