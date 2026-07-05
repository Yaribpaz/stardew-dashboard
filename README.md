# 🌾 Stardew Valley Dashboard

An interactive data dashboard built with Python and JavaScript, visualizing crop and character data from Stardew Valley.

🔗 **Live Site:** [yaribpaz.github.io/stardew-dashboard](https://yaribpaz.github.io/stardew-dashboard)

---

## 📊 Features

- **Overview** — Season breakdown showing crop counts per season, plus an interactive scatter plot of growth time vs. sell price, filterable by season
- **Crops** — Top 10 most valuable crops ranked by Iridium quality price, and average crop value by season
- **Characters** — Villager gift guide with birthday, location, marriage eligibility, and color-coded loved/liked/disliked/hated gifts for every character

## 🛠️ Built With

- **Python** + **Pandas** — data cleaning, analysis, and JSON export
- **JavaScript** + **Chart.js** — interactive charts and filtering
- **HTML/CSS** — custom earthy Stardew-themed UI with Outfit font
- **GitHub Pages** — deployment

## 📁 Data Sources

- [Stardew Valley Complete Dataset (In Progress)](https://www.kaggle.com/) via Kaggle
- Includes `crops.csv` and `characters.csv`

## 🚀 How It Works

1. Raw CSV data is loaded and cleaned using Python/Pandas
2. Cleaned data is exported to JSON (`crops_data.json`, `characters_data.json`)
3. JavaScript fetches the JSON and renders interactive charts using Chart.js
4. Users can filter the scatter plot by season and look up any villager's gift preferences

---

Made with 🌱 by [Yaritza](https://github.com/Yaribpaz)