
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

  function format_datetime( inDate ) {
    const year = inDate.getFullYear();
    const month = pad_with_zero(inDate.getMonth() + 1);
    const day = pad_with_zero( inDate.getDate() );
    const hours = pad_with_zero( inDate.getHours() );
    const minutes = pad_with_zero( inDate.getMinutes() );
    const seconds = pad_with_zero( inDate.getSeconds() );
    const milliseconds = pad_milliseconds( inDate.getMilliseconds() );
  
    const MySQLDateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  
    return MySQLDateTime;
  }