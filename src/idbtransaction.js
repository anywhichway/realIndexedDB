class IDBTransaction extends EventTarget {
    constructor(env, mode, storeNames) {
        super();
        this.env = env;
        this.mode = mode;
        this.storeNames = storeNames;
        this._error = undefined;
        this._db = undefined;
        this._objectStoreNames = undefined;
        this._readyState = "pending";
        this._source = undefined;
        this._store = undefined;
        this._transaction = undefined;
    }

    get db() {
        return this._db;
    }

    get error() {
        return this._error;
    }

    get durability() {
        return this._durability;
    }

    get mode() {
        return this._mode;
    }

    get objectStoreNames() {
        return this._objectStoreNames;
    }

    abort() {
        throw new Error("Not implemented");
    }

    objectStore(name) {
        return new IDBObjectStore(this.env, this.store, name, {});
    }

    commit() {
        throw new Error("Not implemented");
    }
}

export {IDBTransaction as default}