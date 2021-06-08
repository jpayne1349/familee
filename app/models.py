# USED FOR DATABASE MODELS
from . import db
import os

# migrate and upgrade after every change

# get the location of this file
basedir = os.path.abspath(os.path.dirname(__file__))
fileStorageFolder = os.path.join(basedir, 'fileStorage')

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    givenName = db.Column(db.String(70), nullable=False) # cannot be empty
    familyName = db.Column(db.String(70)) # can be empty
    dateOfBirth = db.Column(db.String(8)) # YYYYMMDD, unknown == 00's
    dateOfDeath = db.Column(db.String(8)) # YYYYMMDD
    details = db.column(db.String(280))

    # can make the persons folder here... maybe?
    personId = 'person' + id
    personPath = os.path.join(fileStorageFolder, personId)
    os.mkdir(personPath)
    photosFolder = personId + 'photos'
    videosFolder = personId + 'videos'
    photosPath = os.path.join(personPath, photosFolder)
    videosPath = os.path.join(personPath, videosFolder)
    os.mkdir(photosPath)
    os.mkdir(videosPath)
    
class Relation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id_a = db.Column(db.Integer)
    person_id_b = db.Column(db.Integer)
    relation_type = db.Column(db.Integer) # types to probably 0,1,2