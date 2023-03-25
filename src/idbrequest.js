class IDBRequest extends EventTarget {
    constructor({result,error, source, transaction,readyState="pending"}={}) {
        super();
        this._result = result;
        this._error = error;
        this._source = source;
        this._transaction = transaction;
        this._readyState = readyState;
    }

    get error() {
        return this._error;
    }

    get result() {
        return this._result;
    }

    get source() {
        return this._source;
    }

    get readyState() {
        return this._readyState;
    }

    get transaction() {
        return this._transaction;
    }

    withEventListener(type,listener,options) {
        super.addEventListener(type, listener, options);
        return this;
    }
}

export {IDBRequest as default}