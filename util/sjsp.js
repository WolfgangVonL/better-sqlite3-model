
const sjsp = {}
sjsp.p = input => {
	try {
		return JSON.parse(input)
	} catch(e) {
		return input
	}
}
sjsp.s = input => JSON.stringify(input)
	

module.exports = sjsp