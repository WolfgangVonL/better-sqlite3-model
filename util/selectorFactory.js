const _selectorFactory = (props , loose = false) => {
	if(typeof props == 'number') {
		return ' where id = '+props
	} else if(typeof props == 'string') {
		return ' where uuid = "'+props+'"'
	} else if(typeof props == 'object') {
		var w = []
		for(var i in props) {
			if(typeof props[i] == 'number') {
				w.push(i+' = '+props[i])
			} else if(typeof props[i] == 'string') {
				w.push(i+' = "'+props[i]+'"')
			}
		}
		if(w.length > 0) return ' where '+w.join(loose ? ' or ' : ' and ')
	}
	return ''
}

module.exports = _selectorFactory