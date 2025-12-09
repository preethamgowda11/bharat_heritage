# ML Server Folder

This folder contains the necessary files to build and deploy your Python-based machine learning model to Google Cloud Run.

## Files to Add

1.  **`app.py`**: Your main Python application file (e.g., using Flask or FastAPI) that loads the model and exposes an `/infer` endpoint.
2.  **`best.pt`**: Your trained model weights file.
3.  **`requirements.txt`**: A list of all Python dependencies required to run your application.

## Deployment

This folder is set up to be containerized using the provided `Dockerfile` and deployed using the `cloudbuild.yaml` configuration with Google Cloud Build.

For detailed steps, refer to the main project README or the instructions provided in the application.
