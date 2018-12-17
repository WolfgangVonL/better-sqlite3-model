const _createRelationship = require('../relations.js').create
const _connectionFactory = require('../connect.js')
const _createTableFactory = (model , props) => {
	var j = []
	var rel = []
	props = _injectIdentifiers(props)
	for(var i in props) {
		var p = props[i]
		if(i == 'manyHasMany') {
			var rels = 'create table if not exists '+p.from+'_'+p.to+' ( id integer primary key , '+p.from+' text , '+p.to+' text ,'
			rels += ' foreign key ('+p.from+') references '+p.from+'(uuid) ,'
			rels += ' foreign key ('+p.to+') references '+p.to+'(uuid)'
			_createRelationship(p.from , p.to , {manyHasMany:true})
			rel.push(rels)
			continue
		} else if(i == 'oneHasMany') {
			var rels = 'create table if not exists '+p.from+'_'+p.to+' ( id integer primary key , '+p.from+' text , '+p.to+' text ,'
			rels += ' foreign key ('+p.from+') references '+p.from+'(uuid) ,'
			rels += ' foreign key ('+p.to+') references '+p.to+'(uuid)'
			_createRelationship(p.from , p.to , {oneHasMany:true})
			rel.push(rels)
			continue
		} else if(i == 'oneHasOne') {
			var rels = 'create table if not exists '+p.from+'_'+p.to+' ( id integer primary key , '+p.from+' text , '+p.to+' text ,'
			rels += ' foreign key ('+p.from+') references '+p.from+'(uuid) ,'
			rels += ' foreign key ('+p.to+') references '+p.to+'(uuid)'
			_createRelationship(p.from , p.to , {oneHasOne:true})
			rel.push(rels)
			continue
		}
		var d = ''
		d += i
		p.type ? d += ' '+p.type : d += ' string'
		p.primary ? d += ' primary key' : null
		p.increment ? d += ' autoincrement' : null
		p.unique ? d += ' unique': null
		p.allowNull === false ? d += ' not null' : null
		if(p.hasOne) {
			_createRelationship(model , p.from , {hasOne:true})
			d += ' , foreign key '+i+' references '+p.from+'(uuid)'
		}
		j.push(d)
	}
	var sql = 'create table if not exists '+model+' ( '+j.join(' , ')+' )'
	_connectionFactory().exec(sql)
	rel.map(r => _connectionFactory().exec(r) )

}

module.exports = _createTableFactory