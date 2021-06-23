// TODO: add ability to assign a relationship within create person
    // includes either another ajax call, or rewriting the existing
    // or no.. just include more info in the json request for create_person. 
    // to be deciphered on python end.
    // whether or not to call relation_table() etc...

    // next display people who arent in the tree
    // add a way to modify their profile

    // add DELETE person ability, maybe within their profile view.




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
        this.cardNumber;
        this.parentCardSet = false;
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


// call when needing to add a person to the database
// rough for the first iteration
function create_new_person() {
    // perform a check to see if this form is already available?



    // maybe we just have a popup for now. just something quick
    let container = document.createElement('div');
    let form_holder = document.createElement('form');
    form_holder.name = 'create_person';
    form_holder.setAttribute('onsubmit', 'event.preventDefault();');
    let form_title = document.createElement('div');
    

    let gName_div = document.createElement('div');
    let gName_input = document.createElement('input');
    gName_input.type = 'text';
    gName_input.autocomplete = 'off';
    gName_input.placeholder = 'Given Name - required';
    gName_div.appendChild(gName_input);
    form_holder.appendChild(gName_div);
    
    let fName_div = document.createElement('div');
    let fName_input = document.createElement('input');
    fName_input.type = 'text';
    fName_input.autocomplete = 'off';
    fName_input.placeholder = 'Family Name';
    fName_div.appendChild(fName_input);
    form_holder.appendChild(fName_div);

    let gender_div = document.createElement('div');
    let gender_male = document.createElement('input');
    let male_label = document.createElement('label');
    gender_male.id = 'male_radio';
    gender_male.value = 1;
    male_label.for = 'male_radio';
    male_label.innerText = 'Male';
    gender_male.type = 'checkbox';

    let gender_female = document.createElement('input');
    let female_label = document.createElement('label');
    gender_female.id = 'female_radio';
    gender_female.value = 0;
    female_label.for = 'female_radio';
    female_label.innerText = 'Female';
    gender_female.type = 'checkbox';

    gender_div.append(gender_male, male_label, gender_female, female_label);
    form_holder.appendChild(gender_div);

    let dob_div = document.createElement('div');
    let date_of_birth = document.createElement('input');
    date_of_birth.type = 'date';
    date_of_birth.autocomplete = 'off';
    date_of_birth.placeholder = 'Date of Birth';
    dob_div.appendChild(date_of_birth);
    form_holder.appendChild(dob_div);

    let dod_div = document.createElement('div');
    let date_of_death = document.createElement('input');
    date_of_death.type = 'date';
    date_of_death.autocomplete = 'off';
    date_of_death.placeholder = 'Date of Death';
    dod_div.appendChild(date_of_death);
    form_holder.appendChild(dod_div);

    let details_div = document.createElement('div');
    let details = document.createElement('input');
    details.type = 'text';
    details.autocomplete = 'off';
    details.placeholder = 'Details';
    details_div.appendChild(details);
    form_holder.appendChild(details_div);

    let create_div = document.createElement('div');
    let create_button = document.createElement('button');
    create_button.innerText = 'Create';
    create_div.appendChild(create_button);
    form_holder.appendChild(create_div);
    create_button.addEventListener('click', validate_and_post);



    // all these are put in the container and the container added to the screen
    // obviously they need names and what not
    
    
    container.appendChild(form_holder);

    page.appendChild(container);


    function validate_and_post() {

        if(checkRequiredFields()) {
            

            // and we create the person object in javascript here.
            // assuming that the database operation happens correctly
            // maybe we do the database entry, and then on the response we create the javascript Person
            let new_person_object = {};
            new_person_object.givenName = gName_input.value;
            new_person_object.familyName = fName_input.value;
            new_person_object.dateOfBirth = date_of_birth.value;
            new_person_object.dateOfDeath = date_of_death.value;
            new_person_object.details = details.value;
            if(gender_male.checked == true) {
                new_person_object.gender = 1;
            } else {
                new_person_object.gender = 0;
            }
            
            let json_string = JSON.stringify(new_person_object);

            console.log(new_person_object);

            // post section
            var ajax_request = new XMLHttpRequest();
            ajax_request.onload = function() {
                var json_string = this.response;
                js_array = JSON.parse(json_string);
        
                js_array.forEach( function(json_object) {
                    var person_instance = new Person(json_object);

                    PERSON_ARRAY.push(person_instance);
                } );

                // next up is the addition of relationship, on create person maybe.
                
            };

            

            ajax_request.open("POST", "/create_person");
            ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
            ajax_request.send(json_string);

            return false
        
        }

        function checkRequiredFields() {
            let required_bool = true;
            console.log(gName_input.value);
            console.log(gender_male.checked);
            console.log(gender_female.checked);


            if(!gName_input.value) {
                // set givenName outline to red
                gName_input.style.borderColor = 'orangered';
                required_bool = false;
            }
            if(gender_male.checked == false && gender_female.checked == false) {
                male_label.style.color = 'orangered';
                female_label.style.color = 'orangered';
                required_bool = false;
            }

            if(gender_male.checked == true && gender_female.checked == true) {
                gender_male.checked = false;
                gender_female.checked = false;
                male_label.style.color = 'orangered';
                female_label.style.color = 'orangered';
                required_bool = false;
            }
            
            return required_bool
        }
        
    }

}

// being called after all database info has been loaded. 
// builds html elements and assigns css order values to organize visuals
function build_tree(selected_person) {

    // empty buffer
    let person_buffer = []; 

    // gonna set the branchLevel of the root person outside of the loop
    selected_person.branchLevel = 1;
    // card number locates left to right within branch
    selected_person.cardNumber = 1;

    // put the root person into the buffer to be processed first
    person_buffer.push(selected_person);

    // use array.length to determine if their are still people in the buffer
    while (person_buffer.length > 0) {
        // choose the person from the buffer
        let person_to_build = person_buffer[0];

        // make the card and possibly the branch. append card to branch
        let their_branch = person_to_build.get_branch(person_to_build.branchLevel);
        let their_card = person_to_build.get_card('box');
        their_card.style.order = person_to_build.cardNumber;
        their_branch.appendChild(their_card);

        // loop their siblings and add them
        for( let sibling of person_to_build.siblings ) {
            let sib_card = sibling.get_card('circle');
            their_card.appendChild(sib_card);
        }

        // loop through their parents and set their branchLevel & cardNumber, and add them to the buffer
        for( let parent of person_to_build.parents ) {
            parent.branchLevel = person_to_build.branchLevel + 1;
            
            if( person_to_build.parentCardSet == false ) {
                parent.cardNumber = (person_to_build.cardNumber * 2) - 1;
                person_to_build.parentCardSet = true;
            } else {
                parent.cardNumber = person_to_build.cardNumber * 2;
            }

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
button.addEventListener('click', create_new_person);
button.className = 'button';
button.innerText = 'create person';
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


