const _walk = require('./walk.js')

const _checkType = (schema , obj) => {
	_walk(schema.properties , (i,v) => {
		if(obj[i]) {
			switch(v.type) {
				case 'string':
					if(typeof obj[i] != 'string') {
						throw Error('schema validation failed')
					}
				break;
				case 'integer':
					if(typeof obj[i] != 'number') {
						throw Error('schema validation failed')
					}
				break;
				case 'array':
				case 'object':
					if(typeof obj[i] != 'object') {
						throw Error('schema validation failed')
					}
				break;
			}
		}
	})
}

module.exports = _checkType