import google.generativeai as genai
import os
from PIL import Image
import io
import base64
import json
from typing import Dict, Any, Optional

class AIService:
    """AI model service for food analysis and image processing"""
    
    def __init__(self, api_key: str):
        """Initialize AI model service with API key"""
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        # Initialize models
        self.vision_model = genai.GenerativeModel('gemini-1.5-flash')
        self.text_model = genai.GenerativeModel('gemini-1.5-flash')
        
    def analyze_food_image(self, image_path: str) -> Dict[str, Any]:
        """Analyze food image using AI model"""
        try:
            # Load and prepare image
            image = Image.open(image_path)
            
            # Create prompt for food analysis
            prompt = """
            Analyze this food product image and extract the following information in JSON format:
            
            {
                "food_name": "Name of the food product",
                "food_category": "Category (e.g., Snacks, Beverages, Dairy, etc.)",
                "nutritional_info": {
                    "calories": "calories per serving (number only)",
                    "protein": "protein in grams (number only)", 
                    "carbohydrates": "carbs in grams (number only)",
                    "fat": "fat in grams (number only)",
                    "fiber": "fiber in grams (number only)",
                    "sugar": "sugar in grams (number only)",
                    "sodium": "sodium in mg (number only)"
                },
                "ingredients": ["list", "of", "main", "ingredients"],
                "allergens": ["list", "of", "allergens"],
                "processing_level": "number from 1-10 (1=unprocessed, 10=ultra-processed)",
                "health_analysis": "Brief health assessment of this food",
                "recommendations": ["specific", "health", "recommendations"],
                "confidence": "confidence level from 0-100"
            }
            
            If this is a nutrition label, extract the exact values. If it's a food product without visible nutrition facts, provide estimated values based on the food type.
            
            Return only valid JSON, no additional text.
            """
            
            # Generate response
            response = self.vision_model.generate_content([prompt, image])
            
            # Parse JSON response
            try:
                # Clean the response text to extract JSON
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                result = json.loads(response_text)
                return {
                    "success": True,
                    "data": result,
                    "raw_response": response.text
                }
            except json.JSONDecodeError as e:
                return {
                    "success": False,
                    "error": f"Failed to parse JSON response: {e}",
                    "raw_response": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to analyze image: {str(e)}"
            }
    
    def extract_nutrition_label(self, image_path: str) -> Dict[str, Any]:
        """Extract nutrition facts from food label using AI model"""
        try:
            image = Image.open(image_path)
            
            prompt = """
            Extract nutrition facts from this food label image. Return the information in this exact JSON format:
            
            {
                "nutrition_facts": {
                    "serving_size": "serving size text",
                    "calories": number,
                    "total_fat": number,
                    "saturated_fat": number,
                    "trans_fat": number,
                    "cholesterol": number,
                    "sodium": number,
                    "total_carbs": number,
                    "dietary_fiber": number,
                    "total_sugars": number,
                    "added_sugars": number,
                    "protein": number,
                    "vitamin_d": number,
                    "calcium": number,
                    "iron": number,
                    "potassium": number
                },
                "ingredients": "full ingredients list text",
                "allergens": ["list of allergens"],
                "product_name": "product name from label",
                "brand": "brand name if visible",
                "confidence": number_from_0_to_100
            }
            
            If a value is not visible or unclear, use 0. Return only valid JSON.
            """
            
            response = self.vision_model.generate_content([prompt, image])
            
            try:
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                result = json.loads(response_text)
                return {
                    "success": True,
                    "data": result,
                    "raw_response": response.text
                }
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": "Failed to parse nutrition label",
                    "raw_response": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to extract nutrition label: {str(e)}"
            }
    
    def generate_health_recommendations(self, nutritional_data: Dict[str, Any], 
                                      user_preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate personalized health recommendations using AI model"""
        try:
            # Create detailed prompt for health analysis
            prompt = f"""
            Based on this nutritional information, provide detailed health analysis and recommendations:
            
            Nutritional Data: {json.dumps(nutritional_data, indent=2)}
            User Preferences: {json.dumps(user_preferences or {}, indent=2)}
            
            Provide response in this JSON format:
            {{
                "health_score": number_from_0_to_100,
                "health_category": "Excellent/Good/Fair/Poor",
                "key_nutrients": {{
                    "positive": ["list of beneficial nutrients"],
                    "concerning": ["list of nutrients to watch"]
                }},
                "health_recommendations": [
                    "specific actionable health recommendations"
                ],
                "dietary_considerations": [
                    "considerations for specific diets or health conditions"
                ],
                "portion_advice": "advice about portion sizes",
                "alternatives": [
                    "suggestions for healthier alternatives"
                ],
                "overall_assessment": "detailed health assessment paragraph"
            }}
            
            Consider factors like sodium levels, added sugars, saturated fats, fiber content, protein quality, and overall nutritional density.
            """
            
            response = self.text_model.generate_content(prompt)
            
            try:
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                result = json.loads(response_text)
                return {
                    "success": True,
                    "data": result
                }
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": "Failed to parse health recommendations",
                    "raw_response": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to generate health recommendations: {str(e)}"
            }
    
    def analyze_ingredients(self, ingredients_text: str) -> Dict[str, Any]:
        """Analyze ingredients list for additives, allergens, and health impact"""
        try:
            prompt = f"""
            Analyze this ingredients list and provide detailed information:
            
            Ingredients: {ingredients_text}
            
            Return response in JSON format:
            {{
                "ingredient_analysis": {{
                    "natural_ingredients": ["list of natural ingredients"],
                    "additives": ["list of additives and preservatives"],
                    "artificial_colors": ["list of artificial colors"],
                    "sweeteners": ["list of sweeteners"],
                    "allergens": ["list of potential allergens"]
                }},
                "health_impact": {{
                    "positive_aspects": ["beneficial ingredients"],
                    "concerns": ["potentially concerning ingredients"],
                    "processing_level": "assessment of processing level"
                }},
                "recommendations": [
                    "specific recommendations about these ingredients"
                ],
                "overall_score": number_from_0_to_100
            }}
            """
            
            response = self.text_model.generate_content(prompt)
            
            try:
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                result = json.loads(response_text)
                return {
                    "success": True,
                    "data": result
                }
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": "Failed to parse ingredients analysis",
                    "raw_response": response.text
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to analyze ingredients: {str(e)}"
            }

# Global instance
ai_service = None

def initialize_ai_service(api_key: str) -> AIService:
    """Initialize global AI model service instance"""
    global ai_service
    ai_service = AIService(api_key)
    return ai_service

def get_ai_service() -> Optional[AIService]:
    """Get the global AI model service instance"""
    return ai_service