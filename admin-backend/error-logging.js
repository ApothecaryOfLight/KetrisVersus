const mysql = require('mysql2');

const sqlPool = mysql.createPoolPromise({
  connectionLimmit: 50,
  host: 'localhost',
  user: 'ketris_node_user',
  password: 'ketris_node_user_password',
  database: 'ketris_db',
  multipleStatements: true
});

function pad_with_zero( inNumber ) {
  if( inNumber < 10 ) {
    return "0" + inNumber;
  }
  return inNumber;
}

function pad_milliseconds( inMilliseconds ) {
  console.log( inMilliseconds );
  let outMilliseconds = "";
  if( inMilliseconds < 100 ) {
    outMilliseconds += "0";
    if( inMilliseconds < 10 ) {
      outMilliseconds += "0";
    }
  }
  outMilliseconds += inMilliseconds;
  const inLength = String(outMilliseconds).length;
  const needed_zeroes = 6 - inLength;
  for( let i=0; i<needed_zeroes; i++ ) {
    outMilliseconds += String("0");
  }
  return outMilliseconds;
}

/*
NB: DATETIME's fractional seconds represent microseconds.
Out JavaScript getMilliseconds() provides milliseconds.
1 milliseconds is equal to 1000 microseconds.
So we 
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

async function process_text( inText ) {
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

async function log_error( source, message, severity, ip, details ) {
  const timestamp_string = get_datetime();
  const new_error_id_query =
    "SELECT ketris_db.generate_new_id( 0 ) as new_id;";
  const [new_error_row,new_error_field] =
    await sqlPool.query( new_error_id_query );
  const new_error_id = new_error_row[0].new_id;

  const add_error_query =
    "INSERT INTO error_log " +
    "(error_id, source, message, severity, timestamp, ip, details) VALUES " +
    "(" + new_error_id + 
    ", \'" + source +
    "\', \'" + await process_text( message.toString() ) + "\', " +
    severity + ", " +
    "\'" + timestamp_string + "\', " +
    "\'" + ip + "\', " +
    "\'" + JSON.stringify( details ) + "\'" +
    ");";

  const [add_rows,add_fields] = await sqlPool.query( add_error_query );
  return add_rows;
}

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

async function get_error_log( page, page_size ) {
  const error_log_query =
    "SELECT timestamp, severity, source, message, ip, details " +
    "FROM error_log;";
  const [log_rows,log_fields] = await sqlPool.query( error_log_query );
  return log_rows;
}

async function get_event_log( page, page_size ) {
  const event_log_query =
    "SELECT timestamp, ip, code_source, message, details " +
    "FROM event_log;";
  const [log_rows,log_fields] = await sqlPool.query( event_log_query );
  return log_rows;
}

function get_log_by_search( search, page, page_size ) {

}

exports.log_error = log_error;
exports.get_error_log = get_error_log;
exports.log_event = log_event;
exports.get_event_log = get_event_log;
exports.process_text = process_text;
