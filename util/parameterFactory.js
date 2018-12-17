const _parameterFactory = (mode , model , props) => {
	switch(mode) {
		case 'c':
			var p = []
			var sql = 'insert into '+model+' ( '
			for(var i in props) { p.push(i) }
			sql += p.join(' , ')+' ) values ( '+p.map(i => '?').join(' , ')+' )'
			return sql
		break;
		case 'u':
			var p = []
			var sql = 'update '+model+' set '
			for(var i in props) {
				p.push(i+' = ?')
			}
			sql += p.join(' , ')
			return sql
		break;
	}
}
module.exports = _parameterFactory