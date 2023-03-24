class IDBCursorWithValue extends IDBCursor {
    getValue() {
        return this.cursor.getCurrentBinary();
    }
}

export {IDBCursorWithValue as default}