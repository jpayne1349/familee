
from flask import Blueprint, render_template, flash, request

from flask import current_app as app
from app import db
from app.models import Person, relation_table
import json

main_blueprint = Blueprint('main_blueprint', __name__) 


@main_blueprint.route('/')
def homepage():
    # need to import some db stuff and load the info, for a start
    # later this will be done in an AJAX Post request?
    
    
    return render_template('homepage.html')

@main_blueprint.route('/database_person_all', methods=['POST'])
def pull_all_person():    
    all_people = Person.query.all()
    jsonList = personObjectsToJson(all_people)
    return jsonList

@main_blueprint.route('/database_relation_all', methods=['POST'])
def pull_all_relation():
    all_relations = relation_table.query.all()
    jsonList = relationObjectsToJson(all_relations)
    return jsonList

# turns the database objects into a python dictionary, which can be converted to JSON
# TODO: manual input of the attributes was required. Maybe it's not neccessary? the properties of an object can be collected in a loop? 
def personObjectsToJson(person_list):
    # so take the list and loop over it
    dict_list = []
    # create a dict for each person
    for person in person_list:
        # need to create all the json 
        person_dict = {}
        person_dict["id"] = person.id
        person_dict["givenName"] = person.givenName
        person_dict["familyName"] = person.familyName
        person_dict["dateOfBirth"] = person.dateOfBirth
        person_dict["dateOfDeath"] = person.dateOfDeath
        person_dict["details"] = person.details
        person_dict["gender"] = person.gender
        # person_dict["relationships"] = person.relationships # can't use rn, because it appends relation_table objects to the dict

        dict_list.append(person_dict)

    jsonList = json.dumps(dict_list)
    return jsonList
def relationObjectsToJson(relation_list):
    # so take the list and loop over it
    dict_list = []
    # create a dict for each person
    for relation in relation_list:
        # need to create all the json
        relation_dict = {}
        relation_dict["relation_type"] = relation.relation_type
        relation_dict["person_a_id"] = relation.person_a_id
        relation_dict["person_b_id"] = relation.person_b_id


        dict_list.append(relation_dict)

    jsonList = json.dumps(dict_list)
    return jsonList
