'use strict';

class UID {
    constructor() {
      this.UIDs = [];
    }
    generateUID( inField ) {
      console.log( "Generating first UID of field " + inField + "." );
      if( !this.UIDs[inField] ) {
        this.UIDs[inField] = {
        counter: 1,
        retiredIDs : []
        };
        return 0;
      } else if( this.UIDs[inField].retiredIDs.length ) {
        console.log( "Issuing retired UID of field " + inField + "." );
        return this.UIDs[inField].retiredIDs.pop();
      } else {
        console.log( "Generating new UID of field " + inField + "." );
        return this.UIDs[inField].counter++;
      }
    }
    retireUID( inField, inUID ) {
      console.log( "reitiring UID " + inUID + " of " + inField );
      this.UIDs[inField].retiredIDs.push( inUID );
    }
  }