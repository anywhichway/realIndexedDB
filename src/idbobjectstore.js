import IDBRequest from "./IDBRequest.js";

class IDBObjectStore {
    constructor(env, name, options) {
        this.env = env;
        this.dbi = env.openDB({name,...options});
        this.name = name;
        this.options = options;
    }

    add(value, key) {
        try {
            const request = new IDBRequest({result:true,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    clear() {
        return this.dbi.clearSync();
    }

    count(key) {
        return [...this.dbi.getValues(key)].length; // todo, better way?
    }

    createIndex(name, keyPath, options) {
        return new IDBIndex(this.env, this.dbi, name, keyPath, options);
    }

    delete(key) {
        return this.dbi.remove(key);
    }

    deleteIndex(name) {
        throw new Error("Not implemented");
    }

    get(key) {
        try {
            const request = new IDBRequest({result:this.dbi.get(key),readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    getAll(query, count) {
        const txn = this.env.beginTxn();
        try {
            const cursor = new lmdb.Cursor(txn, this.dbi);
            const results = [];
            while (cursor.goToNext()) {
                results.push(cursor.getCurrentBinary());
            }
            return results;
        } finally {
            txn.abort();
        }
    }

    getAllKeys(query, count) {
        return this.dbi.getKeys()
    }

    index(name) {
        throw new Error("Not implemented");
    }

    openCursor(range, direction) {
        return new IDBCursor(this.env, this.dbi, range, direction);
    }

    openKeyCursor(range, direction) {
        return new IDBCursor(this.env, this.dbi, range, direction);
    }

    put(value, key) {
        try {
            this.dbi.put(key, value);
            const request = new IDBRequest({result:true,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }
}
export default IDBObjectStore;