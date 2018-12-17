const _injectIdentifiers = props => {
	return {
		id: {type: 'integer' , primary: true , increment: true},
		uuid: {type: 'string' , unique: true , allowNull: false},
		props,
		createdAt: {type: 'string'},
		lastUpdated: {type: 'string'}

	}
}

module.exports = _injectIdentifiers