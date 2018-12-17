
const _moveUuidToBack = obj => {
	var ui = obj.uuid
	delete(obj.uuid)
	obj =  {
		...obj,
		uuid: ui
	}
}

module.exports = _moveUuidToBack