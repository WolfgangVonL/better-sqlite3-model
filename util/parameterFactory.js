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
			var w;
			var sql = 'update '+model+' set '
			var n = 0
			for(var i in props) {
				n++
				if(n == Object.keys(props).length) {
					w = ' where '+i+' = ?'
				} else {
					p.push(i+' = ?')
				}
			}
			sql += p.join(' , ')+w
			return sql
		break;
	}
}
module.exports = _parameterFactory