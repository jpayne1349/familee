
from flask import Flask
from flask_migrate import Migrate

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object('config.DevelopmentConfig') # grabbing the development config class out of config.py
    # our config file will be located elsewhere

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():

        from .main_blueprint import main # giving the app access to this folder and this file

        app.register_blueprint(main.main_blueprint)  # registering the blueprint inside that file

        #from . import models  # USED WHEN DB IS NEEDED

        return app


