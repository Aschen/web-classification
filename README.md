# Webpage classification

This repository contains various research around webpage classification using artificial intelligence (mainly).  
The purpose was to benchmark various methods to classify webpages of e-commerce website into specific categories.

I wanted to use the following technologies:

- langchain.js
- GPT3.5 and GPT4
- Embeddings (ADA2 and Faiss as the store)
- BART and HuggingFace API
- Llama 2 (Replicate for simple usage and Google Collab for fine tuning)
- Playwright for browser intrumentation

TL;DR;

- GPT3.5 is above all the other LLM in term of precision and quality/price ratio
- a mix of GPT3.5 and Gzip is to me the best classification method in term of accuracy/price
- the web is a complete mess and praise browser developers because they have to deal daily with the bad HTML

## Main challenges

### Collect webpages

From a list of e-commerce website, collect all the links by using a recursive sitemap scrapper ([SitemapReader.ts](https://github.com/Aschen/web-classification/blob/master/collectors/SitemapReader.ts)).

Then take a meaningful sample of those links (no need to have 1000 pages containing 1 product), the sample is done by creating a tree from URL parts and collect a fixed number of leafs at each level. ([PageSampler.ts](https://github.com/Aschen/web-classification/blob/master/collectors/PagesSampler.ts))

### Content extraction

Webpages are HTML and HTML is quite noisy, especially since the raise of Javascript applications. I need to extract a meaningful representation of the webpage content because classification methods (LLM or others) works better and faster with smaller texts.

I'm removing some of the HTML tag then I extract the text representation of the elements. ([HTMLScrapper.ts](https://github.com/Aschen/web-classification/blob/master/scrappers/HTMLScrapper.ts)

I also save the OpenGraph description when available.

[extracted-html.md](https://github.com/Aschen/web-classification/blob/master/examples/extracted-html.md)

### GPTClassifier

[GPTClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/GPTClassifier.ts)

First I tried with GPT3.5 and GPT4. The categories and the prompt are part of the variable to evaluate the classification methods. ([prompts.ts](https://github.com/Aschen/web-classification/blob/master/classifiers/prompts.ts), [categories.ts](https://github.com/Aschen/web-classification/blob/master/classifiers/categories.ts)

The results were quite good (~85%) and the difference between GPT3.5 and GPT4 was less than 2% but the price of GPT4 is 10 times more expensive!

From here, I tried other prompts:

- Prompt A: original
- Prompt B: prioritized list of informations (URL > OpenGraph > Text) => slightly better than Prompt A
- Prompt C: URL + OpenGraph only => around 70% on website with OpenGraph info

And other set of categories, the B set was the best. (I could try embeddings clusterization to find out what are the natural categories)

At the end, it costed me 9$ to classify 1575 web pages with GPT3.5 (of course I had to classify them by hand but I used some tricks so I don't have to dumbly classify all of them)

### EmbeddingsClassifier

[EmbeddingsClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/EmbeddingsClassifier.ts)

This classifier use OpenAI Ada2 embeddings to find similarity between categories (with a description) and web pages.

I'm using [Faiss](https://github.com/facebookresearch/faiss) for similarity search.

The results are quite bad, around 30-35% success only but the price is 10 times less than GPT3.5.

### BART

BART is another LLM than can be used for text classification. I tried either with a local version ([BARTClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/BARTClassifier.ts) and one from HuggingFace Inference API ([HFClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/HFClassifier.ts)

The results were quite bad, less than 20% and I encountered few limitation:

- the local version was very slow (no GPU acceleration with Langchain.js)
- the HuggingFace version is limited to 10 categories

### Classifier chain

I had the idea to reduce the number of potential categories so maybe the results can be better. For example, the 3 first answer of GPT3.5 are good 96% of the time and for the embeddings, the 10 first answers are good 95% of the time so we can use a first classifier to reduce the number of categories and then do the final classification with another one.

When I chained GPT3.5 + GPT3.5, I had 91% of good answers (compare to 85% with only one GPT3.5) but the classification price is twice more expensive.

When I chained embeddings + embeddings or embeddings + GPT3.5, I didn't had better results.

[FunnelClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/FunnelClassifier.ts)

### [GzipClassifier](https://github.com/Aschen/web-classification/blob/master/classifiers/GzipClassifier.ts)

Compression algorithme works with the statistical distribution of similarity between texts so then can also be used to tell if a text is similar to another.

For this classifier, we need a train data set and a test data set to evaluate our classifier. Then the algorithm is the following for each page classification:

- for each page of the train set, compress it and get the size of compressed bytes
- compress the page representation and get the size of compressed bytes
- for each page of the train set,
- compress the train page representation + test page representation and get the size of compressed bytes
- compute the normalized compression distance (basically if the texts are similar, the distance is small)
- sort the array of distances and you have your classification

The accuracy was ~50% with 13 website as train dataset and 2 as test data set.

**If the train dataset and the test dataset are from the same website then the success rate is >90%**

### Llama2 Classifier

Since they released Llama 2 during my tests, I had to try! After creating an account at Replicate, I realized that Llama 2 (70B-chat) was completely hallucinating categories and didn't respect my prompt at all regarding to the expected answer format.

I tried with other versions:

- 70b: no answer from API
- 70b-chat: hallucinate categories + bad format after ~40sec
- 7b-chat: hallucinate categories + bad format after ~10sec
- 13b-chat: bad format after ~5sec (model not trained by Replicate: [a16z-infra](https://replicate.com/a16z-infra/llama-2-13b-chat/versions))
- 7b: no answer

### Llama2 fine tuning

I decided to fine tune the Llama2 model for my classification problem by using this [Google Collab](https://colab.research.google.com/drive/1PEQyJO1-f6j0S_XJ8DV50NkpzasXkrzd?usp=sharing)

I had to format the data set for Llama2 and publish it on [HuggingFace](https://huggingface.co/datasets/aschen/ecommerce-classification).

Then the model was published on HuggingFace Inference API on Nvidia A10G for 1.3$/h.

The answer were really bad but I think it's because I couldn't send enough context to HF Inference API with default settings and playing with the settings was quite difficult to understand because the limits are related to each others.

