var EventDispatcher = function() {
	this._events = {};
}
EventDispatcher.prototype.dispatchEvent = function(type) {
	if (this._events[type] && Array.isArray(this._events[type])) {
		var handlers = this._events[type].slice();
		var args = [];
		for (var i = 1, l = arguments.length; i < l; i++)
			args.push(arguments[i]);
		for (var i = 0, l = handlers.length; i < l; i++) {
			args.unshift(handlers[i]);
			handlers[i].apply(this, args);
			args.shift();
		}
		return true;
	}
	return false;
}
EventDispatcher.prototype.addEventListener = function(type, listener) {
	if (typeof listener !== 'function')
		throw new Error('addListener only takes instances of Function');
	if (!this._events[type]) this._events[type] = [];
	
	if (this._events[type].indexOf(listener) === -1)
		this._events[type].push(listener);
	
	return this;
}
EventDispatcher.prototype.removeEventListener = function(type, listener) {
	if (typeof listener !== 'function')
		throw new Error('addListener only takes instances of Function');
	if (!this._events[type])
		return this;
	
	var list = this._events[type];
	for (var i = 0, length = list.length; i < length; i++) {
		if (list[i] === listener) {
			list.splice(i, 1);
			if (list.length === 0)
				delete this._events[type];
			break;
		}
	}
	
	return this;
}
EventDispatcher.prototype.once = function(type, listener) {
	if (typeof listener !== 'function') {
		throw new Error('addListener only takes instances of Function');
	}
	this.addEventListener(type, function(callee) {
		var args = [];
		for (var i = 0, l = arguments.length; i < l; i++)
			args.push(arguments[i]);
		args.shift();
		args.unshift(listener);
		this.removeEventListener(type, callee);
		listener.apply(this, args);
	}.bind(this));
	return this;
}
EventDispatcher.prototype.removeAllEventListeners = function(type) {
	if (arguments.length === 0) {
		this._events = {};
		return this;
	}
	if (type && this._events && this._events[type])
		this._events[type] = [];
	return this;
}