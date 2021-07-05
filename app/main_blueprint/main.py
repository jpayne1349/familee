
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

@main_blueprint.route('/create_person', methods=['POST'])
def create_person():
    
    # this converts the json to a python dict
    person = request.json

    new_person = Person(givenName = person["givenName"], familyName = person["familyName"], dateOfBirth=person["dateOfBirth"], dateOfDeath=person["dateOfDeath"], details=person["details"], gender=person["gender"])

    db.session.add(new_person)
    db.session.commit()

    print(person)

    if "relation_type" in person:
        # new_person now should have an id..
        # for now, we assume the relation keys will be there as well
        person_a = 0
        person_b = 0
        # determine which person should be a and b
        if(person["person_a_id"] == True):
            person_a = new_person.id
            person_b = person["relation_id"]
        else:
            person_a = person["relation_id"]
            person_b = new_person.id
        
        new_relation = relation_table(relation_type=person["relation_type"], person_a_id=person_a, person_b_id=person_b)
        db.session.add(new_relation)
        db.session.commit()

        json_response = personAndRelationToJson(new_person, new_relation)
        
        return json_response

    # if no relation was included
    json_response = personObjectsToJson([new_person])
    
    return json_response


@main_blueprint.route('/delete_person', methods=['POST'])
def delete_person():
    # this converts the json to a python dict
    person_id = request.json
    id_string = person_id["id"]
    id_number = int(id_string)

    person_a_relations = relation_table.query.filter_by(person_a_id = id_number).all()
    for relation_a in person_a_relations:
        db.session.delete(relation_a)
    db.session.commit()

    person_b_relations = relation_table.query.filter_by(person_b_id=id_number).all()
    for relation_b in person_b_relations:
        db.session.delete(relation_b)
    db.session.commit()

    this_person = Person.query.filter_by(id=id_number).first()
    db.session.delete(this_person)
    db.session.commit()

    return 'deleted'


@main_blueprint.route('/edit_person', methods=['POST'])
def edit_person():

    dict_person = request.json
    
    #lookup
    person_to_edit = Person.query.filter_by(id = dict_person['id']).first()
    person_to_edit.givenName = dict_person['givenName']
    person_to_edit.familyName = dict_person['familyName']
    person_to_edit.dateOfBirth  = dict_person['dateOfBirth']
    person_to_edit.details = dict_person['details']

    db.session.add(person_to_edit)
    db.session.commit()

    return 'edited'

@main_blueprint.route('/remove_relationship', methods=['POST'])
def remove_relationship():
    person_id = request.json
    id_string = person_id["id"]
    id_number = int(id_string)

    person_a_relations = relation_table.query.filter_by(person_a_id = id_number).all()
    for relation_a in person_a_relations:
        db.session.delete(relation_a)
    db.session.commit()

    person_b_relations = relation_table.query.filter_by(person_b_id=id_number).all()
    for relation_b in person_b_relations:
        db.session.delete(relation_b)
    db.session.commit()

    return 'removed'

@main_blueprint.route('/add_relationship', methods=['POST'])
def add_relationship():
    relation_dict = request.json

    new_relation_entry = relation_table(relation_type=relation_dict["relation_type"], person_a_id=relation_dict["person_a_id"], person_b_id=relation_dict["person_b_id"])
    db.session.add(new_relation_entry)
    db.session.commit()
    

    return 'added'
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
def personAndRelationToJson(person, relation):
    dict_list = []
    
    person_dict = {}
    person_dict["id"] = person.id
    person_dict["givenName"] = person.givenName
    person_dict["familyName"] = person.familyName
    person_dict["dateOfBirth"] = person.dateOfBirth
    person_dict["dateOfDeath"] = person.dateOfDeath
    person_dict["details"] = person.details
    person_dict["gender"] = person.gender

    dict_list.append(person_dict)

    relation_dict = {}
    relation_dict["relation_type"] = relation.relation_type
    relation_dict["person_a_id"] = relation.person_a_id
    relation_dict["person_b_id"] = relation.person_b_id

    dict_list.append(relation_dict)

    jsonList = json.dumps(dict_list)
    return jsonList
