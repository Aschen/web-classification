from transformers import pipeline

model_name = "facebook/bart-large-mnli"
candidate_labels = ["street address"]
texts = [
  '1 rue de la paix',
  'Karlstraße 12, 80333 Munich, DE',
  'Startups da América Latina demonstraram capacidade de gerar valor econômico diz fundo alemão\n',
  "But what if one day, you come up with a great idea to combine those, for instance to use some Python libraries in your application, but you just do not have any idea how to integrate it with your Node.js application. Of course you can always build API on top of Python backend(Flack, etc), but in that case you need to build, host and manage one more application, when you just need to run a single Python script. That's why I want to give you step by step instructions on how to achieve this.\n",
]

model = pipeline('zero-shot-classification', model=model_name)

print(model_name)

for text in texts:
    result = model(text, candidate_labels)
    top_score = result["scores"][0]
    print(top_score)
