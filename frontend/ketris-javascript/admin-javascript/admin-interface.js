"use strict";

window.onload = () => {
    console.log( "Loaded!" );

    const get_error_log_button = document.getElementById("menu_button_error_log");
    get_error_log_button.addEventListener( "click", (event) => {
        const error_log_container = document.getElementById("error-log-container");
        error_log_container.style["display"] = "block";
        const event_log_container = document.getElementById("event-log-container");
        event_log_container.style["display"] = "none";
        get_error_log();
    });
    const get_event_log_button = document.getElementById("menu_button_event_log");
    get_event_log_button.addEventListener( "click", (event) => {
        const error_log_container = document.getElementById("error-log-container");
        error_log_container.style["display"] = "none";
        const event_log_container = document.getElementById("event-log-container");
        event_log_container.style["display"] = "block";
        get_event_log();
    });
}