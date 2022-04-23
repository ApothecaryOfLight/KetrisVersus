const mysql = require('mysql2');

const sqlPool = mysql.createPoolPromise({
  connectionLimit: 50,
  host: 'localhost',
  user: 'ketris_node_user',
  password: 'ketris_node_user_password',
  database: 'ketris_db',
  multipleStatements: true
});


/*
Prepends a zero to any number smaller than ten, so that the number supplied
can be used in a timestamp string.

While this function takes a Number type, type coercion will return a string
because the return call uses the plus sign with a string ("0") and a Number,
this will cause the plus sign to function as a string concatenator.
*/
function pad_with_zero( inNumber ) {
  if( inNumber < 10 ) {
    return "0" + inNumber;
  }
  return inNumber;
}


/*
This function will ensure that milliseconds will consist of 6 digits, a requirement
for the timestamp format we're using (the MySQL DATETIME format). That value is in
fractional seconds, not milliseconds.

MySQL lets us set the preicion of these fractional seconds, which we set to the max,
at 6. This makes them equivalent to microseconds, which are three magnitudes of order
smaller than milliseconds.

Because the JavaScript getMilliseconds() function returns a three digit value, we
will need to append three zeroes, to convert from milliseconds to microseconds,
and then prepend a number of zeroes that will make the string 6 digits long, in
order to match the format expected by MySQL's DATETIME(6).
*/
function pad_milliseconds( inMilliseconds ) {
  let outMilliseconds = "";

  //JavaScript milliseconds need to be multipled by two orders of magnitude to be
  //converted into fractional seconds. That means appending two zeroes, since we
  //can't JavaScript won't give us values at those finer granularities.
  outMilliseconds = inMilliseconds + "000";

  //Next we need to prepend zeroes to the string in order to reach a length of 6 digits.
  const inLength = String(outMilliseconds).length;
  const needed_zeroes = 6 - inLength;
  for( let i=0; i<needed_zeroes; i++ ) {
    outMilliseconds = String("0") + outMilliseconds;
  }

  return outMilliseconds;
}


/*
We use pad_with_zero to make sure that all 2-digit values have 2 digits, and we use
pad_milliseconds to make sure that our milliseconds value has 6 digits, both of which
are required for MySQL DATETIME format.
*/
function get_datetime() {
  const timestamp = new Date();
  const year = timestamp.getFullYear();
  const month = pad_with_zero(timestamp.getMonth() + 1);
  const day = pad_with_zero( timestamp.getDate() );
  const hours = pad_with_zero( timestamp.getHours() );
  const minutes = pad_with_zero( timestamp.getMinutes() );
  const seconds = pad_with_zero( timestamp.getSeconds() );
  const milliseconds = pad_milliseconds( timestamp.getMilliseconds() );

  const MySQLDateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;

  return MySQLDateTime;
}


/*
In this function we use regex patterns to find and replace any values that will cause
problems in a SQL query.

Forward slashes mark the beginning and end of each regex search pattern. Back slashes
act as escape characters, preserving the following character. This allows us to have
quotation marks and apostrophes without JavaScript interpreting them as the beginnings
of strings.

We replace each match with the HTML character code for that character. These will be
accepted by MySQL and, when displayed to the user in an HTML page, will appear as the
characters they have replaced.

Finally we use the g flag to apply our regex search patterns to every match in the
inText string, rather than simply replacing the first matched instance.
*/
function process_text( inText ) {
  let processed_text = inText.replace(
    /\'/g,
    "&#39;"
  );
  processed_text = processed_text.replace(
    /\"/g,
    "&#34;"
  );
  processed_text = processed_text.replace(
    /\\/g,
    "&#92;"
  );
  processed_text = processed_text.replace(
    /\//g,
    "&#47;"
  );
  return processed_text;
}


/*
This is our core error logging feature.

Source: A String telling us which file and function threw the error.

Message: A String that proides a short description of the error.

Severity: A Number that indicates how severe the error was. Lower is more severe,
where 0 is an error that broke the whole program.

Details: An Object that can contain arbitrary JSON formatted information, such as
a MySQL error or a copy of the data that was being processed when the error was
thrown.

We use process_text to sanitize the input, replacing characters that would cause
problems for MySQL with characters that are MySQL safe, but will appear as expected
to the users.

We use JSON.stringify to transform the details object into a simple String.

And finally we take the INSERT query that we've string bashed together and use it
with an asynchronous MySQL query call. Because it is asynchronous, we use await
to prevent the function from returning before the query is compelte.
*/
async function log_error( source, message, severity, ip, details ) {
  const timestamp_string = get_datetime();
  const new_error_id_query =
    "SELECT ketris_db.generate_new_id( 0 ) as new_id;";
  const [new_error_row,new_error_field] =
    await sqlPool.query( new_error_id_query );
  const new_error_id = new_error_row[0].new_id;

  details.error = {
    stack: details.error.stack,
    message: details.error.message
  }

  const add_error_query =
    "INSERT INTO error_log " +
    "(error_id, source, message, severity, timestamp, ip, details) VALUES " +
    "(" + new_error_id + ", " +
    "\'" + source + "\', " +
    "\'" + process_text( message.toString() ) + "\', " +
    severity + ", " +
    "\'" + timestamp_string + "\', " +
    "\'" + ip + "\', " +
    "\'" + process_text(JSON.stringify( details )) + "\'" +
    ");";

  const [add_rows,add_fields] = await sqlPool.query( add_error_query );
  return add_rows;
}


/*
This is our core event logging feature.

code_source: A String telling us which file and function logged the event.

message: A String that proides a short description of the event.

ip: A String containing the IP address of the client whose input created this event.

details: An Object that can contain arbitrary JSON formatted information, such as
a MySQL event or a copy of the data that was being processed when the event was
thrown.

We use process_text to sanitize the input, replacing characters that would cause
problems for MySQL with characters that are MySQL safe, but will appear as expected
to the users.

We use JSON.stringify to transform the details object into a simple String.

And finally we take the INSERT query that we've string bashed together and use it
with an asynchronous MySQL query call. Because it is asynchronous, we use await
to prevent the function from returning before the query is compelte.
*/
async function log_event( code_source, message, ip, details ) {
  const timestamp_string = get_datetime();
  const new_event_id_query =
    "SELECT ketris_db.generate_new_id( 0 ) as new_id;";
  const [new_event_row,new_event_field] =
    await sqlPool.query( new_event_id_query );
  const new_event_id = new_event_row[0].new_id;

  const add_event_query =
    "INSERT INTO event_log " +
    "(event_id, code_source, message, ip, timestamp, details) VALUES " +
    "(" + new_event_id +
    ", \'" + code_source +
    "\', \'" + await process_text( message.toString() ) +
    "\', " +
    "\'" + ip + "\', " +
    "\'" + timestamp_string + "\', " +
    "\'" + JSON.stringify( details ) + "\'" +
    ");";
    const [add_rows,add_fields] = await sqlPool.query( add_event_query );
    return add_rows;
}


/*
This is a simple function to query the MySQL database for the error log and return it.
*/
async function get_error_log( page, page_size ) {
  const error_log_query =
    "SELECT timestamp, severity, source, message, ip, details " +
    "FROM error_log;";
  const [log_rows,log_fields] = await sqlPool.query( error_log_query );
  return log_rows;
}


/*
This is a simple function to query the MySQL database for the event log and return it.
*/
async function get_event_log( page, page_size ) {
  const event_log_query =
    "SELECT timestamp, ip, code_source, message, details " +
    "FROM event_log;";
  const [log_rows,log_fields] = await sqlPool.query( event_log_query );
  return log_rows;
}


/*
These commands expose the following functions to any other files that invoke this file
with the require keyword.
*/
exports.log_error = log_error;
exports.get_error_log = get_error_log;
exports.log_event = log_event;
exports.get_event_log = get_event_log;
exports.process_text = process_text;
