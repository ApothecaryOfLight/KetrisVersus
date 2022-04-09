function object_to_text( data_object, depth ) {
    depth = depth ?? 0;
    if( Array.isArray(data_object) ) {
      return "[ " + data_object + " ] ";
    } else if( typeof( data_object ) == "object" ) {
      let string = "{\n";
      for( const key in data_object ) {
        for( let i=0; i<=depth; i++ ) {
          string += "____";
        }
        string += key + ": " + object_to_text( data_object[key], depth+1 ) + "\n";
      }
      for( let i=0; i<depth; i++ ) {
        string += "____";
      }
      return string + "}";
    } else if( typeof( data_object ) == "string" ) {
      return "\"" + data_object + "\""
    } else {
        return data_object;
    }
  }

function compose_collapsible_object( data_object ) {
    const collapsible_row = document.createElement("tr");
    const collapsible_container = document.createElement("td");
    collapsible_container.className = "";
    collapsible_container.innerText = object_to_text( data_object );
    collapsible_row.appendChild( collapsible_container );
    return collapsible_row;
}

function compose_event_log( event_log_obj ) {
    const event_log = document.createDocumentFragment();
    const table = document.createElement("table");
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
    table.appendChild( table_body );

    for( const event_key in event_log_obj ) {
        const event_obj = event_log_obj[event_key];

        const event_container = document.createElement("tr");
        event_container.className = 'event_obj_container';

        const event_timestamp = document.createElement("td");
        event_timestamp.className = 'event_obj_timestamp_container';
        event_timestamp.innerText = format_datetime( new Date(event_obj.timestamp) );
        event_container.appendChild( event_timestamp );

        const event_code_source = document.createElement("td");
        event_code_source.className = 'event_obj_source_container';
        event_code_source.innerText = event_obj.code_source;
        event_container.appendChild( event_code_source );

        const event_message = document.createElement("td");
        event_message.className = 'event_obj_message_container';
        event_message.innerText = event_obj.message;
        event_container.appendChild( event_message );

        const event_ip = document.createElement("td");
        event_ip.className = 'event_obj_ip_container';
        event_ip.innerText = event_obj.ip;
        event_container.appendChild( event_ip );

        /*if( typeof( event_obj.details ) != "undefined" ) {
            if( typeof(event_obj.details.event) != "undefined" ) {
                const details_event = JSON.parse( reverse_process_text( event_obj.details.event ) );
                //TODO: Append JSON object as expansible/collapsible element.
            }
        }*/

        table_body.appendChild( event_container );

        if( typeof( event_obj.details ) != "undefined" && event_obj.details != null ) {
            if( typeof( event_obj.details ) == "string" ) {
                const details = JSON.parse( reverse_process_text( event_obj.details ) );
                const details_container = compose_collapsible_object( details );
                table_body.appendChild( details_container );
            } else {
                const details_container = compose_collapsible_object( event_obj.details );
                table_body.appendChild( details_container );
            }
        }
    }
    return event_log;
}