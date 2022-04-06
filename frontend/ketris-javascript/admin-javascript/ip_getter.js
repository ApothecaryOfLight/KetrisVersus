function get_ip() {
    if( ip.substr(0,3) == "ws:" ) {
        return "http://" + ip.substr(5, ip.length) + ":53004/";
    } else if( ip.substr(0,3) == "wss" ) {
        return "https://" + ip.substr(5, ip.length) + ":53004/";
    }
}