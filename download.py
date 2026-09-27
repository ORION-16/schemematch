
from datasets import load_dataset
print('Downloading dataset...')
ds = load_dataset('shrijayan/gov_myscheme')
df = ds['train'].to_pandas()
df.to_json('server/data/raw_schemes.json', orient='records', force_ascii=False)
print('Saved to server/data/raw_schemes.json')
