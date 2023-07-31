python trl/examples/scripts/sft_trainer.py \
    --model_name meta-llama/Llama-2-7b-chat-hf \
    --dataset_name aschen/ecommerce-classification \
    --load_in_4bit \
    --use_peft \
    --batch_size 4 \
    --gradient_accumulation_steps 2