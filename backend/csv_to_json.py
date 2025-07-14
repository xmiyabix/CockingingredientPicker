import csv
import json

input_csv = 'nutrition_data.csv'
output_json = 'nutrition_data_mini.json'

# 抽出するカラム
columns = [
    '食品群', '食品番号', '索引番号', '食品名', 'kcal', 'タンパク質[g]', '脂質[g]', '炭水化物[g]'
]

with open(input_csv, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    data = [
        {col: row[col] for col in columns if col in row}
        for row in reader
    ]

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"変換完了: {output_json}") 