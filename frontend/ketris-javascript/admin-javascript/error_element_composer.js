"use strict"

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
    const collapsible_column = document.createElement("td");
    const collapsible_container = document.createElement("div");

    collapsible_container.className = "log_details_container";
    collapsible_container.innerText = object_to_text( data_object );

    collapsible_column.appendChild( collapsible_container );
    collapsible_row.appendChild( collapsible_column );

    return {
      whole_object: collapsible_row,
      log_details_conatiner: collapsible_container
    };
}

function compose_show_details_button( details_error_container ) {
  const expand_details_button = document.createElement("button");
  expand_details_button.innerText = "+";
  expand_details_button.addEventListener( 'click', (event) => {
    details_error_container.style["max-height"] = details_error_container.scrollHeight + "px";
    event.srcElement.replaceWith( compose_hide_details_button(details_error_container) );
  });
  return expand_details_button;
}

function compose_hide_details_button( details_error_container ) {
  const collapse_details_button = document.createElement("button");
  collapse_details_button.innerText = "-";
  collapse_details_button.addEventListener( 'click', (event) => {
    details_error_container.style["max-height"] = 0;
    event.srcElement.replaceWith( compose_show_details_button(details_error_container) );
  });
  return collapse_details_button;
}

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

        const error_details_button_row = document.createElement("td");
        if( typeof( error_obj.details ) != "undefined" && typeof(error_obj.details.error) != "undefined" ) {
          const details_error = JSON.parse( reverse_process_text( error_obj.details.error ) );

          const collapsible_object = compose_collapsible_object( details_error );

          const details_error_container = collapsible_object.whole_object;
          details_error_container.className = "";
          error_details_button_row.appendChild( compose_show_details_button(collapsible_object.log_details_conatiner) );
          error_container.appendChild( error_details_button_row );
          table_body.appendChild( error_container );
          table_body.appendChild( details_error_container );
        } else {
          error_container.appendChild( error_details_button_row );
          table_body.appendChild( error_container );
        }
    }
    return error_log;
}