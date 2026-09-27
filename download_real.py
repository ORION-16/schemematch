from datasets import load_dataset
import json

ds = load_dataset('shrijayan/gov_myscheme', split='train')
print('Total records:', len(ds))
print('Features:', list(ds.features.keys()))
row = ds[0]
print('First record keys:', list(row.keys()))
for k, v in row.items():
    print(f"{k} type: {type(v)}")
    if isinstance(v, dict):
        for k2, v2 in v.items():
            print(f"  {k2} type: {type(v2)}")
