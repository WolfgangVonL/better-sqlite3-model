
module.exports = {
	p: in => {
		try {
			return JSON.parse(in)
		} catch() {
			return in
		}
	},
	s: in => JSON.stringify(in)
}