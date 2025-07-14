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
  '食物繊維[g]': string;
  'ナトリウム[mg]': string;
  'カリウム[mg]': string;
  'カルシウム[mg]': string;
  'マグネシウム[mg]': string;
  'リン[mg]': string;
  '鉄[mg]': string;
  '亜鉛[mg]': string;
  '銅[mg]': string;
  'マンガン[mg]': string;
  'ヨウ素[μg]': string;
  'セレン[μg]': string;
  'クロム[μg]': string;
  'モリブデン[μg]': string;
  'レチノール[μg]': string;
  'α-カロテン[μg]': string;
  'β-カロテン[μg]': string;
  'β-クリプトキサンチン[μg]': string;
  'β-カロテン当量[μg]': string;
  'レチノール活性当量[μg]': string;
  'ビタミンD[μg]': string;
  'α-トコフェロール[mg]': string;
  'β-トコフェロール[mg]': string;
  'γ-トコフェロール[mg]': string;
  'δ-トコフェロール[mg]': string;
  'ビタミンK[μg]': string;
  'ビタミンB1[mg]': string;
  'ビタミンB2[mg]': string;
  'ナイアシン[mg]': string;
  'ナイアシン当量[mg]': string;
  'ビタミンB6[mg]': string;
  'ビタミンB12[μg]': string;
  '葉酸[μg]': string;
  'パントテン酸[mg]': string;
  'ビオチン[μg]': string;
  'ビタミンC[mg]': string;
  'アルコール[g]': string;
  '食塩相当量[g]': string;
}

interface NutritionTarget {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  // 主要ミネラル
  sodium: number;
  potassium: number;
  calcium: number;
  magnesium: number;
  phosphorus: number;
  iron: number;
  zinc: number;
  // 主要ビタミン
  vitaminA: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB6: number;
  vitaminB12: number;
  vitaminC: number;
  folate: number;
  period: 'daily' | 'weekly' | 'monthly';
}

interface RecommendedFood {
  food: Food;
  quantity: number;
  contribution: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sodium: number;
    potassium: number;
    calcium: number;
    magnesium: number;
    phosphorus: number;
    iron: number;
    zinc: number;
    vitaminA: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    vitaminB1: number;
    vitaminB2: number;
    vitaminB6: number;
    vitaminB12: number;
    vitaminC: number;
    folate: number;
  };
}

const NutritionPlanner: React.FC = () => {
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [targets, setTargets] = useState<NutritionTarget>({
    calories: 2000,
    protein: 60,
    fat: 65,
    carbs: 250,
    fiber: 25,
    sodium: 2300,
    potassium: 3500,
    calcium: 1000,
    magnesium: 400,
    phosphorus: 700,
    iron: 18,
    zinc: 11,
    vitaminA: 900,
    vitaminD: 15,
    vitaminE: 15,
    vitaminK: 120,
    vitaminB1: 1.2,
    vitaminB2: 1.3,
    vitaminB6: 1.3,
    vitaminB12: 2.4,
    vitaminC: 90,
    folate: 400,
    period: 'daily'
  });
  const [recommendedFoods, setRecommendedFoods] = useState<RecommendedFood[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    magnesium: 0,
    phosphorus: 0,
    iron: 0,
    zinc: 0,
    vitaminA: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB6: 0,
    vitaminB12: 0,
    vitaminC: 0,
    folate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/foods');
      setAllFoods(response.data);
      setError(null);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  // 5大栄養素を満たす食品リストを生成する改善されたアルゴリズム
  const generateFoodList = () => {
    if (allFoods.length === 0) return;

    const periodMultiplier = targets.period === 'weekly' ? 7 : targets.period === 'monthly' ? 30 : 1;
    const adjustedTargets = {
      calories: targets.calories * periodMultiplier,
      protein: targets.protein * periodMultiplier,
      fat: targets.fat * periodMultiplier,
      carbs: targets.carbs * periodMultiplier,
      fiber: targets.fiber * periodMultiplier,
      sodium: targets.sodium * periodMultiplier,
      potassium: targets.potassium * periodMultiplier,
      calcium: targets.calcium * periodMultiplier,
      magnesium: targets.magnesium * periodMultiplier,
      phosphorus: targets.phosphorus * periodMultiplier,
      iron: targets.iron * periodMultiplier,
      zinc: targets.zinc * periodMultiplier,
      vitaminA: targets.vitaminA * periodMultiplier,
      vitaminD: targets.vitaminD * periodMultiplier,
      vitaminE: targets.vitaminE * periodMultiplier,
      vitaminK: targets.vitaminK * periodMultiplier,
      vitaminB1: targets.vitaminB1 * periodMultiplier,
      vitaminB2: targets.vitaminB2 * periodMultiplier,
      vitaminB6: targets.vitaminB6 * periodMultiplier,
      vitaminB12: targets.vitaminB12 * periodMultiplier,
      vitaminC: targets.vitaminC * periodMultiplier,
      folate: targets.folate * periodMultiplier
    };

    // 栄養素ごとに食品を分類（ランダム性を追加）
    const nutritionCategories = [
      { name: 'protein', foods: shuffleArray(allFoods.filter(f => parseFloat(f['タンパク質[g]']) > 0).sort((a, b) => parseFloat(b['タンパク質[g]']) - parseFloat(a['タンパク質[g]']))) },
      { name: 'fat', foods: shuffleArray(allFoods.filter(f => parseFloat(f['脂質[g]']) > 0).sort((a, b) => parseFloat(b['脂質[g]']) - parseFloat(a['脂質[g]']))) },
      { name: 'carbs', foods: shuffleArray(allFoods.filter(f => parseFloat(f['炭水化物[g]']) > 0).sort((a, b) => parseFloat(b['炭水化物[g]']) - parseFloat(a['炭水化物[g]']))) },
      { name: 'fiber', foods: shuffleArray(allFoods.filter(f => parseFloat(f['食物繊維[g]']) > 0).sort((a, b) => parseFloat(b['食物繊維[g]']) - parseFloat(a['食物繊維[g]']))) },
      { name: 'calcium', foods: shuffleArray(allFoods.filter(f => parseFloat(f['カルシウム[mg]']) > 0).sort((a, b) => parseFloat(b['カルシウム[mg]']) - parseFloat(a['カルシウム[mg]']))) },
      { name: 'iron', foods: shuffleArray(allFoods.filter(f => parseFloat(f['鉄[mg]']) > 0).sort((a, b) => parseFloat(b['鉄[mg]']) - parseFloat(a['鉄[mg]']))) },
      { name: 'zinc', foods: shuffleArray(allFoods.filter(f => parseFloat(f['亜鉛[mg]']) > 0).sort((a, b) => parseFloat(b['亜鉛[mg]']) - parseFloat(a['亜鉛[mg]']))) },
      { name: 'vitaminA', foods: shuffleArray(allFoods.filter(f => parseFloat(f['レチノール活性当量[μg]']) > 0).sort((a, b) => parseFloat(b['レチノール活性当量[μg]']) - parseFloat(a['レチノール活性当量[μg]']))) },
      { name: 'vitaminD', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンD[μg]']) > 0).sort((a, b) => parseFloat(b['ビタミンD[μg]']) - parseFloat(a['ビタミンD[μg]']))) },
      { name: 'vitaminE', foods: shuffleArray(allFoods.filter(f => parseFloat(f['α-トコフェロール[mg]']) > 0).sort((a, b) => parseFloat(b['α-トコフェロール[mg]']) - parseFloat(a['α-トコフェロール[mg]']))) },
      { name: 'vitaminK', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンK[μg]']) > 0).sort((a, b) => parseFloat(b['ビタミンK[μg]']) - parseFloat(a['ビタミンK[μg]']))) },
      { name: 'vitaminB1', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンB1[mg]']) > 0).sort((a, b) => parseFloat(b['ビタミンB1[mg]']) - parseFloat(a['ビタミンB1[mg]']))) },
      { name: 'vitaminB2', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンB2[mg]']) > 0).sort((a, b) => parseFloat(b['ビタミンB2[mg]']) - parseFloat(a['ビタミンB2[mg]']))) },
      { name: 'vitaminB6', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンB6[mg]']) > 0).sort((a, b) => parseFloat(b['ビタミンB6[mg]']) - parseFloat(a['ビタミンB6[mg]']))) },
      { name: 'vitaminB12', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンB12[μg]']) > 0).sort((a, b) => parseFloat(b['ビタミンB12[μg]']) - parseFloat(a['ビタミンB12[μg]']))) },
      { name: 'vitaminC', foods: shuffleArray(allFoods.filter(f => parseFloat(f['ビタミンC[mg]']) > 0).sort((a, b) => parseFloat(b['ビタミンC[mg]']) - parseFloat(a['ビタミンC[mg]']))) },
      { name: 'folate', foods: shuffleArray(allFoods.filter(f => parseFloat(f['葉酸[μg]']) > 0).sort((a, b) => parseFloat(b['葉酸[μg]']) - parseFloat(a['葉酸[μg]']))) }
    ];

    let selectedFoods: RecommendedFood[] = [];
    let currentNutrition = {
      calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0,
      sodium: 0, potassium: 0, calcium: 0, magnesium: 0, phosphorus: 0, iron: 0, zinc: 0,
      vitaminA: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0,
      vitaminB1: 0, vitaminB2: 0, vitaminB6: 0, vitaminB12: 0, vitaminC: 0, folate: 0
    };

    // 各栄養素カテゴリを順番に満たす（ランダム性を追加）
    for (const category of nutritionCategories) {
      const targetKey = category.name as keyof typeof adjustedTargets;
      const currentKey = category.name as keyof typeof currentNutrition;
      
      // 栄養素を満たすために必要な食品数を制限（多様性を保つ）
      let foodsSelected = 0;
      const maxFoodsPerCategory = 3; // カテゴリごとの最大食品数
      
      for (const food of category.foods) {
        if (currentNutrition[currentKey] >= adjustedTargets[targetKey] || foodsSelected >= maxFoodsPerCategory) break;
        
        const nutrientPer100g = parseFloat(food[getNutrientField(category.name)] || '0');
        if (nutrientPer100g <= 0) continue;
        
        const neededNutrient = adjustedTargets[targetKey] - currentNutrition[currentKey];
        const quantity = Math.min(100, (neededNutrient / nutrientPer100g) * 100);
        
        if (quantity > 0) {
          const contribution = calculateContribution(food, quantity);
          selectedFoods.push({ food, quantity, contribution });
          
          // 現在の栄養素を更新
          Object.keys(contribution).forEach(key => {
            currentNutrition[key as keyof typeof currentNutrition] += contribution[key as keyof typeof contribution];
          });
          
          foodsSelected++;
        }
      }
    }

    // カロリー調整（ランダム性を追加）
    if (currentNutrition.calories < adjustedTargets.calories) {
      const calorieFoods = shuffleArray(allFoods
        .filter(food => parseFloat(food.kcal) > 0)
        .sort((a, b) => parseFloat(b.kcal) - parseFloat(a.kcal)));

      let calorieFoodsSelected = 0;
      const maxCalorieFoods = 5; // カロリー調整用の最大食品数

      for (const food of calorieFoods) {
        if (currentNutrition.calories >= adjustedTargets.calories || calorieFoodsSelected >= maxCalorieFoods) break;
        
        const caloriesPer100g = parseFloat(food.kcal);
        const neededCalories = adjustedTargets.calories - currentNutrition.calories;
        const quantity = Math.min(100, (neededCalories / caloriesPer100g) * 100);
        
        if (quantity > 0) {
          const contribution = calculateContribution(food, quantity);
          selectedFoods.push({ food, quantity, contribution });
          
          Object.keys(contribution).forEach(key => {
            currentNutrition[key as keyof typeof currentNutrition] += contribution[key as keyof typeof contribution];
          });
          
          calorieFoodsSelected++;
        }
      }
    }

    // 同じ食品を統合
    const foodMap = new Map<string, RecommendedFood>();
    selectedFoods.forEach(item => {
      const key = item.food.食品名;
      if (foodMap.has(key)) {
        const existing = foodMap.get(key)!;
        existing.quantity += item.quantity;
        Object.keys(item.contribution).forEach(key => {
          existing.contribution[key as keyof typeof existing.contribution] += 
            item.contribution[key as keyof typeof item.contribution];
        });
      } else {
        foodMap.set(key, { ...item });
      }
    });

    const finalFoods = Array.from(foodMap.values());
    setRecommendedFoods(finalFoods);
    setTotalNutrition(currentNutrition);
  };

  // 配列をシャッフルする関数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getNutrientField = (category: string): string => {
    const fieldMap: { [key: string]: string } = {
      protein: 'タンパク質[g]',
      fat: '脂質[g]',
      carbs: '炭水化物[g]',
      fiber: '食物繊維[g]',
      calcium: 'カルシウム[mg]',
      iron: '鉄[mg]',
      zinc: '亜鉛[mg]',
      vitaminA: 'レチノール活性当量[μg]',
      vitaminD: 'ビタミンD[μg]',
      vitaminE: 'α-トコフェロール[mg]',
      vitaminK: 'ビタミンK[μg]',
      vitaminB1: 'ビタミンB1[mg]',
      vitaminB2: 'ビタミンB2[mg]',
      vitaminB6: 'ビタミンB6[mg]',
      vitaminB12: 'ビタミンB12[μg]',
      vitaminC: 'ビタミンC[mg]',
      folate: '葉酸[μg]'
    };
    return fieldMap[category] || '';
  };

  const calculateContribution = (food: Food, quantity: number) => {
    return {
      calories: (parseFloat(food.kcal) * quantity) / 100,
      protein: (parseFloat(food['タンパク質[g]']) * quantity) / 100,
      fat: (parseFloat(food['脂質[g]']) * quantity) / 100,
      carbs: (parseFloat(food['炭水化物[g]']) * quantity) / 100,
      fiber: (parseFloat(food['食物繊維[g]']) * quantity) / 100,
      sodium: (parseFloat(food['ナトリウム[mg]']) * quantity) / 100,
      potassium: (parseFloat(food['カリウム[mg]']) * quantity) / 100,
      calcium: (parseFloat(food['カルシウム[mg]']) * quantity) / 100,
      magnesium: (parseFloat(food['マグネシウム[mg]']) * quantity) / 100,
      phosphorus: (parseFloat(food['リン[mg]']) * quantity) / 100,
      iron: (parseFloat(food['鉄[mg]']) * quantity) / 100,
      zinc: (parseFloat(food['亜鉛[mg]']) * quantity) / 100,
      vitaminA: (parseFloat(food['レチノール活性当量[μg]']) * quantity) / 100,
      vitaminD: (parseFloat(food['ビタミンD[μg]']) * quantity) / 100,
      vitaminE: (parseFloat(food['α-トコフェロール[mg]']) * quantity) / 100,
      vitaminK: (parseFloat(food['ビタミンK[μg]']) * quantity) / 100,
      vitaminB1: (parseFloat(food['ビタミンB1[mg]']) * quantity) / 100,
      vitaminB2: (parseFloat(food['ビタミンB2[mg]']) * quantity) / 100,
      vitaminB6: (parseFloat(food['ビタミンB6[mg]']) * quantity) / 100,
      vitaminB12: (parseFloat(food['ビタミンB12[μg]']) * quantity) / 100,
      vitaminC: (parseFloat(food['ビタミンC[mg]']) * quantity) / 100,
      folate: (parseFloat(food['葉酸[μg]']) * quantity) / 100
    };
  };

  const handleTargetChange = (field: keyof NutritionTarget, value: string | number) => {
    setTargets(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  if (loading) return <div>データを読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>
        🎯 5大栄養素プランナー
      </h2>

      {/* 目標設定フォーム */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#495057' }}>栄養目標を設定</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              期間:
            </label>
            <select 
              value={targets.period}
              onChange={(e) => handleTargetChange('period', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="daily">日次</option>
              <option value="weekly">週次</option>
              <option value="monthly">月次</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              カロリー (kcal):
            </label>
            <input
              type="number"
              value={targets.calories}
              onChange={(e) => handleTargetChange('calories', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              タンパク質 (g):
            </label>
            <input
              type="number"
              value={targets.protein}
              onChange={(e) => handleTargetChange('protein', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              脂質 (g):
            </label>
            <input
              type="number"
              value={targets.fat}
              onChange={(e) => handleTargetChange('fat', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              炭水化物 (g):
            </label>
            <input
              type="number"
              value={targets.carbs}
              onChange={(e) => handleTargetChange('carbs', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              食物繊維 (g):
            </label>
            <input
              type="number"
              value={targets.fiber}
              onChange={(e) => handleTargetChange('fiber', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              カルシウム (mg):
            </label>
            <input
              type="number"
              value={targets.calcium}
              onChange={(e) => handleTargetChange('calcium', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              鉄 (mg):
            </label>
            <input
              type="number"
              value={targets.iron}
              onChange={(e) => handleTargetChange('iron', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              亜鉛 (mg):
            </label>
            <input
              type="number"
              value={targets.zinc}
              onChange={(e) => handleTargetChange('zinc', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              ビタミンA (μg):
            </label>
            <input
              type="number"
              value={targets.vitaminA}
              onChange={(e) => handleTargetChange('vitaminA', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              ビタミンC (mg):
            </label>
            <input
              type="number"
              value={targets.vitaminC}
              onChange={(e) => handleTargetChange('vitaminC', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <button
          onClick={generateFoodList}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🍽️ 5大栄養素食品リストを生成
        </button>
      </div>

      {/* 結果表示 */}
      {recommendedFoods.length > 0 && (
        <div>
          {/* 合計栄養素 */}
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>📊 5大栄養素 - 合計値</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b35' }}>
                  {Math.round(totalNutrition.calories)} kcal
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>カロリー</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>
                  {Math.round(totalNutrition.protein)}g
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>タンパク質</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>
                  {Math.round(totalNutrition.fat)}g
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>脂質</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
                  {Math.round(totalNutrition.carbs)}g
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>炭水化物</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8bc34a' }}>
                  {Math.round(totalNutrition.fiber)}g
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>食物繊維</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#795548' }}>
                  {Math.round(totalNutrition.calcium)}mg
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>カルシウム</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e91e63' }}>
                  {Math.round(totalNutrition.iron)}mg
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>鉄</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff5722' }}>
                  {Math.round(totalNutrition.vitaminC)}mg
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>ビタミンC</div>
              </div>
            </div>
          </div>

          {/* 推奨食品リスト */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>🥗 5大栄養素推奨食品リスト</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {recommendedFoods.map((item, index) => (
                <div key={index} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>{item.food.食品名}</h4>
                    <span style={{ 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      padding: '5px 10px', 
                      borderRadius: '15px',
                      fontSize: '12px'
                    }}>
                      {item.food.食品群}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>推奨量:</strong> {Math.round(item.quantity)}g
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '10px',
                    fontSize: '14px'
                  }}>
                    <div>🔥 {Math.round(item.contribution.calories)} kcal</div>
                    <div>🥩 {Math.round(item.contribution.protein)}g タンパク質</div>
                    <div>🧈 {Math.round(item.contribution.fat)}g 脂質</div>
                    <div>🍞 {Math.round(item.contribution.carbs)}g 炭水化物</div>
                    <div>🌾 {Math.round(item.contribution.fiber)}g 食物繊維</div>
                    <div>🥛 {Math.round(item.contribution.calcium)}mg カルシウム</div>
                    <div>🔩 {Math.round(item.contribution.iron)}mg 鉄</div>
                    <div>🥝 {Math.round(item.contribution.vitaminC)}mg ビタミンC</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionPlanner; 