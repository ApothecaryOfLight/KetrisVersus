function compose_event_log( event_log_obj ) {
    const event_log = document.createDocumentFragment();
    const table = document.createElement("table");
    table.classList = "table_body";
    event_log.appendChild(table);

    const table_title = document.createElement("thread");
    table.appendChild( table_title );
    const table_title_row = document.createElement("tr");
    const table_header = document.createElement("th");
    table_header.innerText = "Event Log";
    table_header.colspan = 4;
    table_title_row.appendChild( table_header );
    table_title.appendChild( table_title_row );

    const table_body = document.createElement("tbody");
    table_body.classList = "table_body";
    table.appendChild( table_body );

    for( const event_key in event_log_obj ) {
        const event_obj = event_log_obj[event_key];

        const event_container = document.createElement("tr");
        event_container.className = 'table_row';

        const event_timestamp = document.createElement("td");
        event_timestamp.className = 'table_cell';
        event_timestamp.innerText = format_datetime( new Date(event_obj.timestamp) );
        event_container.appendChild( event_timestamp );

        const event_code_source = document.createElement("td");
        event_code_source.className = 'table_cell';
        event_code_source.innerText = event_obj.code_source;
        event_container.appendChild( event_code_source );

        const event_message = document.createElement("td");
        event_message.className = 'table_cell';
        event_message.innerText = event_obj.message;
        event_container.appendChild( event_message );

        const event_ip = document.createElement("td");
        event_ip.className = 'table_cell';
        event_ip.innerText = event_obj.ip;
        event_container.appendChild( event_ip );

        const event_details_button_row = document.createElement("td");
        if( typeof( event_obj.details ) != "undefined" && event_obj.details != null ) {
          const details_event = JSON.parse( reverse_process_text( JSON.stringify(event_obj.details) ) );
          const collapsible_object = compose_collapsible_object( details_event );
          const details_event_container = collapsible_object.whole_object;
          details_event_container.className = "";
          event_details_button_row.appendChild( compose_show_details_button(collapsible_object.log_details_conatiner) );
          event_container.appendChild( event_details_button_row );
          table_body.appendChild( event_container );
          table_body.appendChild( details_event_container );
        } else {
          event_container.appendChild( event_details_button_row );
          table_body.appendChild( event_container );
        }
    }
    return event_log;
}