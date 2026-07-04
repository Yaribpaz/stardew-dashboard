import pandas as pd

crops = pd.read_csv('crops.csv')
pd.set_option('display.max_columns', None)
print(crops.head(10))
print(crops['Season'].unique())

import ast

def clean_season(val):
    if pd.isna(val):
        return 'Unknown'
    try:
        seasons_list = ast.literal_eval(val)
        return seasons_list[0]  # just take the first season
    except:
        return str(val)

crops['Season Simple'] = crops['Season'].apply(clean_season)
print(crops[['Name', 'Season', 'Season Simple']].head(10))

# Top 10 most valuable crops at max quality
top_crops = crops.sort_values('Price (Iridium)', ascending=False).head(10)
print(top_crops[['Name', 'Price (Regular)', 'Price (Iridium)', 'Season Simple']])

# Average value by season
season_value = crops.groupby('Season Simple')['Price (Iridium)'].mean().sort_values(ascending=False)
print(season_value)

characters = pd.read_csv('characters.csv')
print(characters[['Name', 'Birthday Season', 'Birthday Day', 'Lives In', 'Loved Gifts']].head(10))

crops.to_json('crops_data.json', orient='records')
characters.to_json('characters_data.json', orient='records')
print("Exported crops_data.json and characters_data.json!")

print(crops[['Name', 'Season Simple', 'Price (Regular)', 'Price (Iridium)', 'Growth Time (In Days)', 'Sell Price (Seed)']].head(15))