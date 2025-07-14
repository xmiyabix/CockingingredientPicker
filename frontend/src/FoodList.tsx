import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Food {
  食品群: string;
  食品番号: string;
  索引番号: string;
  食品名: string;
  '廃棄率[%]': string;
  kcal: string;
  '水分[g]': string;
  'タンパク質[g]': string;
  '脂質[g]': string;
  '炭水化物[g]': string;
}

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/foods');
      setFoods(response.data);
      setError(null);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchFoods();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/foods/search?q=${searchTerm}`);
      setFoods(response.data);
      setError(null);
    } catch (err) {
      setError('検索に失敗しました');
      console.error('Error searching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>栄養食品データベース</h1>
      
      {/* 検索機能 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="食品名を入力..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
          検索
        </button>
        <button onClick={fetchFoods} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          全件表示
        </button>
      </div>

      {/* 食品リスト */}
      <div>
        <h2>食品一覧 ({foods.length}件)</h2>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {foods.map((food, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3>{food.食品名}</h3>
              <p><strong>食品群:</strong> {food.食品群}</p>
              <p><strong>カロリー:</strong> {food.kcal} kcal</p>
              <p><strong>タンパク質:</strong> {food['タンパク質[g]']} g</p>
              <p><strong>脂質:</strong> {food['脂質[g]']} g</p>
              <p><strong>炭水化物:</strong> {food['炭水化物[g]']} g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodList; 