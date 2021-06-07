
from flask import Blueprint, render_template, flash

from flask import current_app as app

main_blueprint = Blueprint('main_blueprint', __name__) 


@main_blueprint.route('/')
def homepage():
    return render_template('homepage.html')
