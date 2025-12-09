# ML Server Folder

This folder is set up to containerize and deploy your Python-based machine learning model to Google Cloud Run.

## Your Files

Please add your three trained model files to this directory:

1.  **`app.py`**: Your main Python application file (e.g., using Flask or FastAPI) that loads your model and exposes an `/infer` endpoint.
2.  **`best.pt`**: Your trained model weights file.
3.  **`requirements.txt`**: A list of all Python dependencies required to run your application.

Once you have added these files, you can proceed with deploying the model to Cloud Run.
