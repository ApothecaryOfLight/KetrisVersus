function reverse_process_text( inText ) {
    let processed_text = inText.replace(
      /&#39;/g,
      "\'"
    );
    processed_text = processed_text.replace(
      /&#34;/g,
      "\""
    );
    processed_text = processed_text.replace(
      /&#92;/g,
      "\\"
    );
    processed_text = processed_text.replace(
      /&#47;/g,
      "\/"
    );
    return processed_text;
}


/*
This function fetches the error log from the server, calls the function that will parse
the information into an HTML table, and appends that to the DOM.
*/
function get_error_log() {
    const non_ws_ip = get_ip();
    const get_error_log_request = new Request(
        non_ws_ip + 'get_error_log'
    );
    fetch( get_error_log_request )
    .then( json => json.json() )
    .then( json => {
      const error_log_container = document.getElementById("error-log-container");
      while( error_log_container.firstChild ) {
        error_log_container.removeChild( error_log_container.firstChild );
      }
      error_log_container.appendChild( compose_error_log( json.error_log ) );
    });
}


/*
This function fetches the event log from the server, calls the function that will parse
the information into an HTML table, and appends that to the DOM.
*/
function get_event_log() {
    const non_ws_ip = get_ip();
    const get_event_log_request = new Request(
        non_ws_ip + 'get_event_log'
    );
    fetch( get_event_log_request )
    .then( json => json.json() )
    .then( json => {
      const event_log_container = document.getElementById("event-log-container");
      while( event_log_container.firstChild ) {
        event_log_container.removeChild( event_log_container.firstChild );
      }
      event_log_container.appendChild( compose_event_log( json.event_log ) );
    });
}


function get_user_list() {
  const non_ws_ip = get_ip();
  const get_user_list_request = new Request(
      non_ws_ip + 'get_user_list'
  );
  fetch( get_user_list_request )
  .then( json => json.json() )
  .then( json => {
    const user_list_container = document.getElementById("user-list-container");
    while( user_list_container.firstChild ) {
      user_list_container.removeChild( user_list_container.firstChild );
    }
    user_list_container.appendChild( compose_user_table( json.user_list ) );
  });
}