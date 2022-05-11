"use strict"

function compose_user_element( user ) {
    const user_row = document.createElement("tr");
    user_row.className = "table_row";

    const user_name_cell = document.createElement("td");
    user_name_cell.innerText = user.username_plaintext;
    user_name_cell.className = "table_cell";
    user_row.appendChild( user_name_cell );

    const creation_ip_cell = document.createElement("td");
    creation_ip_cell.innerText = user.creation_ip;
    creation_ip_cell.className = "table_cell";
    user_row.appendChild( creation_ip_cell );

    const account_creation_time = document.createElement("td");
    account_creation_time.innerText = user.account_creation_time;
    account_creation_time.className = "table_cell";
    user_row.appendChild( account_creation_time );

    return user_row;
}

function compose_user_table( users ) {
    const user_table = document.createElement("table");

    const user_table_header = document.createElement("thread");
    user_table.appendChild( user_table_header );

    const user_table_body = document.createElement("tbody");
    user_table_body.className = "table_body";
    user_table.appendChild( user_table_body );

    for( const user_key in users ) {
        user_table_body.append( compose_user_element( users[user_key] ) );
    }

    return user_table;
}