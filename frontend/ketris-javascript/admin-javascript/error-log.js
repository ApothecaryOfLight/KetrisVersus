function reverse_process_text( inText ) {
    console.log( "typeof: " + typeof( inText ) );
    console.dir( inText );
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
    console.log( processed_text );
    return processed_text;
}

function get_error_log() {
    const non_ws_ip = get_ip();
    console.log( non_ws_ip );
    const get_error_log_request = new Request(
        non_ws_ip + 'get_error_log'
    );
    fetch( get_error_log_request )
    .then( json => json.json() )
    .then( json => {
        const error_log_container = document.getElementById("error-log-container");
        error_log_container.appendChild( compose_error_log( json.error_log ) );
    });
}

function get_event_log() {
    const non_ws_ip = get_ip();
    console.log( non_ws_ip );
    const get_event_log_request = new Request(
        non_ws_ip + 'get_event_log'
    );
    fetch( get_event_log_request )
    .then( json => json.json() )
    .then( json => {
        console.dir( json );
    });
}