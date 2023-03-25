import IDBObjectStore from "./idbobjectstore.js";

class IDBCursor {
    #currentEntry;
    #direction;
    #lmdbDB;
    #range;
    #request;
    #source;
    #store;
    constructor(txn, source, request,range, direction) {
        this.txn = txn;
        this.#request = request;
        this.#source = source;
        this.#range = range;
        this.#direction = direction;
        this.#store = source instanceof IDBObjectStore ? source : source.objectStore;
        this.advance(1);
    }

    get currentEntry() {
        return this.#currentEntry
    }

    get direction() {
        return this.#direction;
    }

    get range() {
        return this.#range;
    }

    get request() {
        return this.#request;
    }

    get source() {
        return this.#source;
    }

    advance(count) {
        if(count>0) {
            let next;
            do {
                this.#currentEntry = undefined;
                next = this.#range.next();
                if(--count===0) {
                    this.#currentEntry = next.value
                    return;
                }
            } while(!next.done);
        }
    }

    continue(key) {
        let next;
        if (key) {
            do {
                this.#currentEntry = undefined;
                next = this.#range.next();
                if(next.value && next.value.key === key) {
                    this.#currentEntry = next.value;
                    return;
                }
            } while(!next.done)
        } else {
            next = this.#range.next()
            this.#currentEntry = next.value;
        }
    }

    continuePrimaryKey(key, primaryKey) {
        throw new Error("Not implemented");
    }

    delete() {
        return this.#store.delete(this.#currentEntry.key).withEventListener("success", () => this.#currentEntry = null);
    }

    update(value) {
        return this.#store.put(this.#currentEntry.key,value).withEventListener("success", () => this.#currentEntry = null);
    }
}

export {IDBCursor as default}