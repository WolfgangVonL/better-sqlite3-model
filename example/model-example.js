const Model = require('../index.js').Model

class Test extends Model {
	// Only 'static get tableName' and 'static get jsonSchema' are required to be deifned 
	// Methods can be added to models but beware adding variables to instances as this can lead to undefined results
	static get tableName() {
		return 'test' //Tablename can be anything at all, but be sure to use the correct name in relationships, you can always use the child models static tableName for consistency
	}
	// this is the schema that the table and relationships are built from
	static get jsonSchema () {
	    return {
	      	type: 'test', //on path to be deprecated, for now set as tableName
	      	required: ['name'], // for best results add unique fields to required list
	      	json: ['data' , 'arrayData'],
		    properties: {
		        name: {type: 'string' , unique: true , allowNull: false},
		        data: {type: 'object'}, 
		        arrayData: {type: 'object'}, 
		        /*    Relationship definitions
		        manyHasMany: {
		        	from: this.tableName,
		        	to: 'another_test'
		        },
		        oneHasMany: {
		        	from: this.tableName,
		        	to: 'another_test'
		        },
		        oneHasOne: {
		        	from: this.tableName,
		        	to: 'another_test'
		        },
		        test: {    // this is a hasOne relationship with the Test class. 
		        		   // key must match 'from'
		        	hasOne: {
		        		from: 'another_test'
		        	}
		        }
		        */
	      	}
	    }
	}
}

module.exports = Test

/*

	example object:
		Test {
			//handles
			get save() saves object and children
			get remove() removes object and associations
			set link(child) link object to child based on defined relation
			set unlink(child) unlink object to child based on defined relation

			//internal
			id: 0
			uuid: '0'
			createdAt: 0
			lastUpdated: 0
			
			//user defined
			name: ''
			data: {}
			arrayData: []

			//linked objects are added according to their table name and relationship
				example - Test as a child
					manyHasMany
						tests: [Test , Test]
					oneHasMany
						tests: [Test , Test]
					oneHasOne
						test: Test
					hasOne
						test: Test
		}
*/
