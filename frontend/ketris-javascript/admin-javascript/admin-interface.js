"use strict";

/*
This attaches an anonymous function to the window onload event.

The anonymous function then attaches click event listeners to the event and error
menu buttons, which show their respective log and hide the other, then fetch the logs
from the server.
*/
window.onload = () => {
    console.log( "Loaded!" );

    //Get a reference to the get error log menu button.
    const get_error_log_button = document.getElementById("menu_button_error_log");

    //Attach a click event listener to the get error log menu button.
    get_error_log_button.addEventListener( "click", (event) => {
        //Get a reference to the error log and display it.
        const error_log_container = document.getElementById("error-log-container");
        error_log_container.style["display"] = "block";

        //Get a reference to the event log and hide it.
        const event_log_container = document.getElementById("event-log-container");
        event_log_container.style["display"] = "none";

        //Get the error log from the server.
        get_error_log();
    });

    //Get a reference to the get event log menu button.
    const get_event_log_button = document.getElementById("menu_button_event_log");
    //Attach a click event listener to the get event log menu button.
    get_event_log_button.addEventListener( "click", (event) => {
        //Get a reference to the event log and display it.
        const error_log_container = document.getElementById("error-log-container");
        error_log_container.style["display"] = "none";
        
        //Get a reference to the error log and hide it.
        const event_log_container = document.getElementById("event-log-container");
        event_log_container.style["display"] = "block";
        
        //Get the event log from the server.
        get_event_log();
    });
}