import IDBRequest from "./IDBRequest.js";
import IDBObjectStore from "./IDBObjectStore.js";

class IDBDatabase {
    constructor(env) {
        this.env = env;
    }

    close() {
        this.env.close();
    }

    createObjectStore(name, options) {
        try {
            const result = new IDBRequest({result:new IDBObjectStore(this.env,name, options),readyState:"done"});
            setTimeout(() => result.dispatchEvent(new Event("success")));
            return result;
        }  catch(e) {
            const result = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => result.dispatchEvent(new Event("error")));
            return result;
        }
    }

    deleteObjectStore(name) {
        this.dbi.drop();
    }

    transaction(storeNames, mode) {
        const txn = this.env.beginTxn();
        return new IDBTransaction(txn, storeNames, mode);
    }
}

export {IDBDatabase as default}