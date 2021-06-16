

import os


basedir = os.path.abspath(os.path.dirname(__file__)) # using this package to find the location of this file, to be used later when locating the database file


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = "B\xb2?.\xdf\x9f\xa7m\xf8\x8a%,\xf7\xc4\xfa\x91"


    SESSION_COOKIE_SECURE = True

class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL') or "postgresql://jpayne:baseball13@localhost:5432/family_tree"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_COOKIE_SECURE = False

class TestingConfig(Config):

    TESTING = True


    SESSION_COOKIE_SECURE = False
