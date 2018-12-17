
const _validateJsonSchema = (model , obj) => {
	var pass = true
	for(var i in model.jsonSchema.properties) {
		if(obj[model.jsonSchema.properties[i]] || pass == false) {
			continue
		} else {
			pass = false
		}
	}
	model.jsonSchema.required.map(r => {
		if(!obj[r]) {
			pass = false
		}
	})
	return pass
}

module.exports = _validateJsonSchema