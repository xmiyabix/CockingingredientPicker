const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// CORS設定
app.use(cors());
app.use(express.json());

// 栄養データを読み込む
let nutritionData = [];

// CSVファイルを読み込む
fs.createReadStream(path.join(__dirname, '../database/nutrition_data.csv'))
  .pipe(csv())
  .on('data', (row) => {
    nutritionData.push(row);
  })
  .on('end', () => {
    console.log('栄養データの読み込みが完了しました');
  });

// 全食品データを取得
app.get('/api/foods', (req, res) => {
  res.json(nutritionData);
});

// 食品名で検索
app.get('/api/foods/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]);
  }
  
  const results = nutritionData.filter(food => 
    food['食品名'].toLowerCase().includes(query.toLowerCase())
  );
  
  res.json(results);
});

// 食品群で検索
app.get('/api/foods/category/:category', (req, res) => {
  const category = req.params.category;
  const results = nutritionData.filter(food => 
    food['食品群'] === category
  );
  
  res.json(results);
});

// 栄養成分で検索（カロリー範囲）
app.get('/api/foods/calories', (req, res) => {
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 1000;
  
  const results = nutritionData.filter(food => {
    const calories = parseInt(food['kcal']) || 0;
    return calories >= min && calories <= max;
  });
  
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
}); 