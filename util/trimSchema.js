const _walk = require('./walk.js')

const _trimFromSchema = (schema , obj) => {
	_walk(obj , (i,v) => {
		if(i != 'id' && i != 'uuid' && i != 'createdAt' && i != 'lastUpdated') {
			if(!schema.properties[i]) {
				delete(obj[i])
			}
		}
	})
}

module.exports = _trimFromSchema