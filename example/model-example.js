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
		        /*    Relationship definitions - note that the property name has no impact on how the child(ren) are merged into the object.
		        							   - Children will always be merged according to thier classes tableName 
		        							   - if a property has a relationship field, it will not accept any other props, and if multiple 
		        							   - relationships are found, the relationship will be the first one encountered on this list:
		        							   			- manyHasMany
		        							   			- oneHasMany
		        							   			- oneHasOne
		        							   			- hasOne
		        atest: {
					manyHasMany: 'another_test'
		        },
		        btest: {
					oneHasMany: 'another_test'
		        },
		        ctest: {
					oneHasOne: 'another_test'
		        },
		        dtest: {
					hasOne: 'another_test'
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
