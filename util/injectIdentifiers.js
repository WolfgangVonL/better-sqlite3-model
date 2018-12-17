const _injectIdentifiers = props => {
	const n = {
		id: {type: 'integer' , primary: true , increment: true},
		uuid: {type: 'string' , unique: true , allowNull: false},
		createdAt: {type: 'string'},
		lastUpdated: {type: 'string'}
	}
	for(var i in props) { n[i] = props[i] }
	return n
}

module.exports = _injectIdentifiers