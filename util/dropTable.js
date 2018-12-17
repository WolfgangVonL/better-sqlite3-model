
const _removeRelationship = require('../relations.js').remove
const _connectionFactory = require('../connect.js')

const _dropTableFactory = (model) => {
	_removeRelationship(model)
	_connectionFactory().exec('drop table if exists '+model)
}


module.exports = _dropTableFactory