import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
from werkzeug.utils import secure_filename
from label_reader import FoodLabelReader

app = Flask(__name__)

# Configure CORS for production
if os.getenv('FLASK_ENV') == 'production':
    # In production, only allow your frontend domain
    CORS(app, origins=[
        "https://your-frontend-domain.com",
        "https://your-frontend-domain.vercel.app"
    ])
else:
    # In development, allow all origins
    CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'temp_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize the OCR label reader
label_reader = FoodLabelReader()

try:
    print("Loading model and encoders...")
    model = pickle.load(open("models/food_analysis_model.pkl", "rb"))
    label_encoder_y = pickle.load(open("models/food_label_encoder_y.pkl", "rb"))
    label_encoders = pickle.load(open("models/food_feature_encoders.pkl", "rb"))
    feature_cols = pickle.load(open("models/food_feature_names.pkl", "rb"))
    food_db = pd.read_csv("data/food_database_fixed.csv")
    print("✅ Model and encoders loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model or data: {e}")

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_health_score(nutritional_data):
    """Calculate a health score based on nutritional information"""
    score = 50  # Base score
    
    # Positive factors
    if 'protein' in nutritional_data and nutritional_data['protein'] > 10:
        score += 10
    if 'fiber' in nutritional_data and nutritional_data['fiber'] > 3:
        score += 15
    
    # Negative factors
    if 'sugar' in nutritional_data:
        if nutritional_data['sugar'] > 20:
            score -= 20
        elif nutritional_data['sugar'] > 10:
            score -= 10
    
    if 'sodium' in nutritional_data:
        if nutritional_data['sodium'] > 500:
            score -= 15
        elif nutritional_data['sodium'] > 300:
            score -= 10
    
    return max(0, min(100, score))

def get_processing_level_text(level):
    """Convert processing level number to text"""
    if level <= 3:
        return "Unprocessed"
    elif level <= 5:
        return "Minimally Processed"
    elif level <= 7:
        return "Processed"
    else:
        return "Ultra-processed"

def generate_recommendations(nutritional_data, category, processing_level):
    """Generate health recommendations based on analysis"""
    recommendations = []
    
    if 'sugar' in nutritional_data and nutritional_data['sugar'] > 15:
        recommendations.append("High sugar content - consider consuming in moderation")
    
    if 'sodium' in nutritional_data and nutritional_data['sodium'] > 400:
        recommendations.append("High sodium content - be mindful of daily intake")
    
    if 'fiber' in nutritional_data and nutritional_data['fiber'] > 3:
        recommendations.append("Good source of dietary fiber")
    
    if 'protein' in nutritional_data and nutritional_data['protein'] > 10:
        recommendations.append("Good protein content")
    
    if processing_level <= 3:
        recommendations.append("Minimally processed food - a healthy choice")
    elif processing_level > 7:
        recommendations.append("Highly processed - consider whole food alternatives")
    
    if not recommendations:
        recommendations.append("Moderate nutritional profile - part of a balanced diet")
    
    return recommendations

@app.route("/api/scan_label", methods=["POST"])
def scan_label():
    """OCR endpoint to scan food labels and extract nutritional information"""
    try:
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Please upload PNG, JPG, JPEG, GIF, or BMP files"}), 400
        
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Use the label reader to process the image
            result = label_reader.read_food_label(filepath)
            
            # Clean up the uploaded file
            os.remove(filepath)
            
            if "error" in result:
                return jsonify(result), 400
            
            # Extract nutritional information
            nutritional_data = result.get('nutritional_data', {})
            processing_level = result.get('processing_level', 5)
            category = result.get('food_category', 'Mixed')
            
            # Calculate health score
            health_score = calculate_health_score(nutritional_data)
            
            # Get processing level text
            processing_text = get_processing_level_text(processing_level)
            
            # Generate recommendations
            recommendations = generate_recommendations(nutritional_data, category, processing_level)
            
            # Format response to match frontend expectations
            response = {
                "name": f"Scanned Food Product ({category})",
                "confidence": 85,  # OCR confidence could be calculated based on text quality
                "nutritional_info": {
                    "calories": int(nutritional_data.get('calories', 0)),
                    "protein": float(nutritional_data.get('protein', 0)),
                    "carbohydrates": float(nutritional_data.get('carbohydrates', nutritional_data.get('carbs', 0))),
                    "fat": float(nutritional_data.get('fat', 0)),
                    "fiber": float(nutritional_data.get('fiber', 0)),
                    "sugar": float(nutritional_data.get('sugar', 0)),
                    "sodium": float(nutritional_data.get('sodium', 0))
                },
                "health_score": health_score,
                "processing_level": processing_text,
                "recommendations": recommendations,
                "raw_data": result  # Include raw OCR results for debugging
            }
            
            return jsonify(response)
            
        except Exception as e:
            # Clean up file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500
            
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/api/search_food", methods=["GET"])
def search_food():
    query = request.args.get("query", "")
    matches = food_db[food_db['Food_Name'].str.lower().str.contains(query.lower(), na=False)]
    return matches[['Food_Name', 'Food_Category', 'Calories_per_100g']].head(10).to_json(orient="records")

@app.route("/api/analyze_food", methods=["POST"])
def analyze_food():
    data = request.json
    food_name = data.get("food_name")
    nutritional_data = data.get("nutritional_data")

    # If food_name is given, get its data from DB
    if food_name:
        row = food_db[food_db['Food_Name'].str.lower() == food_name.lower()]
        if not row.empty:
            nutritional_data = row.iloc[0][feature_cols].to_dict()

    if nutritional_data is None:
        return jsonify({"error": "No nutritional data provided"}), 400

    # Prepare DataFrame
    df = pd.DataFrame([nutritional_data])
    # Encode categorical features
    for col in df.select_dtypes(include=["object"]).columns:
        if col in label_encoders:
            le = label_encoders[col]
            df[col] = le.transform(df[col].astype(str))

    # Predict
    pred = model.predict(df[feature_cols])
    probabilities = model.predict_proba(df[feature_cols])[0]
    max_prob = max(probabilities)
    predicted_disease = label_encoder_y.inverse_transform(pred)[0]
    all_probs = dict(zip(label_encoder_y.classes_, probabilities))

    return jsonify({
        "food_name": food_name or nutritional_data.get("Food_Name", "Unknown"),
        "predicted_disease": predicted_disease,
        "confidence": max_prob,
        "all_probabilities": all_probs
    })

@app.route("/")
def home():
    return "Food Scanner API is running!"

@app.route("/health")
def health_check():
    return jsonify({"status": "healthy", "message": "Food Scanner API is running"})

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production'
    
    print(f"🚀 Starting Food Scanner API on port {port}...")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)