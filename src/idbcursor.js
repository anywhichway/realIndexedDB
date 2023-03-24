class IDBCursor {
    constructor(txn, storeName, range, direction) {
        this.txn = txn;
        this.storeName = storeName;
        this.range = range;
        this.direction = direction;
        this.cursor = new lmdb.Cursor(txn, storeName);
    }

    advance(count) {
        for (let i = 0; i < count; i++) {
            if (!this.cursor.goToNext()) {
                return;
            }
        }
    }

    continue(key) {
        if (key) {
            if (!this.cursor.goToKey(key)) {
                return;
            }
        } else {
            if (!this.cursor.goToNext()) {
                return;
            }
        }
    }

    continuePrimaryKey(key, primaryKey) {
        if (!this.cursor.goToRange(primaryKey)) {
            return;
        }
        if (this.cursor.getCurrentString() !== primaryKey) {
            return;
        }
    }

    delete() {
        this.cursor.del();
    }

    getKey() {
        return this.cursor.getCurrentBinary();
    }

    getPrimaryKey() {
        return this.cursor.getCurrentBinary();
    }

    getValue() {
        return this.cursor.getCurrentBinary();
    }

    update(value) {
        this.cursor.putCurrent(value);
    }
}

export {IDBCursor as default}