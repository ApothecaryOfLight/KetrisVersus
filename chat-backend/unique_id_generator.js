class unique_id_generator {
    constructor() {
      this.UIDs = [];
    }
    generate_uid( inField ) {
      if( typeof( this.UIDs[inField] ) == "undefined" ) {
        console.log( "Generating first UID of field " + inField + "." );
        this.UIDs[inField] = {
          counter: 1,
          retiredIDs : []
        };
        return 0;
      } else if( this.UIDs[inField].retiredIDs.length > 0 ) {
        console.log( "Issuing retired UID of field " + inField + ", which is " + this.UIDs[inField].retiredIDs[this.UIDs[inField].retiredIDs.length-1] + "." );
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

  exports.unique_id_generator = unique_id_generator;