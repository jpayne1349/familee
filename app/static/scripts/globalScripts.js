// TODO: rethinking how to display..
    // only build display cards for the people considered 'direct' to the root
    // basically only build cards for parents. parents of parents. etc.
    // all cards tho, should include any sibling relationships, no matter what.

    // in the future, building out a tree based on someone with children will be more difficult.

    // so every person is a 'Person' object.

    // we cant check for everyone at this point? right
    // we have to check the root for children..
    // if none, that's good. it will be the base.




// global storage
var PERSON_ARRAY = [];

var RELATION_ARRAY = [];

var tree_container = document.getElementById('tree_container');

// run on page load?
function main() {
    // this calls everything else right now!
    get_person_list();    

}


main();

// i think person structures and prototypes are the way to go
class Person {

    constructor(javascript_object = {}) {
        Object.assign(this, javascript_object); // this is a neat way of converting the js object properties to 'this'
        this.siblings = [];
        this.children = [];
        this.parents = [];
        this.partners = [];
        this.hasChildren = false;

        this.branchLevel;
        this.hasIcon = false;
        this.iconHolder;
    }

    // class methods for most things, remember to use 'this'
    add_parent(selected_person) {
        this.parents.push(selected_person);
    }
    add_child(selected_person) {
        this.children.push(selected_person);
        this.hasChildren = true;
    }
    add_sibling(selected_person) {
        this.siblings.push(selected_person);
    }
    add_partner(selected_person) {
        this.partners.push(selected_person);
    }

    // returns an html element to be used as a linker to the person's data
    // 
    get_card(displayType) {
        
        if(this.hasIcon == true) {
            return this.iconHolder;
        }
        var container = document.createElement('div');
        container.id = this.id;
        container.className = 'person';
        container.innerText = this.givenName;
        this.hasIcon = true;
        this.iconHolder = container; // store the newly created element with the person

        // assign a border color or gender
        if(this.gender == 'male') {
            container.classList.add('blue');
        } else if (this.gender == 'female') {
            container.classList.add('pink');
        } else {
            container.classList.add('orange');
        }
        
        // specify if a circle or box
        if( displayType == 'box' ) {
            container.classList.add('box');
        } else {
            container.classList.add('circle');
        }
        
        return container
    }

    // return a document element with corresponding branch number as the css order value
    get_branch(branch_number) {
      
        var all_branches = document.getElementsByClassName('branch');

        // search for existing branch with this order number
        for( let existing_branch of all_branches) {
            
            if(existing_branch.style.order == branch_number) {
                return existing_branch
            }
        }

        // otherwise make a new one with that branch number ... and add it to the tree container
        var branch_container = document.createElement('div');
        branch_container.className = 'branch';
        branch_container.style.order = branch_number;
        tree_container.appendChild(branch_container);
        return branch_container;

    }

}


function build_tree(selected_person) {

    // empty buffer
    let person_buffer = []; 

    // gonna set the branchLevel of the root person outside of the loop
    selected_person.branchLevel = 1;

    // put the root person into the buffer to be processed first
    person_buffer.push(selected_person);

    // use array.length to determine if their are still people in the buffer
    while (person_buffer.length > 0) {
        // choose the person from the buffer
        let person_to_build = person_buffer[0];

        // make the card and possibly the branch. append card to branch
        // also need an elegant way to assign an order:value in css for each actual card.
        let their_branch = person_to_build.get_branch(person_to_build.branchLevel);
        let their_card = person_to_build.get_card('box');
        their_branch.appendChild(their_card);

        // loop their siblings and add them
        for( let sibling of person_to_build.siblings ) {
            let sib_card = sibling.get_card('circle');
            their_card.appendChild(sib_card);
        }

        // loop through their parents and set their branchLevel, and add them to the buffer
        for( let parent of person_to_build.parents ) {
            parent.branchLevel = person_to_build.branchLevel + 1;
            person_buffer.push(parent);
        }

        // use splice (index, num of things to remove) to remove this person from the buffer
        person_buffer.splice(0, 1);
        // should remove 1 item starting at index zero

    }
    

}

// used to update the current properties of people in a relation entry
function create_relationship(relation_entry_object) {

    switch(relation_entry_object.relation_type) {

        // PERSON A IS ALWAYS THE PARENT
        case 0: // parent to child
                var parent = person_from_id(relation_entry_object.person_a_id);
                var child = person_from_id(relation_entry_object.person_b_id);
                parent.add_child(child);
                child.add_parent(parent);
            break;

        case 1: // child to child
                var child_a = person_from_id(relation_entry_object.person_a_id);
                var child_b = person_from_id(relation_entry_object.person_b_id);
                child_a.add_sibling(child_b);
                child_b.add_sibling(child_a);
            break;

        case 2: // parent to parent
                var parent_a = person_from_id(relation_entry_object.person_a_id);
                var parent_b = person_from_id(relation_entry_object.person_a_id);
                parent_a.add_partner(parent_b);
                parent_b.add_partner(parent_a);
            break;

        default:
            throw "Relation Type Out of Bounds";
    }
    console.log('relationship created');
    console.log(PERSON_ARRAY);
}
    
// loops the person array and returns the person object
function person_from_id(id) {
    var i;
    var len = PERSON_ARRAY.length;
    for ( i = 0; i < len; i++ ) {
        if(PERSON_ARRAY[i].id == id) {
            return PERSON_ARRAY[i]
        }
    }
}

// AJAX call to get all persons in database // also updates global array right now
function get_person_list() {

    var ajax_request = new XMLHttpRequest();
    ajax_request.onload = function() {

        var json_string = this.response;
        js_array = JSON.parse(json_string);

        js_array.forEach( function(json_object) {
            var person_instance = new Person(json_object);

            PERSON_ARRAY.push(person_instance);
        } );

        get_relation_list();
        
    } ;
    ajax_request.open("POST", "/database_person_all");
    ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
    ajax_request.send(); 
    // JSON.stringify({name:"John Rambo", time:"2pm"}) // example of sending json to server

}

// AJAX call to get all relations in table // also updates global array right now
function get_relation_list() {

    var ajax_request = new XMLHttpRequest();
    ajax_request.onload = function() {
        //replaces current array...
        RELATION_ARRAY = JSON.parse(this.response);
        
        RELATION_ARRAY.forEach(create_relationship);

        build_tree(PERSON_ARRAY[0]);

    } ;
    ajax_request.open("POST", "/database_relation_all");
    ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
    ajax_request.send(); 
    // JSON.stringify({name:"John Rambo", time:"2pm"}) // example of sending json to server

}


var page = document.body;

var button = document.createElement('button');
//button.addEventListener('click', get_person_list);
button.className = 'button';
button.innerText = 'test button';
page.appendChild(button);

var button2 = document.createElement('button');
//button2.addEventListener('click', get_relation_list);
button2.className = 'button';
button2.innerText = 'test button';
page.appendChild(button2);

var button3 = document.createElement('button');
//button3.addEventListener('click', function() { RELATION_ARRAY.forEach(create_relationship); });
button3.className = 'button';
button3.innerText = 'test button';
page.appendChild(button3);


