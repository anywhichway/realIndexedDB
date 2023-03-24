class IDBVersionChangeEvent extends Event {
    constructor() {
        super();
    }

    get oldVersion() {
        return this._oldVersion;
    }

    get newVersion() {

    }
}

export {IDBVersionChangeEvent as default}