
const uuid = require('uuid/v4')

const _disassociateObject = require('./util/disassociate.js')
const _init = require('./util/initModel.js')
const _poke = require('./util/poke.js')
const _checkRequired = require('./util/checkRequired.js')
const _checkType = require('./util/checkType.js')
const _connectionFactory = require('./connect.js')
const _extractFrom = require('./util/extract.js')
const _selectorFactory = require('./util/selectorFactory.js')
const _trimFromSchema = require('./util/trimSchema.js')
const _parameterSqlFactory = require('./util/parameterFactory.js')
const _stripKeysFactory = require('./util/stripKeys.js')
const _injectEmptySchema = require('./util/injectSchema.js')
const _getSchemaUnique = require('./util/getUnique.js')
const _moveUuidToBack = require('./util/moveUuid.js')
const _sjsp = require('./util/sjsp.js').p
const _sjss = require('./util/sjsp.js').s
const _stripRelations = require('./relations.js').strip
const _loadRelations = require('./relations.js').graph
const _linkModels = require('./relations.js').link
const _unlinkModels = require('./relations.js').unlink
const _walk = require('./util/walk.js')

var __models = {}
var __tables = {}


class Model {
	constructor(props) {
		if(this.constructor.name === 'Model') {
			throw Error('Model must be extended to use')
		}
		this.$
		if(props) {
			for(var i in props) {
				this[i] = props[i]
			}
		}
		this.$preLoad
	}
	get $() {
		_init(this.constructor)	
	}
	get $preCheckout() {
		this.uuid = uuid()
		if(!this.createdAt) {
			this.createdAt = Date.now()
		}
		this.lastUpdated = Date.now()
		return this
	}
	get $preLoad() {
		var model = this.constructor
		var schema = model.jsonSchema
		if(schema.json) {
			schema.json.map(p => {
				if(this[p]) {
					this[p] = _sjsp(this[p])
				}
			})
		}
		this.lastUpdated = Date.now()
		this.$loadChildren()
	}
	get $preInsert() {
		var model = this.constructor
		var schema = model.jsonSchema
		var dis = _disassociateObject(this)
		_checkRequired(schema , dis)
		_trimFromSchema(schema , dis)
		_checkType(schema , dis)
		if(schema.json) {
			schema.json.map(p => {
				if(dis[p]) {
					dis[p] = _sjss(dis[p])
				}
			})
		}
		return _stripRelations(dis)
	}
	get $preUpdate() {
		var model = this.constructor
		var schema = model.jsonSchema
		var dis = _disassociateObject(this)
		_checkRequired(schema , dis)
		_trimFromSchema(schema , dis)
		_checkType(schema , dis)
		_moveUuidToBack(dis)
		if(schema.json) {
			schema.json.map(p => {
				if(dis[p]) {
					dis[p] = _sjss(dis[p])
				}
			})
		}
		this.lastUpdated = Date.now()
		return _stripRelations(dis)
	}
	get $preRemove() {
		return {uuid: this.uuid}
	}
	get $loadChildren() {
		var relg = _loadRelations(this)
		//Process relationship graph
		var model = this.constructor
		if(Object.keys(relg.manyHasMany).length > 0) {
			_walk(relg.manyHasMany , (childName,rels) => {
				if(!__tables[childName.slice(0,-1)]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName.slice(0,-1)]
				this[childName] = []
				rels.map(r => {
					var cuid = r[childName]
					this[childName].push(cmodel.find({uuid: cuid}))
				})
			})
		} else if(Object.keys(relg.oneHasMany).length > 0) {
			_walk(relg.oneHasMany , (childName,rels) => {
				if(!__tables[childName]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName.slice(0,-1)]
				this[childName] = []
				rels.map(r => {
					var cuid = r[childName]
					this[childName].push(cmodel.find({uuid: cuid}))
				})
			})
		} else if(relg.oneHasOne) {
			_walk(relg.oneHasOne , (childName,rel) => {
				if(!__tables[childName]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName]
				var cuid = rel[childName]
				this[childName] = cmodel.find({uuid: cuid})
			})
		} else if(relg.hasOne) {
			_walk(relg.hasOne , (childName,rel) => {
				if(!__tables[childName]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName]
				var cuid = rel[childName]
				this[childName] = cmodel.find({uuid: cuid})
			})
		}
	}
	set link(child) {
		_linkModels(this,child)
		this.$loadChildren()
		this.lastUpdated = Date.now()
	}
	set unlink(child) {
		_unlinkModels(this,child)
		this.$loadChildren()
		this.lastUpdated = Date.now()
	}
	get save() {
		var model = this.constructor
		Model.save(model,this)
		this.lastUpdated = Date.now()
	}
	get remove() {
		var model = this.constructor
		Model.remove(model,this)
	}
	static get $() {
		if(!__models[this.name]) {
			__models[this.name] = this
			__tables[this.tableName] = this
		}
		_init(this)	
	}
	static find(sel) {
		this.$
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use findOne , findAll , or findEach instead')
		}
		return this.findOne(this.tableName , sel)
	}
	static dispense(props) {
		this.$
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use checkout instead')
		}
		return this.checkout(this.tableName , props)
	}
	static create(obj) {
		this.$
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use createOne or createAll instead')
		}
		if(obj.preInsert) obj.preInsert()
		this.createOne(this.tableName,obj.$preInsert)
		if(obj.postInsert) obj.postInsert()
	}
	static save(obj) {
		this.$
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use updateOne or updateAll instead')
		}
		if(_poke(this.tableName , _extractFrom(_getSchemaUnique(this) , obj)) == undefined) return this.create(obj)
		if(obj.preUpdate) obj.preUpdate() 
		this.updateOne(this.tableName,obj.$preUpdate)
		if(obj.postUpdate) obj.postUpdate()
	}
	static remove(obj) {
		this.$
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use removeOne or removeAll instead')
		}
		if(obj.preRemove) obj.preRemove()
		this.removeOne(this.tableName,obj.$preRemove)
	}




	static checkout(model , props) {
		this.$
		if(!__models[model]) {
			throw Error('Caanot checkout: cannot lookup model name')
		}
		var obj = new __models[model](props)
		if(obj.preCheckout) obj.preCheckout()
		return _injectEmptySchema(model , obj.$preCheckout)
	}
	static findOne(model,props) {
		this.$
		return new this(_connectionFactory().prepare('select * from '+model+_selectorFactory(props)).get())
	}
	static findAll(model,props) {
		this.$
		return _connectionFactory().prepare('select * from '+model+_selectorFactory(props)).all().map(o => {
			return new this(o)
		})
	}
	static findEach(model,props,cb,chunksize = false) {
		this.$
		var stmt = _connectionFactory().prepare('select * from '+model+_selectorFactory(props))
		for(const row of stmt.iterate()) {
			if(chunksize) { 
				if(chunks.length <= chunksize) { 
					chunks.push(new this(row)) 
				} else {
					cb(chunks) 
					chunks = [new this(row)] 
				} 
			} else { 
				cb(new this(row)) 
			} 
		}
		if(chunksize && chunks.length > 0) cb(new this(chunks))
	}
	static removeOne(model , props) {
		this.$
		return _connectionFactory().prepare('delete from '+model+_selectorFactory(props)).run().changes
	}
	static removeAll(model , props) {
		this.$
		return props.map(o => Model.removeOne(model,o) )
	}
	static updateOne(model , props) {
		this.$
		return _connectionFactory().prepare(_parameterSqlFactory('u',model,props)).run(_stripKeysFactory(props)).changes
	}
	static updateAll(model , props) {
		this.$
		return props.map(o => Model.updateOne(model,o) )
	}
	static createOne(model , props) {
		this.$
		return _connectionFactory().prepare(_parameterSqlFactory('c',model,props)).run(_stripKeysFactory(props)).lastInsertRowid
	}
	static createAll(model , props) {
		this.$
		return props.map(o => Model.createOne(model,o) )
	}
}



module.exports = Model