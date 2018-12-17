
const _walk = (o , cb) => {
	for(var i in o) {
		if(cb(i,o[i]) === true) {
			break;
		}
	}
}

module.exports = _walk