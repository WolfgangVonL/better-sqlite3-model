const _walk = require('./walk.js')

const _checkRequired = (schema , obj) => {
	_walk(schema.required , (i,v) => {
		if(!obj[v]) {
			if(!schema.properties[i].unique) {
				switch(schema.properties[i].type) {
					case 'string': obj[i] = ''
						break;
					case 'integer': obj[i] = 0
						break;
					case 'array': obj[i] = []
						break;
					case 'object': obj[i] = {}
						break;
				}
			} else throw Error('Required field is undefined!')
		}
	})
}

module.exports = _checkRequired