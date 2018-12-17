

class Gravatar extends Model{
	static get tableName() {
		return 'gravatar'
	}
	static get jsonSchema () {
	    return {
	      	type: 'gravatar',
	      	required: ['name','path'],
	      	index: ['name','path'],
	      	json: [],
		    properties: {
		        name: {type: 'string' , unique: true , allowNull: false},
		        path: {type: 'string' , unique: true , allowNull: false},
		        active: {type: 'integer'},
		        manyHasMany: {
		        	from: this.tableName,
		        	to: 'manytomanytest'
		        },
		        oneHasMany: {
		        	from: this.tableName,
		        	to: 'onetomanytest'
		        },
		        oneHasOne: {
		        	from: this.tableName,
		        	to: 'onetoonetest'
		        },
		        hasOne: {
		        	from: this.tableName,
		        	to: 'hasonetest'
		        }
	      	}
	    }
	}
}


/*

	example object:
		Gravatar {
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
			name:
			path:
			active:

			//linked objects
			manytomanytest: []
			onetomanytest: []
			onetotonetest: {}
			hasonetest: {}
		}
*/
