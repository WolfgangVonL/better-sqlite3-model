
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
const _sjsp = require('./util/sjsp.js').p
const _sjss = require('./util/sjsp.js').s
const _stripRelations = require('./relations.js').strip
const _loadRelations = require('./relations.js').graph
const _linkModels = require('./relations.js').link
const _unlinkModels = require('./relations.js').unlink
const _saveChildren = require('./relations.js').saveChildren
const _walk = require('./util/walk.js')

var __models = {}
var __tables = {}

var __dollarSignCalls = []

class Model {
	constructor(props) {

		if(this.constructor.name === 'Model') {
			throw Error('Model must be extended to use')
		}

		if(props) {
			for(var i in props) {
				this[i] = props[i]
			}
		}
		this.$preLoad
	}
	get $preCheckout() {
		if(!this.createdAt) {
			this.createdAt = Date.now()
		}
		this.lastUpdated = Date.now()
		var schema = this.constructor.jsonSchema
		if(schema.json) {
			schema.json.map(p => {
				if(this[p]) {

					this[p] = _sjsp(this[p])
				}
			})
		}
		return this
	}
	get $preLoad() {
		var schema = this.constructor.jsonSchema
		if(schema.json) {
			schema.json.map(p => {
				if(this[p]) {

					this[p] = _sjsp(this[p])
				}
			})
		}
		this.lastUpdated = Date.now()
	}
	get $preInsert() {
		var schema = this.constructor.jsonSchema
		_saveChildren(this)
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
		return _stripRelations(this.constructor.tableName , dis)
	}
	get $preUpdate() {
		var schema = this.constructor.jsonSchema
		_saveChildren(this)
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
		this.lastUpdated = Date.now()

		dis = _stripRelations(this.constructor.tableName ,  dis)

		return dis
	}
	get $preRemove() {

		return {uuid: this.uuid}
	}
	get $loadChildren() {

		//
		//
		var relg = _loadRelations(this)
		//
		//
		//
		//Process relationship graph
		var model = this.constructor

			for(var childName in relg.manyHasMany) {
				var rels = relg.manyHasMany[childName]
				if(!__tables[childName.slice(0,-1)]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName.slice(0,-1)]
				this[childName.slice(0,-1)] = []
				rels.map(r => {
					var cuid = r[childName]
					this[childName.slice(0,-1)].push(cmodel.find({uuid: cuid}))
				})
			}
			for(var childName in relg.oneHasMany) {
				var rels = relg.oneHasMany[childName]
				console.log('debug loadchildren child table name')
				console.log(childName.slice(0,-1))
				console.log('debug loadchildren __tables')
				console.log(__tables)
				if(!__tables[childName.slice(0,-1)]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName.slice(0,-1)]
				this[childName.slice(0,-1)] = []
				rels.map(r => {
					var cuid = r[childName]
					this[childName.slice(0,-1)].push(cmodel.find({uuid: cuid}))
				})
			}
			for(var childName in relg.oneHasOne) {
				var rels = relg.oneHasOne[childName]
				if(!__tables[childName]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				console.log('debug loadchildren child name')
				console.log(childName)
				console.log('debug loadchildren relationgraph')
				console.log(rels)
				
				var cmodel = __tables[childName]
				var cuid = rels[childName]
				this[childName] = cmodel.find({uuid: cuid})
			}
			for(var childName in relg.hasOne) {

				var rels = relg.hasOne[childName]
				if(!__tables[childName]) {
					throw Error('Caanot load children: cannot lookup tablename')
				}
				var cmodel = __tables[childName]
				var cuid = rels

				if(typeof this[childName] == 'string') {
					this[childName] = cmodel.find({uuid: cuid})
				}
			}
	}
	set link(child) {
		_linkModels(this,child)
		this.save
		this.$loadChildren
		this.lastUpdated = Date.now()
	}
	set unlink(child) {

		_unlinkModels(this,child)
		this.save
		this.$loadChildren
		this.lastUpdated = Date.now()
	}
	get save() {
		this.lastUpdated = Date.now()
		this.constructor.save(this)
	}
	get remove() {

		this.constructor.remove(this)
	}
	static get $() {
		if(this.name == 'Model') {
			throw Error('You must extend Model to use dollar sign')
		}
		if(__dollarSignCalls.includes(this.name)) {
			return
		}
		__models[this.name] = this
		__tables[this.tableName] = this
		__dollarSignCalls.push(this.name)
		_init(this)	
	}
	static dispense(props) {

		if(this.name == 'Model') {
			throw Error('You must extend Model to use dispense. Use checkout instead')
		}
		return this.checkout(this.tableName , props)
	}
	static find(sel) {

		if(this.name == 'Model') {
			throw Error('You must extend Model to use find. Use findOne , findAll , or findEach instead')
		}
		return this.findOne(this.tableName , sel)
	}
	static create(obj) {

		if(this.name == 'Model') {
			throw Error('You must extend Model to use create. Use createOne or createAll instead')
		}
		if(obj.preInsert) obj.preInsert()
		this.createOne(this.tableName,obj.$preInsert)
		if(obj.postInsert) obj.postInsert()
	}
	static save(obj) {
		if(this.name == 'Model') {
			throw Error('You must extend Model to use save. Use updateOne or updateAll instead')
		}
		if(_poke(this.tableName , _extractFrom(_getSchemaUnique(this) , obj)) == undefined) return this.create(obj)
		if(obj.preUpdate) obj.preUpdate() 
		this.updateOne(this.tableName,obj.$preUpdate)
		if(obj.postUpdate) obj.postUpdate()
	}
	static remove(obj) {

		if(this.name == 'Model') {
			throw Error('You must extend Model to use remove. Use removeOne or removeAll instead')
		}
		if(obj.preRemove) obj.preRemove()
		this.removeOne(this.tableName,obj.$preRemove)
	}

	//////// modify relations to use for loops instead of maps
	/////// find out why children children arent being loaded on model load

	static checkout(model , props) {

		if(!__tables[model]) {
			throw Error('Cannot checkout '+model+': cannot lookup model name ')
		}
		var obj = new __tables[model](props)
		obj.uuid = uuid()
		if(obj.preCheckout) obj.preCheckout()
		return _injectEmptySchema(__tables[model] , obj.$preCheckout)
	}
	static findOne(model,props) {

		var o = new this(_connectionFactory().prepare('select * from '+model+_selectorFactory(props)).get())

		o.$loadChildren

		return o
	}
	static findAll(model,props) {

		return _connectionFactory().prepare('select * from '+model+_selectorFactory(props)).all().map(r => {
			var o = new this(r)
			o.$loadChildren
			return o
		})
	}
	static findEach(model,props,cb,chunksize = false) {
		var load = r => {
			var o = new this(r)
			o.$loadChildren
			return o
		}
		var stmt = _connectionFactory().prepare('select * from '+model+_selectorFactory(props))
		for(const row of stmt.iterate()) {
			if(chunksize) { 
				if(chunks.length <= chunksize) { 
					chunks.push(load(row)) 
				} else {
					cb(chunks) 
					chunks = [load(row)] 
				} 
			} else { 
				cb(load(row)) 
			} 
		}
		if(chunksize && chunks.length > 0) cb(chunks)
	}
	static removeOne(model , props) {

		return _connectionFactory().prepare('delete from '+model+_selectorFactory(props)).run().changes
	}
	static removeAll(model , props) {

		return props.map(o => this.removeOne(model,o) )
	}
	static updateOne(model , props) {

		return _connectionFactory().prepare(_parameterSqlFactory('u',model,props)+' where uuid = "'+props.uuid+'"').run(_stripKeysFactory(props)).changes
	}
	static updateAll(model , props) {

		return props.map(o => this.updateOne(model,o) )
	}
	static createOne(model , props) {
		return _connectionFactory().prepare(_parameterSqlFactory('c',model,props)).run(_stripKeysFactory(props)).lastInsertRowid
	}
	static createAll(model , props) {

		return props.map(o => this.createOne(model,o) )
	}
}

module.exports = Model