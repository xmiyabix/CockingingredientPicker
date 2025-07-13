import React, { useState } from 'react';
import './App.css';
import FoodList from './FoodList.tsx';
import NutritionPlanner from './NutritionPlanner.tsx';

function App() {
  const [activeTab, setActiveTab] = useState<'foodlist' | 'planner'>('foodlist');

  return (
    <div className="App">
      {/* タブナビゲーション */}
      <div style={{ 
        borderBottom: '1px solid #ddd', 
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => setActiveTab('foodlist')}
            style={{
              padding: '15px 30px',
              border: 'none',
              backgroundColor: activeTab === 'foodlist' ? '#007bff' : 'transparent',
              color: activeTab === 'foodlist' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            食品データベース
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            style={{
              padding: '15px 30px',
              border: 'none',
              backgroundColor: activeTab === 'planner' ? '#007bff' : 'transparent',
              color: activeTab === 'planner' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            栄養プランナー
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div>
        {activeTab === 'foodlist' && <FoodList />}
        {activeTab === 'planner' && <NutritionPlanner />}
      </div>
    </div>
  );
}

export default App; 