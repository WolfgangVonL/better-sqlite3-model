const _extractFrom = (search , obj) => {
	var e = {}
	for(var i in obj) {
		if(search.includes(i)) {
			e[i] = obj[i]
		}
	}
	return e
}


module.exports = _extractFrom