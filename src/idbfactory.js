import {open} from "lmdb";
import IDBDatabase from "./IDBDatabase.js";
import IDBOpenDBRequest from "./IDBOpenDBRequest.js";

class IDBFactory {
    constructor() {
        this.dbs = {};
    }

    open(path, version) {
        if (!this.dbs[path]) {
            const env = open({
                path,
                mapSize: 10485760,
                maxDbs: 10,
            });
            this.dbs[path] = {
                env,
                version: version || 1
            };
        } else {
            const { env, version } = this.dbs[path];
            if (version !== version) {
                throw new Error("Version mismatch");
            }
        }
        let request;
        try {
            const db = new IDBDatabase(this.dbs[path].env);
            const request = new IDBOpenDBRequest({result:db,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBOpenDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    deleteDatabase(name) {
        if (this.dbs[name]) {
            this.dbs[name].dbi.drop();
            this.dbs[name].env.close();
            delete this.dbs[name];
        }
    }

    cmp(a, b) {
        return a.compare(b);
    }

    databases() {
        return [];
    }
}

export {IDBFactory as default}
