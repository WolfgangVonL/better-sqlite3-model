const _stripKeysFactory = input => {
	var output = []
	for(var i in input) {
		output.push(input[i])
	}
	return output
}

module.exports = _stripKeysFactory