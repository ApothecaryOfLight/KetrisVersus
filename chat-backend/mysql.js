/*MySQL*/
const mysql = require('mysql2');


/*
This function creates a connection to the MySQL server and returns a reference to it,
allowing queries to be make against the ketris_db database.
*/
function do_connect_to_sql_server() {
    const mysql_pool = mysql.createPoolPromise({
        connectionLimmit: 50,
        host: 'localhost',
        user: 'ketris_node_user',
        password: 'ketris_node_user_password',
        database: 'ketris_db'
    });
    return mysql_pool;
}

exports.do_connect_to_sql_server = do_connect_to_sql_server;