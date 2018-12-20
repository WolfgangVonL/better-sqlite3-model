const _createRelationship = require('../relations.js').create
const _connectionFactory = require('../connect.js')
const _injectIdentifiers = require('./injectIdentifiers.js')
const _createTableFactory = (model , props) => {
	var j = []
	var rel = []
	
	props = _injectIdentifiers(props)
	for(var i in props) {
		var p = props[i]
		
		
		if(p.manyHasMany) {
			var rels = 'create table if not exists '+model+'_'+p.manyHasMany+' ( id integer primary key , '+model+' text , '+p.manyHasMany+' text ,'
			rels += ' foreign key ('+model+') references '+model+'(uuid) ,'
			rels += ' foreign key ('+p.manyHasMany+') references '+p.manyHasMany+'(uuid))'
			_createRelationship(model , p.manyHasMany , {manyHasMany:true})
			rel.push(rels)
			continue
		} else if(p.oneHasMany) {
		 	var rels = 'create table if not exists '+model+'_'+p.oneHasMany+' ( id integer primary key , '+model+' text , '+p.oneHasMany+' text ,'
			rels += ' foreign key ('+model+') references '+model+'(uuid) ,'
			rels += ' foreign key ('+p.oneHasMany+') references '+p.oneHasMany+'(uuid))'
			_createRelationship(model , p.oneHasMany , {oneHasMany:true})
			rel.push(rels)
			continue
		} else if(p.oneHasOne) {
			var rels = 'create table if not exists '+model+'_'+p.oneHasOne+' ( id integer primary key , '+model+' text , '+p.oneHasOne+' text ,'
			rels += ' foreign key ('+model+') references '+model+'(uuid) ,'
			rels += ' foreign key ('+p.oneHasOne+') references '+p.oneHasOne+'(uuid))'
			_createRelationship(model , p.oneHasOne , {oneHasOne:true})
			rel.push(rels)
			continue
		} else if(p.hasOne) {
			d = i+' text , foreign key ('+i+') references '+p.hasOne+'(uuid)'
			j.push(d)
			_createRelationship(model , p.hasOne , {hasOne:true})
			continue
		}
		var d = ''
		d += i
		p.type == 'string' ? d += ' text' : d += ' '+p.type
		p.primary ? d += ' primary key' : null
		p.increment ? d += ' autoincrement' : null
		p.unique ? d += ' unique': null
		p.allowNull === false ? d += ' not null' : null
		j.push(d)
	}
	var sql = 'create table if not exists '+model+' ( '+j.join(' , ')+' )'
	
	
	
	_connectionFactory().exec(sql)
	rel.map(r => {
		_connectionFactory().exec(r) 
	})
}

module.exports = _createTableFactory