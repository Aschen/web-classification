# Web pages data set

## Todo

- ignore 404 when scrapping
- split input and give it
- similarity between page structure
- statistics on word appearance on a page category

## Classification

- classification with embeddings: utiliser mots plus fréquents comme document pour tester
- classification nearest neighboors, support vector machine
- classification with word stats and bayesien
- reduce number of labels by comparing page embeddings and categories embeddings
- classify with LLM a sample of website then use another classification trained with the sample

### LLM

- test on a new website
- change prompt data order for priority

## Qualimetry

- score precision / rappel
- score classifier: moyenne pondérée
- matrice de confusion: en dehors de la diagonale = cat moins bien classées
- type de page correctement detectée par classifier
