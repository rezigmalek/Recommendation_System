
import pandas as pd
from pathlib import Path

# Chemins d'entrée et de sortie
input_path = Path('data/Offers_Description_New.xlsx')
output_path = Path('test_offers.xlsx')

if not input_path.exists():
	print(f"Fichier d'entrée introuvable: {input_path}")
	raise SystemExit(1)

# Lire les offres
df = pd.read_excel(input_path)

# Afficher un résumé console (colonnes et premières lignes)
print('Colonnes offres:')
print(df.columns.tolist())
print()
print(df.head().to_string())

# Sauvegarder le résultat dans un fichier Excel nommé test_offers.xlsx
df.to_excel(output_path, index=False)
print(f"Fichier Excel de sortie enregistré: {output_path.resolve()}")
