class unique_id_generator {
    constructor() {
        this.UIDs = [];
    }
    generate_uid( inField ) {
        if( typeof( this.UIDs[inField] ) == "undefined" ) {
            this.UIDs[inField] = {
                counter: 1,
                retiredIDs : []
            };
            return 0;
        } else if( this.UIDs[inField].retiredIDs.length > 0 ) {
            return this.UIDs[inField].retiredIDs.pop();
        } else {
            return this.UIDs[inField].counter++;
        }
    }
    retireUID( inField, inUID ) {
        this.UIDs[inField].retiredIDs.push( inUID );
    }
}

exports.unique_id_generator = unique_id_generator;