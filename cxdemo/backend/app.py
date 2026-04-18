"""CX Intelligence Platform — Flask API"""

from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    from constants import ALLOWED_ORIGINS, MONGO_URI
    CORS(app, origins="*", supports_credentials=False)

    app.config["MONGO_URI"] = MONGO_URI
    app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    from routes.analysis import analysis_bp
    from routes.sessions import sessions_bp
    from routes.health import health_bp

    app.register_blueprint(analysis_bp, url_prefix="/api/v1/analysis")
    app.register_blueprint(sessions_bp, url_prefix="/api/v1/sessions")
    app.register_blueprint(health_bp, url_prefix="/api/v1")

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 8000))
    app.run(debug=os.getenv("FLASK_DEBUG", "false").lower() == "true", host="0.0.0.0", port=port)
