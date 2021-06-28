// TODO: 
    // i like the idea of wide cards in desktop and tall cards in mobile.
    //
    // i also think it would be necessary to allow movement within the tree container.
    // so you can keep the cards large enough to see
    //
    // also like the idea of adding memories to the person object. like time period, and description. maybe a picture.
    //
    // probably could make a profile photo type placeholder. where your initials get placed in if
    // you don't have a profile photo set yet.
    //
    //
    

    // what happens when you delete the root?
    // fix the root selection, or allow the user to do it.

    //

    // 
    // add a way to modify their profile



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
        // list of js properties assigned
        // this.id,
        // this.givenName,
        // this.familyName,
        // this.dateOfBirth,
        // this.dateOfDeath,
        // this.details,
        // this.gender,
        this.siblings = [];
        this.children = [];
        this.parents = [];
        this.partners = [];
        this.hasChildren = false;

        this.branchLevel;
        this.cardNumber;
        this.hasCard = false;
        this.cardHolder;
        this.assignedRoot = false;
        this.sibling_div;

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
    remove_relationship(selected_person) {
        if(this.parents.includes(selected_person)) {
            let n = this.parents.indexOf(selected_person);
            this.parents.splice(n, 1);
        }
        if(this.children.includes(selected_person)) {
            let n = this.children.indexOf(selected_person);
            this.children.splice(n, 1);
        }
        if(this.siblings.includes(selected_person)) {
            let n = this.siblings.indexOf(selected_person);
            this.siblings.splice(n, 1);
        }
        if(this.partners.includes(selected_person)) {
            let n = this.partners.indexOf(selected_person);
            this.partners.splice(n, 1);
        }
    }

    // used for deletion of this Person instance and associated relationships
    
    // returns an html element to be used as a linker to the person's data
    create_card() {
        
        if(this.hasCard == true) {
            return this.cardHolder;
        }
        var card_container = document.createElement('div');
        card_container.className = 'card';
        card_container.id = this.id;
        this.hasCard = true;
        this.cardHolder = card_container; // store the newly created element with the person

        var profile_icon = document.createElement('img');
        profile_icon.className = 'profile_icon';
        profile_icon.src = 'static/profile_icon.png';
        profile_icon.addEventListener('click', function() {
            // pull up an editing view for the person?

        });

        var person_options = document.createElement('div');
        person_options.className = 'person_options';
        person_options.innerText = 'test';

        var dot_menu = document.createElement('div');
        dot_menu.className = 'dot_menu';
        dot_menu.addEventListener('click', function() {
            // toggle person_options
            if( person_options.style.display == 'none') {
                person_options.style.display = 'block';
                person_options.style.opacity = '1';
            } else {
                person_options.style.display = 'none';
                person_options.style.opacity = '0';
            }
        });

        var dot1 = document.createElement('div');
        dot1.className = 'dot';
        var dot2 = document.createElement('div');
        dot2.className = 'dot';
        var dot3 = document.createElement('div');
        dot3.className = 'dot';

        dot_menu.append(dot1,dot2,dot3);

        var delete_div = document.createElement('div');
        delete_div.className = 'delete_cardholder';
        delete_div.innerText = 'X';

        delete_div.addEventListener('click', function() {
            var owner = delete_div.parentElement;

            delete_person(owner.id);
        });

        var person_div = document.createElement('div');
        //person_div.id = this.id;
        person_div.className = 'person_div';
        person_div.innerText = this.givenName;

        var sibling_div = document.createElement('div');
        sibling_div.className = 'sibling_div';
        this.sibling_div = sibling_div;

        card_container.append(profile_icon, dot_menu, person_options, person_div, sibling_div);

        // assign a border color or gender
        
        if(this.gender == 1) {
            card_container.classList.add('blue');
        } else if (this.gender == 0) {
            card_container.classList.add('pink');
        } else {
            card_container.classList.add('orange');
        }
        
        return card_container

    }

    // return a js object holding a branch and leaves as properties
    create_branch(branch_number) {
        
        var branch_object = {
            branch: undefined,
            leaves: []
        };

        var all_branches = document.getElementsByClassName('branch');

        // search for existing branch with this order number
        for( let existing_branch of all_branches) {
            
            if(existing_branch.style.order == branch_number) {
                branch_object.branch = existing_branch;

                for ( let leaf of existing_branch.children ) {
                    branch_object.leaves.push(leaf);
                }

                return branch_object
            }
        }

        // otherwise make a new one with that branch number ... and add it to the tree container
        var branch_container = document.createElement('div');
        branch_container.className = 'branch';
        branch_container.style.order = branch_number;
        
       

        // create leaves
        if( branch_number > 2 ) {
            // this is exponential based on value above branch 2
            // number 2 to the power of the branch numberish
            var leaf_count = Math.pow( 2 , (branch_number - 2) );

            var flex_basis = 100 / leaf_count;

            // make the leaves and add them to the branch
            for( let leaf = 0; leaf < leaf_count; leaf++ ) {
                var new_leaf = document.createElement('div');
                new_leaf.className = 'leaf';
                new_leaf.style.flexBasis = flex_basis + '%';
                new_leaf.style.justifyContent = 'space-around';
                branch_container.appendChild(new_leaf);
                branch_object.leaves.push(new_leaf);
            }
        } else {
            var only_leaf = document.createElement('div');
            only_leaf.className = 'leaf';
            if( branch_number == 2 ) {
                only_leaf.style.flexBasis = '100%';
                only_leaf.style.justifyContent = 'space-around';
            }
            branch_container.appendChild(only_leaf);
            branch_object.leaves.push(only_leaf);
        }


        tree_container.appendChild(branch_container);
        
        branch_object.branch = branch_container;

        return branch_object;

    }

    // returns a sibling icon element, to be used when adding sibling to a card
    sibling_icon() {
        // search if existing first
        if(this.hasCard == true) {
            // point to existing
            return this.cardHolder
        }

        var sibling_icon = document.createElement('div');
        sibling_icon.className = 'sibling_icon';
        sibling_icon.id = this.id;

        var delete_icon = document.createElement('div');
        delete_icon.className = 'delete_sibling';
        delete_icon.innerText = 'X';
        delete_icon.addEventListener('click', function() { 
            var parent = this.parentElement;
            parent.remove();
            delete_person(parent.id);
        });

        

        var initials_array = [];
        var names_array = this.givenName.split(' ');
        names_array.forEach(function(word) {
            var first_letter = word.slice(0,1);
            initials_array.push(first_letter);
        });
        var join_string = initials_array.join('.');
        var last_period = '.';
        var initials = join_string.concat(last_period);
        
        sibling_icon.innerText = initials;

        sibling_icon.appendChild(delete_icon);
        
        return sibling_icon
    }
}

// to delete this person from all javascript and post AJAX to remove from db
function delete_person(id) {
        
        let person_object = person_from_id(id);

        // removal from relation array
        for( let entry of RELATION_ARRAY) {
            if( entry.person_a_id == id) {
                // person b must be sifted

                let relative = person_from_id(entry.person_b_id);
                relative.remove_relationship(person_object);

                let index = RELATION_ARRAY.indexOf(entry);
                RELATION_ARRAY.splice(index, 1);
            } else if ( entry.person_b_id == id ) {

                let relative = person_from_id(entry.person_a_id);
                relative.remove_relationship(person_object);

                let index = RELATION_ARRAY.indexOf(entry);
                RELATION_ARRAY.splice(index, 1);
            }
        }
    
        // removal from PERSON_ARRAY
        for( let person of PERSON_ARRAY) {
            if( person.id == id) {
                let index = PERSON_ARRAY.indexOf(person);
                PERSON_ARRAY.splice(index, 1);
            }
        }
        
        // remove html element - changed to be done in onclick function
        //var persons_element = document.getElementById(id);
        //persons_element.remove();


        // build json to send POST
        var person_id = {}
        person_id.id = id;
       
        var json_string = JSON.stringify(person_id);

        var ajax_request = new XMLHttpRequest();
        ajax_request.open("POST", "/delete_person");
        ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
        ajax_request.send(json_string);
        ajax_request.onload = function() {
            // all javascript should be updated.
            // reload
            update_tree();
        };

    }

// call when needing to add a person to the database
function create_new_person() {
    // perform a check to see if this form is already available?

    // maybe we just have a popup for now. just something quick
    let container = document.createElement('div');
    container.id = 'create_person_container';

    let form_holder = document.createElement('form');
    form_holder.name = 'create_person';
    form_holder.setAttribute('onsubmit', 'event.preventDefault();');
    form_holder.id = 'create_person_form';

    let close_form_button = document.createElement('button');
    close_form_button.id = 'close_form_button';
    close_form_button.addEventListener('click', function(){ container.remove(); });
    close_form_button.innerText = 'X';
    form_holder.appendChild(close_form_button);
    
    let form_title = document.createElement('h1');
    form_title.innerText = 'Create a New Person';
    form_holder.appendChild(form_title);
    

    let gName_div = document.createElement('div');
    gName_div.className = 'input_div';
    let gName_input = document.createElement('input');
    gName_input.className = 'text_input';
    gName_input.autofocus = true;
    gName_input.type = 'text';
    gName_input.autocomplete = 'off';
    gName_input.placeholder = 'Given Name - required';
    gName_div.appendChild(gName_input);
    form_holder.appendChild(gName_div);
    
    let fName_div = document.createElement('div');
    fName_div.className = 'input_div';
    let fName_input = document.createElement('input');
    fName_input.className = 'text_input';
    fName_input.type = 'text';
    fName_input.autocomplete = 'off';
    fName_input.placeholder = 'Family Name';
    fName_div.appendChild(fName_input);
    form_holder.appendChild(fName_div);

    let gender_div = document.createElement('div');
    gender_div.className = 'input_div radio_div';
    let gender_male = document.createElement('input');
    gender_male.className = 'radio_input';
    let male_label = document.createElement('label');
    male_label.className = 'input_label';
    gender_male.id = 'male_radio';
    gender_male.value = 1;
    male_label.for = 'male_radio';
    male_label.innerText = 'Male';
    gender_male.type = 'checkbox';

    let gender_female = document.createElement('input');
    gender_female.className = 'radio_input';
    let female_label = document.createElement('label');
    female_label.className = 'input_label';
    gender_female.id = 'female_radio';
    gender_female.value = 0;
    female_label.for = 'female_radio';
    female_label.innerText = 'Female';
    gender_female.type = 'checkbox';

    gender_div.append(gender_male, male_label, gender_female, female_label);
    form_holder.appendChild(gender_div);

    let dob_div = document.createElement('div');
    dob_div.className = 'input_div';
    let dob_label = document.createElement('label');
    dob_label.className = 'input_label';
    dob_label.innerText = 'Date of Birth';
    let date_of_birth = document.createElement('input');
    date_of_birth.className = 'date_input';
    date_of_birth.type = 'date';
    date_of_birth.autocomplete = 'off';
    date_of_birth.placeholder = 'Date of Birth';
    dob_div.append(date_of_birth, dob_label);
    form_holder.appendChild(dob_div);

    let dod_div = document.createElement('div');
    dod_div.className = 'input_div';
    let dod_label = document.createElement('label');
    dod_label.className = 'input_label';
    dod_label.innerText = 'Date of Death';
    let date_of_death = document.createElement('input');
    date_of_death.className = 'date_input';
    date_of_death.type = 'date';
    date_of_death.autocomplete = 'off';
    date_of_death.placeholder = 'Date of Death';
    dod_div.append(date_of_death, dod_label);
    form_holder.appendChild(dod_div);

    let details_div = document.createElement('div');
    details_div.className = 'input_div';
    let details = document.createElement('input');
    details.className = 'text_input';
    details.type = 'text';
    details.autocomplete = 'off';
    details.placeholder = 'Details';
    details_div.appendChild(details);
    form_holder.appendChild(details_div);

    if( PERSON_ARRAY.length > 0) {
        let relation_div = document.createElement('div');
        relation_div.className = 'input_div';
        let relation_type_label = document.createElement('label');
        relation_type_label.className = 'input_label';
        relation_type_label.innerText = 'This is a ';
        let relation_type_select = document.createElement('select');
        relation_type_select.className = 'select_input';
        relation_type_select.id = 'relation_type_select';
        let parent_option = document.createElement('option');
        parent_option.innerText = 'Parent';
        parent_option.className = 'option_input';
        parent_option.value = 'a';
        let sibling_option = document.createElement('option');
        sibling_option.innerText = 'Sibling';
        sibling_option.className = 'option_input';
        sibling_option.value = 'c';
        let child_option = document.createElement('option');
        child_option.innerText = 'Child';
        child_option.className = 'option_input';
        child_option.value = 'b';
        relation_type_select.append(parent_option, sibling_option, child_option);
        let of_label = document.createElement('label');
        of_label.className = 'input_label';
        of_label.innerText = ' of ';
        let person_select = document.createElement('select');
        person_select.className = 'select_input';
        person_select.id = 'person_select';
        //build options in a loop based on the people availables
        for(let i = 0; i < PERSON_ARRAY.length; i++ ) {
            // refactor for only people with cards??
            let person = PERSON_ARRAY[i];
            // filters out siblings. so you can't add blind relationships
            if( person.cardHolder.className.includes('sibling_icon')) {
                continue
            }
            let new_option = document.createElement('option');
            new_option.value = person.id;
            new_option.innerText = person.givenName;
            new_option.className = 'option_input';
            person_select.appendChild(new_option);
        }
        relation_div.append(relation_type_label, relation_type_select, of_label, person_select);
        form_holder.append(relation_div);
    
    } else { // this is the first created person
        let relation_div = document.createElement('div');
        relation_div.className = 'input_div';
        let relation_type_label = document.createElement('label');
        relation_type_label.className = 'input_label';
        relation_type_label.innerText = 'This person will be automatically assigned as the ROOT of the tree';
        relation_div.append(relation_type_label);
        form_holder.append(relation_div);
    }

    let create_div = document.createElement('div');
    create_div.className = 'create_div';
    let create_button = document.createElement('button');
    create_button.className = 'create_button';
    create_button.innerText = 'Create';
    create_div.appendChild(create_button);
    form_holder.appendChild(create_div);
    create_button.addEventListener('click', validate_and_post);


    container.appendChild(form_holder);
    page.appendChild(container);


    function validate_and_post() {

        if(checkRequiredFields()) {
            

            let new_person_object = {};
            new_person_object.givenName = gName_input.value;
            new_person_object.familyName = fName_input.value;
            new_person_object.dateOfBirth = myDateFormat(date_of_birth.value);
            console.log(date_of_birth.value);
            new_person_object.dateOfDeath = myDateFormat(date_of_death.value);
            new_person_object.details = details.value;
            if(gender_male.checked == true) {
                new_person_object.gender = 1;
            } else {
                new_person_object.gender = 0;
            }

            if(PERSON_ARRAY.length > 0) {
                let relation_select = document.getElementById('relation_type_select')
                console.log(relation_select);
                let person_selected = document.getElementById('person_select');
                switch(relation_select.value) {
                    case 'a': // the new person is the parent
                        new_person_object.relation_type = 0;
                        new_person_object.person_a_id = true;
                        new_person_object.relation_id = person_selected.value;
                        break;
                    case 'b': // the new person is the child
                        new_person_object.relation_type = 0;
                        new_person_object.person_a_id = false;
                        new_person_object.relation_id = person_selected.value;
                        break;
                    case 'c': // the persons are siblings, doesn't matter
                        new_person_object.relation_type = 1;
                        new_person_object.person_a_id = true;
                        new_person_object.relation_id = person_selected.value;
                        break;
                }

            }


            let json_string = JSON.stringify(new_person_object);

            // post section
            var ajax_request = new XMLHttpRequest();
            ajax_request.open("POST", "/create_person");
            ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
            ajax_request.send(json_string);
            // this is from the response
            ajax_request.onload = function() { 
                javascript_array = JSON.parse(this.response);
                console.log('person added response', javascript_array);
                // in this response only, index 0 is the person, and 1 is the relation
                var person_instance = new Person(javascript_array[0]);
                if(PERSON_ARRAY.length == 0) {
                    person_instance.assignedRoot = true;
                }
                PERSON_ARRAY.push(person_instance);
                if(PERSON_ARRAY.length > 1) {
                    RELATION_ARRAY.push(javascript_array[1]);
                    create_relationship(javascript_array[1]);
                }

                // this should leave us in a state where both global arrays are updated
                update_tree();
                
                container.remove();
                
            };

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

    function myDateFormat(js_date) {
        let new_date = js_date.replace(/-/g, '');
        return new_date
    }
}

// this should eventually just append something to the tree. right now, to complicated to see
// for now, this will delete tree and rebuild
function update_tree() {
    // crude way of finding root right now. as there is no way to change the root yet
    // remove all branches
    let branches = document.getElementsByClassName('branch');
    for(let branch of branches) {
        branch.remove();
    }
    // find person with assignedRoot value and pass to build tree
    for( let person of PERSON_ARRAY) {
        if(person.assignedRoot) {
            build_tree(person);
        }
    }
}

// being called after all database info has been loaded. 
// builds html elements and assigns css order values to organize visuals
function build_tree(selected_person) {

    console.log(PERSON_ARRAY);
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
        let branch_object = person_to_build.create_branch(person_to_build.branchLevel);
        let their_card = person_to_build.create_card();

        // theres a leaf present to place them in
        // divide by 2 and round to get the leaf number/ index
        let their_leaf_number = Math.round(person_to_build.cardNumber / 2);
        branch_object.leaves[their_leaf_number - 1].appendChild(their_card);
        their_card.style.order = person_to_build.cardNumber;
        

        // loop their siblings and add them to the sibling div
        for( let sibling of person_to_build.siblings ) {
            let sib_icon = sibling.sibling_icon();
            person_to_build.sibling_div.appendChild(sib_icon);
            sibling.hasCard = true;
            sibling.cardHolder = sib_icon;
        }

        // loop through their parents and set their branchLevel & cardNumber, and add them to the buffer
        for( let n = 0; n < person_to_build.parents.length; n++ ) {
            let parent = person_to_build.parents[n];
            
            parent.branchLevel = person_to_build.branchLevel + 1;
            
            parent.cardNumber = (person_to_build.cardNumber * 2) - parent.gender;
            
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

// TODO: technically, we could combine person and relation fetch at load. [[person_list][relation_list]]

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

        if(PERSON_ARRAY.length > 0) {
            // we can probably traverse relationships and build tree from that
            for( let person of PERSON_ARRAY) {
                if(person.id == 46) {
                    person.assignedRoot = true;
                    build_tree(person);
                }
            }
            
        }
        
        

    } ;
    ajax_request.open("POST", "/database_relation_all");
    ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
    ajax_request.send(); 
    // JSON.stringify({name:"John Rambo", time:"2pm"}) // example of sending json to server

}


var side_menu = document.getElementById('side_menu');
side_menu.classList.add('one-edge-shadow');

var plus_icon = document.createElement('img');
plus_icon.src = 'static/plus_icon.png';
plus_icon.addEventListener('click', create_new_person);
plus_icon.className = 'button';
plus_icon.alt = 'create a new person';
side_menu.appendChild(plus_icon);

var button2 = document.createElement('button');
//button2.addEventListener('click', get_relation_list);
button2.className = 'button';
button2.innerText = 'test button';
side_menu.appendChild(button2);

var settings_icon = document.createElement('img');
settings_icon.src = 'static/settings_icon.svg';
settings_icon.className = 'button';
settings_icon.id = 'settings';

side_menu.appendChild(settings_icon);


