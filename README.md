# Web pages data set

## Todo

- ignore 404 when scrapping
- do not scrap anchors
- split input and give it
- similarity between page structure: https://github.com/DatabaseGroup/tree-similarity
- statistics on word appearance on a page category
- parallel classifiers requests for performances
- remove og:image attributes
- utiliser embeddings clustering pour trouver les types de pages
- utiliser le HTML + la structure des noeuds pour l'embeddings
- remove duplicated content text between pages
- purger les noeuds HTML de menu (avec les classes)

## Classification

- classification with embeddings: utiliser mots plus fréquents comme document pour tester
- classification support vector machine
- classification with word stats and bayesien
- reduce number of labels by comparing page embeddings and categories embeddings
- classify with LLM a sample of website then use another classification trained with the sample
- GPT: jouer avec les hyper params

## Qualimetry

- sites moins bien classifiés
- score precision / rappel
- score classifier: moyenne pondérée
- matrice de confusion: en dehors de la diagonale = cat moins bien classées
- type de page correctement detectée par classifier
