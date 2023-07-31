import replicate

training = replicate.trainings.create(
  version="replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
  input={
    "train_data": "https://aschen.ovh/train.jsonl",
  },
  destination="aschen/llama-2-13b-chat-web-v1"
)

print(training)