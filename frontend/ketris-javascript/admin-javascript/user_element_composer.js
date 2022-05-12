"use strict"

/*
Creates an HTML table row element out of a user object.

user: User object, received from the server, containing the user's name, the user's
ip address, and a timestamp of when the account was created.
*/
function compose_user_element( user ) {
    //Create a table row element.
    const user_row = document.createElement("tr");
    user_row.className = "table_row";

    //Create a table cell for the username.
    const user_name_cell = document.createElement("td");
    user_name_cell.innerText = user.username_plaintext;
    user_name_cell.className = "table_cell";
    user_row.appendChild( user_name_cell );

    //Create a table cell for the ip address.
    const creation_ip_cell = document.createElement("td");
    creation_ip_cell.innerText = user.creation_ip;
    creation_ip_cell.className = "table_cell";
    user_row.appendChild( creation_ip_cell );

    //Create a table cell for the account creation time.
    const account_creation_time = document.createElement("td");
    account_creation_time.innerText = user.account_creation_time;
    account_creation_time.className = "table_cell";
    user_row.appendChild( account_creation_time );

    return user_row;
}

/*
Function that takes a list of user accounts and creates an HTML table of them.

users: An object containing a list of all created user accounts.
*/
function compose_user_table( users ) {
    //Create a table element
    const user_table = document.createElement("table");

    //Create the table header element.
    const user_table_header = document.createElement("thread");
    user_table.appendChild( user_table_header );

    //Create the table body element.
    const user_table_body = document.createElement("tbody");
    user_table_body.className = "table_body";
    user_table.appendChild( user_table_body );

    //Iterate through the users and create a row from each.
    for( const user_key in users ) {
        user_table_body.append( compose_user_element( users[user_key] ) );
    }

    return user_table;
}