/*
This function is used to check whether the server is running in secure or unsecured
mode.

If the server is running secured then the provided Websocket IP address will begin
with "wss", and so the admin fetch requests should use https.

If the sever is running unsecured then the provided Websocket IP address will begin
with "ws:", and so the admin fetch requests should use http.
*/
function get_ip() {
    if( ip.substr(0,3) == "ws:" ) {
        return "http://" + ip.substr(5, ip.length) + ":53004/";
    } else if( ip.substr(0,3) == "wss" ) {
        return "https://" + ip.substr(5, ip.length) + ":53004/";
    }
}