# USED FOR DATABASE MODELS
from . import db
import os

# migrate and upgrade after every change

# get the location of this file
basedir = os.path.abspath(os.path.dirname(__file__))
fileStorageFolder = os.path.join(basedir, 'fileStorage')

class relation_table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    relation_type = db.Column(db.Integer)
    # 0 parent to child, 1 child to child, 2 parent to parent
    person_a_id = db.Column(db.Integer, db.ForeignKey('person.id')) # PERSON A IS ALWAYS PARENT
    person_b_id = db.Column(db.Integer)

class Person(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    givenName = db.Column(db.String(70), nullable=False) # cannot be empty
    familyName = db.Column(db.String(70)) # can be empty
    dateOfBirth = db.Column(db.String(8)) # YYYYMMDD, unknown == 00's
    dateOfDeath = db.Column(db.String(8)) # YYYYMMDD
    details = db.Column(db.String(280))
    gender = db.Column(db.Integer) # 0 for female, 1 for male
        
    relationships = db.relationship('relation_table', backref='owner', lazy=True)


    def __repr__(self):
        return f'{self.givenName}, id = {self.id}'
    
    #person.createFolders(person.id) // has to be done after session.commit
    def createFolders(self, uniqueId):
        personId = 'person' + str(uniqueId)
        personPath = os.path.join(fileStorageFolder, personId)
        os.mkdir(personPath)
        photosFolder = personId + 'photos'
        videosFolder = personId + 'videos'
        photosPath = os.path.join(personPath, photosFolder)
        videosPath = os.path.join(personPath, videosFolder)
        os.mkdir(photosPath)
        os.mkdir(videosPath)


