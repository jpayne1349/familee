
from flask import Flask
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

# login_manager = LoginManager() # USE FOR LOGIN PAGE IF NEEDED

def create_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object('config.DevelopmentConfig') # grabbing the development config class out of config.py
    # our config file will be located elsewhere

    db.init_app(app)
    migrate.init_app(app, db)

    #login_manager.init_app(app) # USE FOR LOGIN PAGE IF NEEDED

    #login_manager.login_view = 'authorization_bp.login_page' # USE FOR LOGIN PAGE IF NEEDED

    with app.app_context():

        from .main_blueprint import main # giving the app access to this folder and this file

        app.register_blueprint(main.main_blueprint)  # registering the blueprint inside that file

        #from . import models  # USED WHEN DB IS NEEDED

        return app


