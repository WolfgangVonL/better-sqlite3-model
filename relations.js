

const _connectionFactory = require('./connect.js')
const _poke = require('./util/poke.js')

var relations = {
	manyHasMany: [],
	oneHasMany: [],
	oneHasOne: [],
	hasOne: []
}

const _createRelationship = (from , to , type) => {
	if(type.manyHasMany) {
		var f = false
		relations.manyHasMany.map(r => {
			if(from == r.from && to == r.to) {
				f = true
			}
		})
		if(!f) {
			relations.manyHasMany.push({from: from , to: to})
		}
	} else if(type.oneHasMany) {
		var f = false
		relations.oneHasMany.map(r => {
			if(from == r.from && to == r.to) {
				f = true
			}
		})
		if(!f) {
			relations.oneHasMany.push({from: from , to: to})
		}
	} else if(type.oneHasOne) {
		var f = false
		relations.oneHasOne.map(r => {
			if(from == r.from && to == r.to) {
				f = true
			}
		})
		if(!f) {
			relations.oneHasOne.push({from: from , to: to})
		}
	} else if(type.hasOne) {
		var f = false
		relations.hasOne.map(r => {
			if(from == r.from && to === r.to) {
				f = true
			}
		})
		if(!f) {
			relations.hasOne.push({from: from , to: to})
		}
	} else {
		throw Error('Cannot create relationship, incorrect relationship type')
	}
}
const _removeRelationship = (from) => {
	relations.manyHasMany.map((r,i) => {
		if(r.from == from) {
			_connectionFactory().exec('drop table if exists '+r.from+'_'+r.to)
			relations.manyHasMany[i] = undefined
			delete(relations.manyHasMany[i])
		}
	})
	relations.oneHasMany.map((r,i) => {
		if(r.from == from) {
			_connectionFactory().exec('drop table if exists '+r.from+'_'+r.to)
			relations.oneHasMany[i] = undefined
			delete(relations.oneHasMany[i])
		}
	})
	relations.oneHasOne.map((r,i) => {
		_connectionFactory().exec('drop table if exists '+r.from+'_'+r.to)
		if(r.from == from) {
			relations.oneHasOne[i] = undefined
			delete(relations.oneHasOne[i])
		}
	})
	relations.hasOne.map((r,i) => {
		if(r.from == from) {
			relations.hasOne[i] = undefined
			delete(relations.hasOne[i])
		}
	})

}


const _link = (parent , child) => {
	var ptable = parent.constructor.tableName
	var ctable = child.constructor.tableName
	
	relations.manyHasMany.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(!_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('insert into '+r.from+'_'+r.to+' ( '+ptable+' , '+ctable+' ) values ( "'+parent.uuid+'" , "'+child.uuid+'" )').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.oneHasMany.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(!_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('insert into '+r.from+'_'+r.to+' ( '+ptable+' , '+ctable+' ) values ( "'+parent.uuid+'" , "'+child.uuid+'" )').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.oneHasOne.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(!_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('insert into '+r.from+'_'+r.to+' ( '+ptable+' , '+ctable+' ) values ( "'+parent.uuid+'" , "'+child.uuid+'" )').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.hasOne.map(r => {
		if(r.from == ptable && r.to == ctable) {
			parent[ctable] = child
			parent.save
		}
	})
}

const _unlink = (parent , child) => {
	var ptable = parent.constructor.tableName
	var ctable = child.constructor.tableName
	relations.manyHasMany.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('delete from '+r.from+'_'+r.to+' where '+ptable+' = "'+parent.uuid+'" and '+ctable+' = "'+child.uuid+'"').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.oneHasMany.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('delete from '+r.from+'_'+r.to+' where '+ptable+' = "'+parent.uuid+'" and '+ctable+' = "'+child.uuid+'"').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.oneHasOne.map(r => {
		if(r.from == ptable && r.to == ctable) {
			var s = {}
			s[ptable] = parent.uuid
			s[ctable] = child.uuid
			if(_poke(r.from+'_'+r.to , s)) {
				_connectionFactory().prepare('delete from '+r.from+'_'+r.to+' where '+ptable+' = "'+parent.uuid+'" and '+ctable+' = "'+child.uuid+'"').run()
			} else {
				return false
			}
			return true
		}
	})
	relations.hasOne.map(r => {
		if(r.from == ptable && r.to == ctable) {
			parent[ctable] = undefined
			delete(parent[ctable])
		}
	})
}

const _saveChildren = (table , obj) => {
	var save =[]
	relations.manyHasMany.map(r => {
		if(r.from == table) {
			var childTable = r.to+'s'
			if(obj[childTable]) {
				obj[childTable].map(c => save.push(c))
			}
		}
	})
	relations.oneHasMany.map(r => {
		if(r.from == table) {
			var childTable = r.to+'s'
			if(obj[childTable]) {
				obj[childTable].map(c => save.push(c))
			}
		}
	})
	relations.oneHasOne.map(r => {
		if(r.from == table) {
			var childTable = r.to
			if(obj[childTable]) {
				save.push(obj[childTable])
			}
		}
	})
	relations.hasOne.map(r => {
		if(r.from == table) {
			var childTable = r.to
			if(obj[childTable]) {
				save.push(obj[childTable])
			}
		}
	})	
	save.map(s => {
		s.save
	})
}

const _stripRelationships = (table , obj) => {
	var save =[]
	relations.manyHasMany.map(r => {
		if(r.from == table) {
			var childTable = r.to+'s'
			if(obj[childTable]) {
				obj[childTable] = undefined
				delete(obj[childTable])
			}
		}
	})
	relations.oneHasMany.map(r => {
		if(r.from == table) {
			var childTable = r.to+'s'
			if(obj[childTable]) {
				obj[childTable] = undefined
				delete(obj[childTable])
			}
		}
	})
	relations.oneHasOne.map(r => {
		if(r.from == table) {
			var childTable = r.to
			if(obj[childTable]) {
				obj[childTable] = undefined
				delete(obj[childTable])
			}
		}
	})
	relations.hasOne.map(r => {
		if(r.from == table) {
			var childTable = r.to
			if(obj[childTable]) {
				
				obj[childTable] = obj[childTable].uuid
			}
		}
	})	
	return obj
}

const _getRelationsGraph = (obj) => {
	var table = obj.constructor.tableName
	

	var rel = {
		oneHasOne: {},
		oneHasMany: {},
		manyHasMany: {},
		hasOne: {}
	}
	for(var i in relations.manyHasMany) {
		var r = relations.manyHasMany[i]
		if(r.from == table) {
			var childTable = r.to
			var k = childTable+'s'
			rel.manyHasMany[k] = _connectionFactory().prepare('select * from '+table+'_'+childTable+' where '+table+' = "'+obj.uuid+'"').all()
		}
	}
	for(var i in relations.oneHasMany) {
		var r = relations.oneHasMany[i]
		if(r.from == table) {
			var childTable = r.to
			var k = childTable+'s'
			rel.oneHasMany[k] = _connectionFactory().prepare('select * from '+table+'_'+childTable+' where '+table+' = "'+obj.uuid+'"').all()
		}
	}
	for(var i in relations.oneHasOne) {
		var r = relations.oneHasOne[i]
		if(r.from == table) {
			var childTable = r.to
			var k = childTable
			rel.oneHasOne[k] = _connectionFactory().prepare('select * from '+table+'_'+childTable+' where '+table+' = "'+obj.uuid+'"').one()
		}
	}
	for(var i in relations.hasOne) {
		var r = relations.hasOne[i]
		if(r.from == table) {
			var childTable = r.to
			if(obj[childTable]) {
				if(typeof obj[childTable] == 'object') {
					rel.hasOne[childTable] = obj[childTable].uuid
				} else {
					rel.hasOne[childTable] = obj[childTable]
				}
			}
		}
	}
	return rel
}


module.exports = {
	create: _createRelationship,
	remove: _removeRelationship,
	strip: _stripRelationships,
	graph: _getRelationsGraph,
	link: _link,
	unlink: _unlink,
	saveChildren: _saveChildren

}


