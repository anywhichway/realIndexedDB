class IDBIndex extends EventTarget {
    constructor(txn, storeName, name, keyPath, options) {
        super()
        const { unique, multiEntry } = options;
        this.txn = txn;
        this.storeName = storeName;
        this._name = name;
        this._keyPath = keyPath;
        this._options = options;
    }

    get objectStore() {
        return this._storeName
    }

    get keyPath() {
        return this._keyPath;
    }

    get multiEntry() {
        return this._options.multiEntry;
    }

    get unique() {
        return this._options.unique;
    }

    count(key) {
        return this.txn.count(this.storeName, key);
    }

    get(key) {
        return this.txn.getBinary(this.storeName, key);
    }

    getKey(key) {
        return this.txn.getBinary(this.storeName, key);
    }

    getAll(query, count) {
        const cursor = new lmdb.Cursor(this.txn, this.storeName);
        const results = [];
        while (cursor.goToNext()) {
            results.push(cursor.getCurrentBinary());
        }
        return results;
    }

    getAllKeys(query, count) {
        const cursor = new lmdb.Cursor(this.txn, this.storeName);
        const results = [];
        while (cursor.goToNext()) {
            results.push(cursor.getCurrentBinary());
        }
        return results;
    }

    openCursor(range, direction) {
        return new IDBCursor(this.txn, this.storeName, range, direction);
    }

    openKeyCursor(range, direction) {
        return new IDBCursor(this.txn, this.storeName, range, direction);
    }
}

export { IDBIndex as default }