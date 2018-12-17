
const _getSchemaUnique = model => {
	var u = []
	for(var i in model.jsonSchema.properties) {
		var p = model.jsonSchema.properties[i]
		if(p.unique) {
			u.push(i)
		}
	}
	return u
}

module.exports = _getSchemaUnique