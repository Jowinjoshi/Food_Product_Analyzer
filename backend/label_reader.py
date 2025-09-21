import cv2
import pytesseract
import numpy as np
from PIL import Image
import re
import json
import os

class FoodLabelReader:
    """OCR-based food label reader for extracting nutritional information"""
    
    def __init__(self):
        """Initialize the label reader"""
        # Configure tesseract path for Windows
        import os
        tesseract_paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            r'C:\tesseract\tesseract.exe'
        ]
        
        # Find and set tesseract path
        for path in tesseract_paths:
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"Tesseract configured at: {path}")
                break
        else:
            print("Warning: Tesseract not found at common paths. OCR may not work.")
            print("Please install Tesseract-OCR or add it to your PATH.")
    
    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        try:
            # Read image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Could not read image from {image_path}")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply noise reduction
            denoised = cv2.medianBlur(gray, 3)
            
            # Apply threshold to get binary image
            _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Morphological operations to clean up
            kernel = np.ones((2, 2), np.uint8)
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            
            # Apply dilation to make text thicker and more readable
            dilated = cv2.dilate(cleaned, kernel, iterations=1)
            
            return dilated
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            # Fallback: try to read with PIL and convert
            try:
                pil_img = Image.open(image_path)
                img_array = np.array(pil_img.convert('L'))  # Convert to grayscale
                return img_array
            except Exception as fallback_error:
                print(f"Fallback preprocessing also failed: {fallback_error}")
                raise
    
    def extract_text_from_image(self, image_path):
        """Extract all text from food label image"""
        try:
            # First, try direct text extraction without preprocessing
            try:
                # Direct OCR on original image
                text_direct = pytesseract.image_to_string(Image.open(image_path), config=r'--oem 3 --psm 3')
                if text_direct.strip():
                    print("Direct OCR successful")
                    return text_direct.strip()
            except Exception as direct_error:
                print(f"Direct OCR failed: {direct_error}")
            
            # If direct OCR fails, try preprocessed image
            processed_img = self.preprocess_image(image_path)
            
            # Try multiple OCR configurations
            ocr_configs = [
                r'--oem 3 --psm 6',  # Uniform text block
                r'--oem 3 --psm 3',  # Auto page segmentation
                r'--oem 3 --psm 1',  # Auto with OSD
                r'--oem 3 --psm 11', # Sparse text
                r'--oem 3 --psm 12', # Single word
            ]
            
            best_text = ""
            for config in ocr_configs:
                try:
                    text = pytesseract.image_to_string(processed_img, config=config)
                    if len(text.strip()) > len(best_text):
                        best_text = text.strip()
                        print(f"Better OCR result with config: {config}")
                except Exception as config_error:
                    print(f"OCR config {config} failed: {config_error}")
                    continue
            
            if best_text:
                return best_text
            else:
                # Last resort: try with original image and default config
                text = pytesseract.image_to_string(Image.open(image_path))
                return text.strip()
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            return ""
    
    def parse_nutritional_info(self, text):
        """Parse nutritional information from extracted text"""
        nutritional_data = {}
        
        # Improved nutritional patterns with more flexible matching
        patterns = {
            'calories': [
                r'calories?\s*:?\s*(\d+)',
                r'energy\s*:?\s*(\d+)\s*kcal',
                r'(\d+)\s*cal(?:ories?)?'
            ],
            'protein': [
                r'protein\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'proteins?\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*g\s*protein',
                r'protein:\s*(\d+(?:\.\d+)?)',  # Handle missing 'g'
                r'protein\s*(\d+(?:\.\d+)?)'
            ],
            'carbohydrates': [
                r'carbohydrates?\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'carbs?\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'total\s*carb[^s]*\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*g\s*carb',
                r'carbohyrates?\s*(\d+(?:\.\d+)?)',  # Common OCR error
                r'total\s*carbohyrates?\s*(\d+(?:\.\d+)?)'
            ],
            'fat': [
                r'total\s*fat\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'fat\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*g\s*fat',
                r'total\s*fat\s*(\d+(?:\.\d+)?)',
                r'fat\s*(\d+(?:\.\d+)?)g?',  # More flexible pattern
                r'total\s*fat\s*(\d)g'  # Single digit pattern
            ],
            'saturated_fat': [
                r'saturated\s*fat\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'sat\.?\s*fat\s*:?\s*(\d+(?:\.\d+)?)\s*g'
            ],
            'sugar': [
                r'sugars?\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'total\s*sugars?\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*g\s*sugar',
                r'total\s*sugars?\s*(\d+(?:\.\d+)?)',
                r'tal\s*sugars?\s*(\d+(?:\.\d+)?)'  # Common OCR error
            ],
            'sodium': [
                r'sodium\s*:?\s*(\d+(?:\.\d+)?)\s*mg',
                r'salt\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*mg\s*sodium',
                r'sodium\s*(\d+(?:\.\d+)?)',
                r'sedium\s*(\d+(?:\.\d+)?)'  # Common OCR error
            ],
            'fiber': [
                r'dietary\s*fiber\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'fiber\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'fibre\s*:?\s*(\d+(?:\.\d+)?)\s*g',
                r'(\d+(?:\.\d+)?)\s*g\s*fiber'
            ],
            'serving_size': [
                r'serving\s*size\s*:?\s*([^\n\r]+)',
                r'per\s*serving\s*:?\s*([^\n\r]+)',
                r'portion\s*:?\s*([^\n\r]+)'
            ],
            'servings_per_container': [
                r'servings?\s*per\s*container\s*:?\s*(\d+(?:\.\d+)?)',
                r'portions?\s*per\s*pack\s*:?\s*(\d+(?:\.\d+)?)'
            ]
        }
        
        text_lower = text.lower()
        
        for key, pattern_list in patterns.items():
            for pattern in pattern_list:
                match = re.search(pattern, text_lower, re.IGNORECASE)
                if match:
                    try:
                        if key in ['serving_size']:
                            nutritional_data[key] = match.group(1).strip()
                        else:
                            value = float(match.group(1))
                            nutritional_data[key] = value
                        break  # Stop after first successful match for this key
                    except (ValueError, IndexError):
                        continue
        
        return nutritional_data
    
    def detect_food_category(self, text):
        """Detect food category based on text content"""
        text_lower = text.lower()
        
        categories = {
            'Whole Food': ['organic', 'natural', 'fresh', 'whole grain', 'unprocessed'],
            'Whole Grain': ['whole wheat', 'brown rice', 'quinoa', 'oats', 'whole grain'],
            'Lean Protein': ['chicken breast', 'fish', 'salmon', 'turkey', 'lean beef'],
            'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
            'Fast Food': ['fried', 'burger', 'pizza', 'fries', 'fast food'],
            'Prepared Meal': ['frozen', 'microwave', 'ready to eat', 'prepared'],
            'Mixed': []  # Default category
        }
        
        for category, keywords in categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        
        return 'Mixed'
    
    def estimate_processing_level(self, text):
        """Estimate processing level based on ingredients and text"""
        text_lower = text.lower()
        
        # High processing indicators
        high_processing = ['artificial', 'preservatives', 'additives', 'hydrogenated', 
                          'high fructose', 'corn syrup', 'modified', 'processed']
        
        # Low processing indicators
        low_processing = ['organic', 'natural', 'fresh', 'whole', 'unprocessed']
        
        high_score = sum(1 for indicator in high_processing if indicator in text_lower)
        low_score = sum(1 for indicator in low_processing if indicator in text_lower)
        
        # Calculate processing level (1-10, 1=least processed, 10=most processed)
        if low_score > high_score:
            return max(1, 10 - low_score)
        else:
            return min(10, 5 + high_score)
    
    def estimate_nutritional_density(self, nutritional_data):
        """Estimate nutritional density based on nutritional content"""
        if not nutritional_data:
            return 5  # Default middle value
        
        score = 10  # Start with perfect score
        
        # Penalize high sugar
        if 'sugar' in nutritional_data and nutritional_data['sugar'] > 15:
            score -= 3
        elif 'sugar' in nutritional_data and nutritional_data['sugar'] > 10:
            score -= 1
        
        # Penalize high sodium
        if 'sodium' in nutritional_data and nutritional_data['sodium'] > 400:
            score -= 2
        elif 'sodium' in nutritional_data and nutritional_data['sodium'] > 200:
            score -= 1
        
        # Reward high protein
        if 'protein' in nutritional_data and nutritional_data['protein'] > 20:
            score += 1
        
        # Reward high fiber
        if 'fiber' in nutritional_data and nutritional_data['fiber'] > 5:
            score += 1
        
        return max(1, min(10, score))
    
    def read_food_label(self, image_path):
        """Main method to read and analyze food label"""
        try:
            # Validate image path
            if not os.path.exists(image_path):
                return {"error": f"Image file not found: {image_path}"}
            
            # Extract text from image
            print(f"Processing image: {image_path}")
            text = self.extract_text_from_image(image_path)
            
            if not text or len(text.strip()) < 3:
                return {
                    "error": "No readable text found in image",
                    "suggestions": [
                        "Ensure the image is clear and well-lit",
                        "Try a higher resolution image",
                        "Make sure nutrition labels are clearly visible",
                        "Avoid blurry or rotated images"
                    ]
                }
            
            print(f"Extracted text length: {len(text)}")
            
            # Parse nutritional information
            nutritional_data = self.parse_nutritional_info(text)
            
            # If no nutritional data found, provide helpful feedback
            if not nutritional_data:
                return {
                    "error": "No nutritional information detected in text",
                    "extracted_text": text,
                    "suggestions": [
                        "Ensure the nutrition facts panel is clearly visible",
                        "Try cropping the image to focus on the nutrition label",
                        "Make sure text is horizontal and not rotated"
                    ]
                }
            
            print(f"Parsed nutritional data: {nutritional_data}")
            
            # Detect food category
            category = self.detect_food_category(text)
            
            # Estimate processing level
            processing_level = self.estimate_processing_level(text)
            
            # Estimate nutritional density
            nutritional_density = self.estimate_nutritional_density(nutritional_data)
            
            # Calculate per 100g values if serving size is available
            per_100g_data = self.calculate_per_100g(nutritional_data)
            
            return {
                "extracted_text": text,
                "nutritional_data": nutritional_data,
                "per_100g_data": per_100g_data,
                "food_category": category,
                "processing_level": processing_level,
                "nutritional_density": nutritional_density,
                "analysis_complete": True,
                "ocr_confidence": "medium"  # Could be calculated based on text quality
            }
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error in read_food_label: {error_details}")
            return {
                "error": f"Error reading label: {str(e)}",
                "error_type": type(e).__name__,
                "suggestions": [
                    "Check if the image file is corrupted",
                    "Ensure Tesseract OCR is properly installed",
                    "Try with a different image format (PNG, JPG)"
                ]
            }
    
    def calculate_per_100g(self, nutritional_data):
        """Calculate nutritional values per 100g"""
        per_100g = {}
        
        # This is a simplified calculation
        # In reality, you'd need to parse serving size and convert accordingly
        
        for key, value in nutritional_data.items():
            if key not in ['serving_size', 'servings_per_container'] and isinstance(value, (int, float)):
                # Assume standard serving size for calculation
                # You might want to make this more sophisticated
                per_100g[key] = value * 2  # Rough estimate
        
        return per_100g

def main():
    """Test the label reader"""
    reader = FoodLabelReader()
    
    # Test with a sample image (you'll need to provide an actual image)
    # result = reader.read_food_label("sample_food_label.jpg")
    # print(json.dumps(result, indent=2))
    
    print("Food Label Reader initialized successfully!")
    print("Ready to read food labels and extract nutritional information.")

if __name__ == "__main__":
    main()
