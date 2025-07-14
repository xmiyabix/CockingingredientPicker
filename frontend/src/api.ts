// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchFoods() {
  const res = await fetch(`${API_BASE}/api/foods`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

// 他のAPIも同様に追加