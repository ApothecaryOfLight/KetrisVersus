"use strict"

function compose_error_log( error_log_obj ) {
    const error_log = document.createDocumentFragment();
    const table = document.createElement("table");
    error_log.appendChild(table);

    const table_title = document.createElement("thread");
    table.appendChild( table_title );
    const table_title_row = document.createElement("tr");
    const table_header = document.createElement("th");
    table_header.innerText = "Error Log";
    table_header.colspan = 4;
    table_title_row.appendChild( table_header );
    table_title.appendChild( table_title_row );

    const table_body = document.createElement("tbody");
    table.appendChild( table_body );

    for( const error_key in error_log_obj ) {
        const error_obj = error_log_obj[error_key];

        const error_container = document.createElement("tr");
        error_container.className = 'error_obj_container';

        const error_timestamp = document.createElement("td");
        error_timestamp.className = 'error_obj_timestamp_container';
        error_timestamp.innerText = error_obj.timestamp;
        error_container.appendChild( error_timestamp );

        const error_source = document.createElement("td");
        error_source.className = 'error_obj_source_container';
        error_source.innerText = error_obj.source;
        error_container.appendChild( error_source );

        const error_message = document.createElement("td");
        error_message.className = 'error_obj_message_container';
        error_message.innerText = error_obj.message;
        error_container.appendChild( error_message );

        const error_ip = document.createElement("td");
        error_ip.className = 'error_obj_ip_container';
        error_ip.innerText = error_obj.ip;
        error_container.appendChild( error_ip );

        if( typeof( error_obj.details ) != "undefined" ) {
            if( typeof(error_obj.details.error) != "undefined" ) {
                const details_error = JSON.parse( reverse_process_text( error_obj.details.error ) );
                //TODO: Append JSON object as expansible/collapsible element.
            }
        }

        table_body.appendChild( error_container );
    }
    return error_log;
}