const path = require('path')

const bsql = require('better-sqlite3')
var connections = {};
var last_connection;

const _connectionFactory = (dpath , options) => {
	if(!dpath && last_connection) return last_connection 
	if(connections[dpath+JSON.stringify(options)]) return connections[dpath+JSON.stringify(options)]
	connections[dpath+JSON.stringify(options)] = new bsql(dpath,options)
	last_connection = connections[dpath+JSON.stringify(options)]
	return connections[dpath+JSON.stringify(options)]
}
module.exports = _connectionFactory