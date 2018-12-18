# better-sqlite3-model

A fast and simple model based orm wrapping JoshuaWise's `better-sqlite3`

### Checkout JoshuaWise's better-sqlite3 module [here](https://www.npmjs.com/package/better-sqlite3)

This was built from the need for an orm, and not wanting to switch from sqlite3 and `better-sqlite3 (amazing package)`
This was pulled from private projects and made public in the hopes of helping those on embedded systems or those who just prefer sqlite3

### This package requires your project to have `better-sqlite3` and `uuid` installed

---
---

## Basic Usage
---

#### Connect to a database

```
const Connect = require('better-sqlite3-model').Connect
// the connect function connects to a database file and caches the connection for the orm
// the database can be switched at any time but models will have to be re-initialized after
// the function is a wrapper for 'better-sqlite3's Database contructor and takes the same props
Connect(path,options)
```

---

#### Models are defined by extending the base Model class and implementing `static get tableName()` and `static get jsonSchema()`
#### Any function can be added to the model as long as it does not override the base methods

```javascript
const Model = require('better-sqlite3-model').Model
class ExampleModel extends Model {
	static get tableName() {
		return 'example_model' // this is how models refer to eachother in the database
	}
	static get jsonSchema() { // this defines how the model looks
		// the model is already provided with an id field, and a uuid, createdAt, and lastUpdated fields are added to objects automatically 
		return {
			type: this.tableName, // this field is required but soon to be deprecated
			required: ['name','someData'], // an array of required fields that an object must have before it can be saved
			index: [], //this is experimental and far from ready but is an array of fields to index in a dedicated index table for faster lookups
			json: ['someData','someArrayData'], // this is an array of fields that will be passed through JSON.parse and JSON.stringify on save and load, respectively
			properties: { // this is where the models instance properties and types are declared
				aStringProperty: {type: 'string' , unique: true , allowNull: false},
				aNumberProperty: {type: 'integer'},
				someData: {type: 'object'},
				someArrayData: {type: 'array'},
				// relationships are defined as follows:
				// manyHasMany - loads children and adds them to instance as an array indexed by the 'to' field with a 's' added. e.g. example_models
				manyHasMany: {
					from: this.tableName, // the from field will be used for complex relationships in future versions, but is required for now for future-proofing
					to: SomeOtherModel.tableName
				},
				//oneHasMany - similar to manyHasMany
				oneHasMany: {
					from: this.tableName,
					to: SomeOtherModel.tableName
				},
				// oneHasOne - allows only one of this type of child to be linked, added to the object without array and added 's'
				oneHasOne: {
					from: this.tableName,
					to: SomeOtherModel.tableName
				},
				// hasOne - similar to oneHasOne, but instead of using a lookup table for the child, the childs uuid is stored on the parent in the database,
				// and the child is loaded and added  to the parent on parent load
				hasOne: {
					from: SomeOtherModel.tableName // hasOne only requires the 'from' prop, which is the childs tableName
				}
			}
		}
	}
}
```

---

#### Models are initialized by getting thier dollar sign method
```
ExampleModel.$
```

---

#### Instances are created by calling a models `dispense` function, optionally passing any initial data for the instance
##### instances can be considered regular objects. Any props or functions can be added as long as they dont conflict with the base model
##### and they will be stripped when added to the database. note that added props and functions are not added back on database load
```
var instance = ExampleModel.dispense()
```
#### Instances can be saved and removed by using `instance.save` and `instance.remove` respectively. _Note the lack of parenthesis_

----

#### Instances can be loaded from the database by calling thier models `find` function, passing any selectors
```
var loadedInstance = ExampleModel.find({name: 'example' , uuid: 'hghuhgshthkjhtw4-45234523c46-45c24636c2'})
```
---

#### Instances can be linked (if a relationship is defined)
```
instance.link = loadedInstance
```
#### and unlinked
```
instance.unlink = loadedInstance
```
##### This is done using setter methods, so set link or unlink to the object you want to link/unlink to/from

---

#### Models can hook into slots provided by the base model
##### This can be useful if a boolean field is needed
```
class ExampleModel extends Model {
	...
	preInsert() {
		this.someBoolean ? this.someBoolean = 1 : this.someBoolean = 0;
	}
	preUpdate() {
		this.someBoolean ? this.someBoolean = 1 : this.someBoolean = 0;
	}
	preLoad() {
		this.someBoolean > 0 ? this.someBoolean = true : this.someBoolean = false
	}
	preRemove() {
		...
	}
	preCheckout() {
		...
	}
}
```