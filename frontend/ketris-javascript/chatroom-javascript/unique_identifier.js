'use strict';


/*
This class handles the creation and deletion of unique identifiers.

Both generate_uid and retireUID require an inField specification. This denoates a
'field.'

Each 'field,' has its own set of unique values. One is used for users, another is
used for games, etc.

A field is created when generate_uid is called for the first time with that field as
the given parameter (inField).

So you can use this to generate an arbitrary number of fields, each with its own
independent set of unique identifiers.

Seperate fields may, and likely will, overlap. Uniqueness is not guaranteed across
fields, only within each field.
*/
class UID {
    constructor() {
      this.UIDs = [];
    }
    generateUID( inField ) {
      if( !this.UIDs[inField] ) {
        this.UIDs[inField] = {
          counter: 1,
          retiredIDs : []
        };
        return 0;
      } else if( this.UIDs[inField].retiredIDs.length ) {
        return this.UIDs[inField].retiredIDs.pop();
      } else {
        return this.UIDs[inField].counter++;
      }
    }
    retireUID( inField, inUID ) {
      this.UIDs[inField].retiredIDs.push( inUID );
    }
  }