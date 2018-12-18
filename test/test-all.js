const Model = require('../index.js').Model
// import the library
const sqlite_model = require('../index.js')
console.log('Library Imported...')
console.log()

// the connector function is a wrapper for better-sqlite3, creating a connection and caching the connection for the orm
// the function is a wrapper for better-sqlite3's Database constructor, which caches the connection for the orm
const Connector = sqlite_model.Connect
Connector('test.db',{memory: true})

console.log('Database Connected...')
console.log()


class AnotherTest extends Model {
	// Only 'static get tableName' and 'static get jsonSchema' are required to be deifned 
	// Methods can be added to models but beware adding variables to instances as this can lead to undefined results
	static get tableName() {
		return 'another_test' //Tablename can be anything at all, but be sure to use the correct name in relationships, you can always use the child models static tableName for consistency
	}
	static get jsonSchema () {
	    return {
	      	type: 'another_test', //on path to be deprecated, for now set as tableName
	      	required: ['name'], // for best results add unique fields to required list
	      	index: ['name'],  // for best results index required fields
		    properties: {
		        name: {type: 'string' , unique: true , allowNull: false},
	      	}
	    }
	}
}
AnotherTest.$


console.log('Starting test...')
console.log()

// the Model class contains all methods needed except 'static get tableName' and 'static get jsonSchema' which 
// are defined when your models extend the Model class.
//# const Model = sqlite_model.Model


// call the models dollar sign method to initialize the model and create the tables if needed
const TestModel = require('../example/model-example.js')
TestModel.$

console.log('Grabbing example model...')
console.log()

// create new objects by calling the models dispense function, optionally passing an object of data to be merged in
var testObject = TestModel.dispense()
console.log('Dispensed Test Object:')
console.log(testObject)
console.log()
console.log()
// objects are dispensed with a uuid, createdAt timestamp, and lastUpdated timestamp

// objects are used as normal, and saved by triggering its 'get save()' function
testObject.name = 'testing123'
testObject.save

console.log('Saved Test Object:')
console.log(testObject)
console.log()
console.log()

// objects can also use json if the field is labelled as json in their jsonSchema
// see the example model for details
console.log('%%BP1-------------------------------------------------------')
var anotherTestObject = AnotherTest.dispense()
anotherTestObject.name = 'anotherTest'
anotherTestObject.data = {testData: 'hello'}
anotherTestObject.arrayData = ['someData','someMoreData']
anotherTestObject.save
console.log('%%BP2-------------------------------------------------------')

console.log('Other Test Object With Data')
console.log(anotherTestObject)
console.log()
console.log()

// objects can be linked if a relationship is established in the parents jsonSchema
// if the relationship is manyHasMany or oneHasMany then this can be repeated to add as many children as needed
testObject.link = anotherTestObject

console.log('Linked Test Objects:')
console.log(testObject)
console.log()
console.log()

// you can get objects from the database by calling its models find method and passing in any required field
// if the object has children they are loaded automatically
testObject = TestModel.find({name: 'testing123'})
anotherTestObject = AnotherTest.find({name: 'anotherTest'})

console.log('Test Objects From Database:')
console.log(testObject)
console.log(anotherTestObject)
console.log()
console.log()

// linked objects can also be unlinked
testObject.unlink = anotherTestObject

console.log('Unlinked Test Objects')
console.log(testObject)
console.log()
console.log()

// objects are removed by triggering its remove handle
testObject.remove
anotherTestObject.remove

console.log('Test Complete')