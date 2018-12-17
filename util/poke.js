

const _selectorFactory = require('./selectorFactory.js')
const _connectionFactory = require('../connect.js')

const _poke = (model , sel) => {
	var sql = 'select 1 from '+model+_selectorFactory(sel)
	return _connectionFactory().prepare(sql).get() && true
}


module.exports = _poke