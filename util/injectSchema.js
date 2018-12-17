
const _injectEmptySchema = (model , obj) => {
	var reltyp = ['manyHasMany' , 'oneHasMany' , 'oneHasOne' , 'hasOne']
	for(var i in model.jsonSchema.properties) {
		if(!reltyp.includes(i)) {
			if(obj[i]) continue;
			if(model.jsonSchema.required && !model.jsonSchema.required.includes(i)) continue
			switch(model.jsonSchema.properties[i].type) {
				case 'string': obj[i] = ''
				break;
				case 'integer': obj[i] = 0
				break;
			}
		}
	}
	return obj
}

module.exports _injectEmptySchema