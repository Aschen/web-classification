# imports
from datasets import load_dataset

# get dataset
dataset = load_dataset("aschen/ecommerce-classification", split="train")

print(dataset)
