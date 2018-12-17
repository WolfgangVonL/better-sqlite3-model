const _walk = require('./walk.js')

const _trimFromSchema = (schema , obj) => {
	_walk(obj , (i,v) => {
		if(!schema.properties[i]) {
			delete(obj[i])
		}
	})
}

module.exports = _trimFromSchema