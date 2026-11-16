import os
import json
from google import genai
from google.genai import types

api_key = os.getenv("GEMINI_API_KEY", "")

class IntentParser:
    def __init__(self):
        self.client = genai.Client(api_key=api_key) if api_key else None

    def parse_intent(self, user_query: str) -> dict:
        if not self.client:
            return {"raw_query": user_query}
            
        prompt = f"""
        Extract the search intent from the user query into a JSON object.
        Possible keys:
        - task (e.g. text-generation, code, vision, audio, text-to-image, multimodal, generic)
        - max_vram_gb (numeric)
        - offline (boolean)
        - license (string)
        - free (boolean)
        
        Query: "{user_query}"
        
        Output only valid JSON.
        """
        
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
                
            return json.loads(text)
        except Exception as e:
            # Fallback to older model if new one is not available
            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:-3]
                elif text.startswith("```"):
                    text = text[3:-3]
                return json.loads(text)
            except Exception as fallback_e:
                print(f"Intent parsing failed: {fallback_e}")
                return {"raw_query": user_query}
            
    def generate_embedding(self, text: str) -> list[float]:
        if not self.client or not text:
            return None
            
        try:
            result = self.client.models.embed_content(
                model="gemini-embedding-2",
                contents=text,
                config=types.EmbedContentConfig(
                    output_dimensionality=768,
                    task_type="RETRIEVAL_DOCUMENT"
                )
            )
            # The result structure might vary slightly but it usually returns a list of embeddings
            return result.embeddings[0].values
        except Exception as e:
            try:
                # Fallback to the other available embedding model
                result = self.client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=text,
                    config=types.EmbedContentConfig(
                        output_dimensionality=768,
                        task_type="RETRIEVAL_DOCUMENT"
                    )
                )
                return result.embeddings[0].values
            except Exception as fallback_e:
                print(f"Embedding failed completely: {fallback_e}")
                return None

intent_parser = IntentParser()

