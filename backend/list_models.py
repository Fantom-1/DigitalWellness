import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY", "")

def list_available_models():
    if not api_key:
        print("No API key found in .env")
        return
        
    client = genai.Client(api_key=api_key)
    
    print("Available Models for this API Key:")
    print("-" * 40)
    
    try:
        models = client.models.list()
        for m in models:
            # We want to find models that support embedContent or generateContent
            supported_methods = ", ".join(m.supported_generation_methods) if hasattr(m, 'supported_generation_methods') else "Unknown"
            print(f"- {m.name} | Methods: {supported_methods}")
    except Exception as e:
        print(f"Failed to list models: {e}")

if __name__ == "__main__":
    list_available_models()
