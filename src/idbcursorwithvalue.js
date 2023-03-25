import IDBCursor from './idbcursor.js';

class IDBCursorWithValue extends IDBCursor {
    constructor(...args) {
        super(...args);
    }
    get value() {
        return this.currentEntry ? this.currentEntry.value : undefined;
    }
}

export {IDBCursorWithValue as default}