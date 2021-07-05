
// Moved our Feature and Bug List to Github Issues github.com/jpayne1349/familee/issues

// global storage
var PERSON_ARRAY = [];

var RELATION_ARRAY = [];

var tree_container = document.getElementById('tree_container');

var body = document.body;


// run on page load?
function main() {
    // this calls everything else right now!
    get_person_list();    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

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

        var person_div = document.createElement('div');
        person_div.className = 'person_div';
        person_div.addEventListener('click', function() {
            // get person and run their profile method.
            let person_id = person_div.parentElement.id;
            let person_obj = person_from_id(person_id);
            
            person_obj.profile();

        });
    
        var card_photo = document.createElement('img');
        card_photo.className = 'card_photo';
        card_photo.src = 'static/profile_icon.png';

        var card_name = document.createElement('div');
        card_name.className = 'card_name';
        card_name.innerText = this.givenName;

        person_div.append(card_photo, card_name);

        var sibling_div = document.createElement('div');
        sibling_div.className = 'sibling_div';
        sibling_div.innerText = 'Siblings';
        this.sibling_div = sibling_div;
        
        // DEV ONLY: we can put the delete in the sibling just for testing
        var delete_div = document.createElement('div');
        delete_div.className = 'delete_cardholder';
        delete_div.innerText = 'delete (dev only)';
        // set an attribute to hold the person id
        delete_div.setAttribute('var', this.id);
        delete_div.addEventListener('click', function(event) {
            
            var owner_id = event.target.getAttribute('var');
            
            var cards = document.getElementsByClassName('card');
            for( let card of cards ) {
                if(card.id == owner_id) {
                    card.remove();
                }
            }
            delete_person(owner_id);
        });
        sibling_div.append(delete_div);

        //show hide the sibling div on button press
        var toggle_sibling_div = document.createElement('div');
        toggle_sibling_div.className = 'toggle_sibling_div';
        toggle_sibling_div.addEventListener('click', function() {
            if(sibling_div.classList.contains('show')) {
                sibling_div.classList.remove('show');
                toggle_sibling_div.classList.remove('open');
            } else {
                sibling_div.classList.add('show');
                toggle_sibling_div.classList.add('open');
            }
        });

        card_container.append(toggle_sibling_div, person_div, sibling_div);
        
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
                //new_leaf.style.flexBasis = flex_basis + '%';
                new_leaf.style.width = '500px';
                new_leaf.style.justifyContent = 'space-around';
                branch_container.appendChild(new_leaf);
                branch_object.leaves.push(new_leaf);
            }
        } else {
            var only_leaf = document.createElement('div');
            only_leaf.className = 'leaf';
            if( branch_number == 2 ) {
                //only_leaf.style.flexBasis = '100%';
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
        
        //sibling_icon.innerText = initials;

        sibling_icon.innerText = this.givenName;
        //sibling_icon.appendChild(delete_icon);
        
        return sibling_icon
    }

    // show profile.. click out of the box should close?
    // we could pass in whether the view should be display?
    // or edit?

    profile() {

        var profile_div = document.createElement('div');
        profile_div.className = 'profile_div';
        profile_div.id = 'profile';

        // TODO: profile photos a thing
        var profile_photo = document.createElement('img');
        profile_photo.className = 'profile_photo';
        profile_photo.src = 'static/profile_icon.png';

        var profile_info_container = document.createElement('div');
        profile_info_container.className = 'profile_info_container';

        var person_info_col = document.createElement('div');
        person_info_col.className = 'person_info_col';

        var givenName_label = document.createElement('div');
        givenName_label.className = 'profile_label';
        givenName_label.innerText = 'Given/Birth Name';
        // slide this up a bit for now
        var profile_givenName = document.createElement('div');
        profile_givenName.className = 'profile_name';
        profile_givenName.innerText = this.givenName;

        var familyName_label = document.createElement('div');
        familyName_label.className = 'profile_label';
        familyName_label.innerText = 'Family/Current Name';
        var profile_familyName = document.createElement('div');
        profile_familyName.className = 'profile_name';
        profile_familyName.innerText = this.familyName;

        var dob_label = document.createElement('div');
        dob_label.className = 'profile_label';
        dob_label.innerText = 'Date of Birth';
        var profile_dob = document.createElement('div');
        profile_dob.className = 'profile_date';
        profile_dob.innerText = this.dateOfBirth;

        person_info_col.append(givenName_label, profile_givenName, familyName_label, profile_familyName, dob_label, profile_dob);

        // add this only if it has info
        if(this.dateOfDeath) {
            var dod_label = document.createElement('div');
            dod_label.className = 'profile_label';
            dod_label.innerText = 'Date of Death';
            var profile_dod = document.createElement('div');
            profile_dod.className = 'profile_date';
            profile_dod.innerText = this.dateOfDeath;

            person_info_col.append(dod_label, profile_dod);

        }

        var details_label = document.createElement('div');
        details_label.className = 'profile_label';
        details_label.innerText = 'Details';
        var profile_details = document.createElement('div');
        profile_details.className = 'profile_details';
        profile_details.innerText = this.details;

        person_info_col.append(details_label, profile_details);

        // RELATIONSHIPS
        var relative_info_col = document.createElement('div');
        relative_info_col.className = 'relative_info_col';


        // parents and children first
        var parents_label =document.createElement('div');
        parents_label.className = 'profile_label';
        parents_label.classList.add('relation_label');
        parents_label.innerText = 'Parents';
        var profile_parents = document.createElement('div');
        profile_parents.className = 'profile_array';
        profile_parents.id = 'profile_parents';
        array_to_element(this.parents, profile_parents);
        // this is an array of objects..
        
        var children_label = document.createElement('div');
        children_label.className = 'profile_label';
        children_label.classList.add('relation_label');
        children_label.innerText = 'Children';
        var profile_children = document.createElement('div');
        profile_children.className = 'profile_array';
        profile_children.id = 'profile_children';
        array_to_element(this.children, profile_children);

        var siblings_label =document.createElement('div');
        siblings_label.className = 'profile_label';
        siblings_label.classList.add('relation_label');
        siblings_label.innerText = 'Siblings';
        var profile_siblings = document.createElement('div');
        profile_siblings.className = 'profile_array';
        profile_siblings.id = 'profile_siblings';
        array_to_element(this.siblings, profile_siblings);

        // EDIT ELEMENTS
        // hide the current divs that are displaying info?
        var edit_givenName = document.createElement('input');
        edit_givenName.className = 'edit_text_input';
        edit_givenName.type = 'text';
        edit_givenName.value = this.givenName;
        // auto populate with current data
        
        var edit_familyName = document.createElement('input');
        edit_familyName.className = 'edit_text_input';
        edit_familyName.type = 'text';
        edit_familyName.value = this.familyName;

        var edit_dateOfBirth = document.createElement('input');
        edit_dateOfBirth.className = 'edit_date_input';
        edit_dateOfBirth.type = 'date';
        edit_dateOfBirth.value = this.dateOfBirth;

        var edit_dateOfDeath = document.createElement('input');
        edit_dateOfDeath.className = 'edit_date_input';
        edit_dateOfDeath.type = 'date';
        edit_dateOfDeath.value = this.dateOfDeath;

        var edit_details = document.createElement('textarea');
        edit_details.className = 'edit_textarea_input';
        //edit_details.type = 'text';
        edit_details.value = this.details;
        
        // edit relatives is more applicable
        // allow deletion of relatives that are there..
        // like deletion of the relationship, not the person?
        // you could leave the add relative button. 
        // 

        var add_relative_container = document.createElement('div');
        add_relative_container.className = 'add_relative_container';

        var new_relative_label = document.createElement('div');
        new_relative_label.className = 'profile_label';
        new_relative_label.classList.add('relative');
        new_relative_label.innerText = 'New';
        new_relative_label.id = 'add_relative_current_id';
        // add the current person's id to this element
        new_relative_label.setAttribute('var', this.id);

        var select_new_relative_type = document.createElement('select');
        select_new_relative_type.className = 'select_input_profile';
        select_new_relative_type.id = 'select_new_relative_type';

        var parent_option = document.createElement('option');
        parent_option.innerText = 'Parent';
        parent_option.className = 'option_input_profile';
        parent_option.value = 'a';
        var sibling_option = document.createElement('option');
        sibling_option.innerText = 'Sibling';
        sibling_option.className = 'option_input_profile';
        sibling_option.value = 'c';
        var child_option = document.createElement('option');
        child_option.innerText = 'Child';
        child_option.className = 'option_input_profile';
        child_option.value = 'b';
        select_new_relative_type.append(parent_option, sibling_option, child_option);

        var select_new_relative = document.createElement('select');
        select_new_relative.className = 'select_input_profile';
        select_new_relative.id = 'select_new_relative';
        
        for(let i = 0; i < PERSON_ARRAY.length; i++ ) {
            let person = PERSON_ARRAY[i];
            
            // exclude yourself
            if(person.id == this.id) {
                continue
            }

            let new_option = document.createElement('option');
            new_option.value = person.id;
            new_option.innerText = person.givenName;
            new_option.className = 'option_input_profile';
            select_new_relative.appendChild(new_option);
        }

        var confirm_new_relative = document.createElement('div');
        confirm_new_relative.className = 'confirm_new_relative';
        confirm_new_relative.innerText = 'Add';
        confirm_new_relative.addEventListener('click', add_relationship);

        add_relative_container.append(new_relative_label, select_new_relative_type, select_new_relative, confirm_new_relative);

        var edit_buttons = document.createElement('div');
        edit_buttons.className = 'edit_buttons';
    
        var save_edits = document.createElement('div');
        save_edits.className = 'save_edits';
        save_edits.innerText = 'Save';
        save_edits.setAttribute('var', this.id);
        save_edits.addEventListener('click', function(event) {
            var owner_id = event.target.getAttribute('var');

            save_profile(owner_id);

        });

        var cancel_edits = document.createElement('div');
        cancel_edits.className = 'cancel_edits';
        cancel_edits.innerText = 'Cancel';
        cancel_edits.addEventListener('click', cancel_edit_view);

        edit_buttons.append(cancel_edits, save_edits);

        var edit_pencil = document.createElement('img');
        edit_pencil.className = 'edit_pencil';
        edit_pencil.id = 'edit_profile_button';
        edit_pencil.src = 'static/edit_pencil.svg';
        edit_pencil.addEventListener('click', show_edit_view );

        var trash_can = document.createElement('img');
        trash_can.className = 'trash_can';
        trash_can.id = 'delete_profile_button';
        trash_can.src = 'static/trash_can.svg';
        trash_can.setAttribute('var', this.id);
        trash_can.addEventListener('click', function(event) {
            
            var owner_id = event.target.getAttribute('var');
            
            var cards = document.getElementsByClassName('card');
            for( let card of cards ) {
                if(card.id == owner_id) {
                    card.remove();
                }
            }
            close_profile();
            delete_person(owner_id);
        });



        relative_info_col.append(parents_label, profile_parents, children_label, profile_children, siblings_label, profile_siblings);

        profile_info_container.append(person_info_col, relative_info_col)

        // do we need gender? idk.
        profile_div.append(edit_pencil, profile_photo, trash_can, profile_info_container);


        var click_barrier = document.createElement('div');
        click_barrier.className = 'click_barrier';

        body.append(click_barrier, profile_div);

        // listen for clicks outside of the profile
        setTimeout(function () {
        body.addEventListener('click', outside_click );
        }, 100);

        function outside_click(event) {

            var clicked_in = true;
            var clicked_element = event.target;
    
            do {
                
                // target element must be profile_div, or a child
                if(clicked_element == profile_div) {
                    return // exit checking loop
                }
                // quick fix for cancel_edits button
                if(clicked_element.className == 'cancel_edits') {
                    return
                }
                // anything other than the profile div needs to check it's parent
                let next_parent = clicked_element.parentElement;
                
                // next two ifs will loop until it either finds the profile
                // or it finds the body.
                if(next_parent == profile_div) {
                    return // exit checking loop
                }
                
                if(next_parent == body ) {
                    clicked_in = false;
                    // remove profile div and stop this listener
                    close_profile();
                
                }

                // assignment for next iteration..
                clicked_element = next_parent;

            } while (clicked_in);

        }
        
        function close_profile() {
            profile_div.remove();
            click_barrier.remove();
            body.removeEventListener('click', outside_click);

        }

        function save_profile(id) {
            // grab information from the inputs, 
            // and send it to the server for updating.
            // we can get the id like this?
            
            var edit_person_object = {};
            edit_person_object.id = id;
            edit_person_object.givenName = edit_givenName.value;
            edit_person_object.familyName = edit_familyName.value;
            edit_person_object.dateOfBirth = myDateFormat(edit_dateOfBirth.value);
            // DOD TBD
            edit_person_object.details = edit_details.value;
            // gender should not change. lol
            
            // add relationships to this, obviously
            var json_string = JSON.stringify(edit_person_object);

            // post to server
            var ajax_request = new XMLHttpRequest();
            ajax_request.open('POST', '/edit_person');
            ajax_request.setRequestHeader("Content-Type", "application/json");
            ajax_request.send(json_string);

            ajax_request.onload = function() {

                // this is on response..
                // we are assuming success right now

                var js_person = person_from_id(edit_person_object.id);
                // this is prolly not working.
                js_person.update_profile(edit_person_object);

                // close edit view../ update displays
                edit_givenName.remove();
                profile_givenName.innerText = js_person.givenName;
                givenName_label.after(profile_givenName);

                edit_familyName.remove();
                profile_familyName.innerText = js_person.familyName;
                familyName_label.after(profile_familyName);

                edit_dateOfBirth.remove();
                profile_dob.innerText = js_person.dateOfBirth;
                dob_label.after(profile_dob);

                // conditional DOD addition

                edit_details.remove();
                profile_details.innerText = js_person.details;
                details_label.after(profile_details);

                add_relative_container.remove();
                save_edits.remove();
                cancel_edits.remove();

                edit_pencil.style.display = 'block';

                update_tree();
                
            }
            

            // probably remove the inputs and display
            // the normal divs again.

        }

        function array_to_element(array, parent_elem) {
            
            array.forEach(function(person) {
                var person_elem = document.createElement('div');
                person_elem.className = 'profile_relation';
                
                var person_name = document.createElement('div');
                person_name.className = 'relation_name';
                person_name.innerText = person.givenName;
                person_name.setAttribute('var', person.id);

                var relation_remove = document.createElement('div');
                relation_remove.className = 'relation_remove';

                person_elem.append(person_name, relation_remove);

                parent_elem.appendChild(person_elem);
            });

        }

        function show_edit_view() {
            profile_givenName.remove();
            givenName_label.after(edit_givenName);

            profile_familyName.remove();
            familyName_label.after(edit_familyName);

            profile_dob.remove();
            dob_label.after(edit_dateOfBirth);

            // conditional DOD addition

            profile_details.remove();
            details_label.after(edit_details);
            
            profile_siblings.after(add_relative_container);

            profile_info_container.after(edit_buttons);

            // show relation_remove minus and add that functionality
            var minuses = document.getElementsByClassName('relation_remove');
            for( let minus of minuses) {
                minus.classList.add('show');
                minus.parentElement.addEventListener('click', delete_relationship);
                minus.parentElement.style.cursor = 'pointer';
            }

            edit_pencil.style.display = 'none';
        }

        // process click event for removal of relationship
        function delete_relationship(event) {
            var id = event.target.getAttribute('var');
            var person_object = person_from_id(id);
            var owner_delete = document.getElementsByClassName('trash_can');
            var owner_id = owner_delete[0].getAttribute('var');
            var owner_object = person_from_id(owner_id);

            id = parseInt(id);
            owner_id = parseInt(owner_id);

            // removal from javascript side
            for( let entry of RELATION_ARRAY) {
                console.log('checking entry', entry);
                if( entry.person_a_id == id && entry.person_b_id == owner_id) {
                    // person b must be sifted
                    console.log('removing relationships from arrays');
                    person_object.remove_relationship(owner_object);
                    owner_object.remove_relationship(person_object);

                    let index = RELATION_ARRAY.indexOf(entry);
                    RELATION_ARRAY.splice(index, 1);
                } else if ( entry.person_b_id == id && entry.person_a_id == owner_id ) {
                    console.log('removing relationships from arrays');
                    person_object.remove_relationship(owner_object);
                    owner_object.remove_relationship(person_object);

                    let index = RELATION_ARRAY.indexOf(entry);
                    RELATION_ARRAY.splice(index, 1);
                }
            }
            
            // ajax to remove server side
            var person_id = {}
            person_id.id = id;
        
            var json_string = JSON.stringify(person_id);

            var ajax_request = new XMLHttpRequest();
            ajax_request.open("POST", "/remove_relationship");
            ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
            ajax_request.send(json_string);
            ajax_request.onload = function() {
                // all javascript should be updated.
                // remove name from current list on profile
                var profile_relation_div = event.target.parentElement;
                profile_relation_div.remove();

                console.log('after deletion of relatioship - ', RELATION_ARRAY);

                update_tree();
            };

        }

        // process select values for creation of relationship entry
        function add_relationship() {
            var type = document.getElementById('select_new_relative_type');
            var adding_person = document.getElementById('select_new_relative');
            var label_element = document.getElementById('add_relative_current_id');
            var current_person_id = label_element.getAttribute('var');
            var current_person_obj = person_from_id(current_person_id);

            var relation_entry = {};

            switch(type.value) {
                case 'a': // the added person is the parent
                    relation_entry.relation_type = 0;
                    relation_entry.person_a_id = parseInt(adding_person.value);
                    relation_entry.person_b_id = parseInt(current_person_id);
                    break;
                case 'b': // the added person is the child
                    relation_entry.relation_type = 0;
                    relation_entry.person_a_id = parseInt(current_person_id);
                    relation_entry.person_b_id = parseInt(adding_person.value);
                    break;
                case 'c': // the persons are siblings, doesn't matter
                    relation_entry.relation_type = 1;
                    relation_entry.person_a_id = parseInt(current_person_id);
                    relation_entry.person_b_id = parseInt(adding_person.value);
                    break;
            }

            console.log(relation_entry);
            RELATION_ARRAY.push(relation_entry);
            create_relationship(relation_entry);


            let json_string = JSON.stringify(relation_entry);

            // post section
            var ajax_request = new XMLHttpRequest();
            ajax_request.open("POST", "/add_relationship");
            ajax_request.setRequestHeader("Content-Type", "application/json"); // important for flask interpretation
            ajax_request.send(json_string);
            // this is from the response
            ajax_request.onload = function() {  

                // add to profile view
                var profile_arrays = document.getElementsByClassName('profile_array');
                for( let elem of profile_arrays) {
                    switch(elem.id) {
                        case 'profile_parents':
                            //remove what's there
                            for( let child of elem.children) {
                                child.remove();
                            }
                            // use person object
                            array_to_element(current_person_obj.parents, elem);
                            break;
                        case 'profile_children':
                            //remove what's there
                            for( let child of elem.children) {
                                child.remove();
                            }
                            // use person object
                            array_to_element(current_person_obj.children, elem);
                            break;
                        case 'profile_siblings':
                            //remove what's there
                            for( let child of elem.children) {
                                child.remove();
                            }
                            // use person object
                            array_to_element(current_person_obj.siblings, elem);
                            break;
                    }
                }

                update_tree();

            };

        }

        function cancel_edit_view() {
            // remove inputs and return divs
            edit_givenName.remove();
            givenName_label.after(profile_givenName);

            edit_familyName.remove();
            familyName_label.after(profile_familyName);

            edit_dateOfBirth.remove();
            dob_label.after(profile_dob);

            // conditional DOD addition

            edit_details.remove();
            details_label.after(profile_details);

            add_relative_container.remove();

            edit_buttons.remove();

            var minuses = document.getElementsByClassName('relation_remove');
            for( let minus of minuses) {
                minus.classList.remove('show');
                minus.parentElement.removeEventListener('click', delete_relationship);
                minus.parentElement.style.cursor = 'default';
            }

            edit_pencil.style.display = 'block';
        }

    }

    // updates properties based on passed in object
    // has to remove the card element, to force update
    update_profile(javascript_object) { 
        
        this.givenName = javascript_object.givenName;
        this.familyName = javascript_object.familyName;
        this.dateOfBirth = javascript_object.dateOfBirth;
        this.details = javascript_object.details;

        var elem = this.cardHolder;
        elem.remove();

        this.cardHolder = undefined;
        this.hasCard = false;
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
        
        // remove html element - 
        // for cards this is different than siblings
        // do in click function


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
    var existing_form = document.getElementById('create_person_container')
    if(existing_form) {
        existing_form.classList.remove('new_person_visible');
        return
    }

    // maybe we just have a popup for now. just something quick
    let container = document.createElement('div');
    container.id = 'create_person_container';
    container.classList.add('new_person_visible');

    let form_holder = document.createElement('form');
    form_holder.name = 'create_person';
    form_holder.setAttribute('onsubmit', 'event.preventDefault();');
    form_holder.id = 'create_person_form';

    let hide_form = document.createElement('div');
    hide_form.id = 'hide_form';
    hide_form.addEventListener('click', function(){ 
        // edit classList of #create_person_container
        container.classList.add('new_person_visible');
        // container.remove(); 
    });
    form_holder.appendChild(hide_form);
    
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
    gName_input.placeholder = 'Given/Birth Name *';
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
    
    let male_holder = document.createElement('label');
    male_holder.className = 'checkbox_holder';
    male_holder.innerText = 'Male';
    male_holder.for = 'male_radio';
    let male_input = document.createElement('input');
    male_input.className = 'radio_input';
    male_input.id = 'male_radio';
    male_input.value = 1;
    male_input.type = 'checkbox';
    let male_checkmark = document.createElement('span');
    male_checkmark.className = 'checkmark';

    male_holder.append(male_input, male_checkmark);
    
    let female_holder = document.createElement('label');
    female_holder.className = 'checkbox_holder';
    female_holder.innerText = 'Female';
    let female_input = document.createElement('input');
    female_input.className = 'radio_input';
    female_input.id = 'female_radio';
    female_input.value = 0;
    female_input.type = 'checkbox';
    let female_checkmark = document.createElement('span');
    female_checkmark.className = 'checkmark';

    female_holder.append(female_input, female_checkmark);

    gender_div.append(male_holder, female_holder);
    form_holder.appendChild(gender_div);

    let dob_div = document.createElement('div');
    dob_div.className = 'input_div date';
    let dob_label = document.createElement('label');
    dob_label.className = 'input_label';
    dob_label.innerText = 'Date of Birth';
    let date_of_birth = document.createElement('input');
    date_of_birth.className = 'date_input';
    date_of_birth.type = 'date';
    date_of_birth.autocomplete = 'off';
    date_of_birth.placeholder = 'Date of Birth';
    dob_div.append(dob_label, date_of_birth);
    form_holder.appendChild(dob_div);

    // have a plus icon to show this
    let dod_div = document.createElement('div');
    dod_div.className = 'input_div date hidden';
    let dod_label = document.createElement('label');
    dod_label.className = 'input_label';
    dod_label.innerText = 'Date of Death';
    let date_of_death = document.createElement('input');
    date_of_death.className = 'date_input';
    date_of_death.type = 'date';
    date_of_death.autocomplete = 'off';
    date_of_death.placeholder = 'Date of Death';

    let toggle_dod = document.createElement('div');
    toggle_dod.className = 'toggle_dod';
    toggle_dod.addEventListener('click', function() {
        if(dod_div.classList.contains('hidden')) {
            dod_div.classList.remove('hidden');
            toggle_dod.classList.add('showing');
        } else {
            dod_div.classList.add('hidden');
            toggle_dod.classList.remove('showing');
        }
    });

    dod_div.append( dod_label, date_of_death);
    form_holder.append(toggle_dod, dod_div);

    let details_div = document.createElement('div');
    details_div.className = 'input_div';
    let details = document.createElement('textarea');
    details.className = 'text_input details';
    details.type = 'text';
    details.maxLength = 280;
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
    
    // we now want to create this form somehow off the existing side_menu
    navbar.append(container);

    // may do a timeout?
    setTimeout(function (){
        container.classList.remove('new_person_visible');
    }, 10);
    

    function validate_and_post() {

        if(checkRequiredFields()) {
            

            let new_person_object = {};
            new_person_object.givenName = gName_input.value;
            new_person_object.familyName = fName_input.value;
            new_person_object.dateOfBirth = myDateFormat(date_of_birth.value);
            new_person_object.dateOfDeath = myDateFormat(date_of_death.value);
            new_person_object.details = details.value;
            if(male_input.checked == true) {
                new_person_object.gender = 1;
            } else {
                new_person_object.gender = 0;
            }

            if(PERSON_ARRAY.length > 0) {
                let relation_select = document.getElementById('relation_type_select')
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
                var javascript_array = JSON.parse(this.response);
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
                
                // TODO: this is removing the form container after post???
                container.remove();
                
            };

            return false
        
        }

        function checkRequiredFields() {
            let required_bool = true;

            if(!gName_input.value) {
                // set givenName outline to red
                gName_input.style.borderColor = 'orangered';
                required_bool = false;
            }
            if(male_input.checked == false && female_input.checked == false) {
                male_checkmark.classList.add('required');
                female_checkmark.classList.add('required');
                required_bool = false;
            }

            if(male_input.checked == true && female_input.checked == true) {
                male_input.checked = false;
                female_input.checked = false;
                male_checkmark.classList.add('required');
                female_checkmark.classList.add('required');
                required_bool = false;
            }
            
            return required_bool
        }
        
    }

}

function myDateFormat(js_date) {
        let new_date = js_date.replace(/-/g, '');
        return new_date
    }

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
// this should eventually just append something to the tree. right now, to complicated to see
// for now, this will delete tree and rebuild
function update_tree() {
    // crude way of finding root right now. as there is no way to change the root yet
    //remove all cards
    console.log('OLD TREE - ', PERSON_ARRAY, RELATION_ARRAY);

    var tree = document.getElementById('tree_container');
    removeAllChildNodes(tree);

    // unset some properties determined in build_tree
    for( let person of PERSON_ARRAY) {
        person.hasCard = false;
        person.cardHolder = undefined;
        person.branchLevel = undefined;
        person.cardNumber = undefined;
        person.sibling_div = undefined;
    }

    // find person with assignedRoot value and pass to build tree
    for( let person of PERSON_ARRAY) {
        if(person.assignedRoot) {
            build_tree(person);
        }
    }
    console.log('UPDATED TREE - ', PERSON_ARRAY, RELATION_ARRAY);
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
            person_to_build.sibling_div.insertBefore(sib_icon, person_to_build.sibling_div.firstElementChild);
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
    console.log('creating relationship', relation_entry_object);
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
            console.log('relation type = ', relation_entry_object.relation_type);
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
        var js_array = JSON.parse(json_string);
        
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
                if(person.id == 1) {
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


var navbar_class = document.getElementsByClassName('navbar');
var navbar = navbar_class[0];
navbar.classList.add('one-edge-shadow');

var navbar_options = document.createElement('div');
navbar_options.className = 'navbar_options';


var plus_icon = document.createElement('img');
plus_icon.src = 'static/plus_icon.png';
plus_icon.addEventListener('click', create_new_person);
plus_icon.className = 'button';
plus_icon.alt = 'create a new person';

var button2 = document.createElement('button');
//button2.addEventListener('click', get_relation_list);
button2.className = 'button';
button2.innerText = 'Create Relationship Button';


var settings_icon = document.createElement('button');
//settings_icon.src = 'static/settings_icon.svg';
settings_icon.className = 'button';
settings_icon.id = 'settings';
settings_icon.innerText = 'Update Tree (dev only)';

settings_icon.addEventListener('click', update_tree);

navbar_options.append(plus_icon, button2, settings_icon);

navbar.appendChild(navbar_options);

