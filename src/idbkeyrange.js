class IDBKeyRange {
    #lower;
    #upper;
    #lowerOpen;
    #upperOpen;
    constructor(lower, upper, lowerOpen, upperOpen) {
        this.#lower = lower;
        this.#upper = upper;
        this.#lowerOpen = lowerOpen;
        this.#upperOpen = upperOpen;
    }

    static bound(lower, upper, lowerOpen, upperOpen) {
        return new IDBKeyRange(lower, upper, lowerOpen, upperOpen);
    }

    static lowerBound(lower, open) {
        return new IDBKeyRange(lower, undefined, open, undefined);
    }

    static only(value) {
        return new IDBKeyRange(value, value, false, false);
    }

    static upperBound(upper, open) {
        return new IDBKeyRange(undefined, upper, undefined, open);
    }

    includes(key) {
        if (this.#lower !== undefined) {
            if (this.lowerOpen) {
                if (key <= this.#lower) {
                    return false;
                }
            } else {
                if (key < this.#lower) {
                    return false;
                }
            }
        }

        if (this.#upper !== undefined) {
            if (this.#upperOpen) {
                if (key >= this.#upper) {
                    return false;
                }
            } else {
                if (key > this.#upper) {
                    return false;
                }
            }
        }

        return true;
    }

    get lower() {
        return this.#lower;
    }

    get upper() {
        return this.#upper;
    }

    get lowerOpen() {
        return this.#lowerOpen;
    }

    get upperOpen() {
        return this.#upperOpen;
    }
}

export {IDBKeyRange as default}