
const _createTableFactory = require('./createTable.js')

const initted = []

const _init = model => {
	if(!initted.includes(model.tableName)) _createTableFactory(model.tableName , model.jsonSchema.properties)
}



module.exports = _init