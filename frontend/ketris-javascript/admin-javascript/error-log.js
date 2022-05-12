/*
Apply regex to the given string to replace some HTML character codes with their
standard ASCII equivalents.
*/
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


/*
Function to ask the server for a list of user accounts.

Upon success, it will call the function to process that data into an HTML table
and will then append said table to the DOM.
*/
function get_user_list() {
  //Create the IP address of the server.
  const non_ws_ip = get_ip();

  //Create the request.
  const get_user_list_request = new Request(
      non_ws_ip + 'get_user_list'
  );

  //Fetch using the request.
  fetch( get_user_list_request )
  .then( json => json.json() )
  .then( json => {
    //Get a reference to the list container.
    const user_list_container = document.getElementById("user-list-container");
    
    //Ensure that any pre-existing elements in that space are deleted.
    while( user_list_container.firstChild ) {
      user_list_container.removeChild( user_list_container.firstChild );
    }

    //Transform the JSON object into an HTML table, append it to the DOM.
    user_list_container.appendChild( compose_user_table( json.user_list ) );
  });
}