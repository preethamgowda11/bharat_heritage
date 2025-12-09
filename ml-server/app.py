import os
from flask import Flask, request, jsonify
from ultralytics import YOLO
import base64
from PIL import Image
import io
import torch

app = Flask(__name__)

# Load your trained model
# Ensure best.pt is in the same directory
try:
    model = YOLO('best.pt')
    print("Model loaded successfully.")
    # Check for GPU
    if torch.cuda.is_available():
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
        model.to('cuda')
    else:
        print("Using CPU.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/infer', methods=['POST'])
def infer():
    """Endpoint to perform inference."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    if 'image' not in data:
        return jsonify({"error": "No image data provided"}), 400

    try:
        # Decode the base64 image
        image_data = base64.b64decode(data['image'].split(',')[1])
        image = Image.open(io.BytesIO(image_data))

        # Perform inference
        results = model(image, verbose=False)  # Set verbose=False to reduce logs

        predictions = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                confidence = float(box.conf)
                
                # You can filter by confidence threshold if needed
                # if confidence > 0.5:
                predictions.append({
                    "class": class_name,
                    "confidence": confidence,
                    "box": [float(b) for b in box.xyxy[0]]
                })
        
        # Sort by confidence
        predictions.sort(key=lambda x: x['confidence'], reverse=True)

        return jsonify({"predictions": predictions})

    except Exception as e:
        print(f"Inference error: {e}")
        return jsonify({"error": f"An error occurred during inference: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
