import IDBRequest from "./IDBRequest.js";
import IDBCursorWithValue from "./idbcursorwithvalue.js";

const MAX_RECORDS = Math.pow(2,32);

function makeStringOneCharHigher(str) {
    if (str.length === 1) { // if the string is only one character long, append the lowest character possible
        return str + '\u0000';
    }
    const lastCharCode = str.charCodeAt(str.length - 1); // get the Unicode value of the last character
    const newCharCode = (lastCharCode === 0x10FFFF) ? 0 : lastCharCode + 1; // check if the last character is the maximum Unicode value, if so, set the new character to the minimum value, otherwise add 1 to get the new character's code
    const newChar = String.fromCharCode(newCharCode); // convert the new character's code to a string
    if (newCharCode === 0) { // if the new character is the minimum Unicode value, append it to the end of the string
        return str + newChar;
    } else { // otherwise, replace the last character with the new character
        return str.slice(0, -1) + newChar;
    }
}

function increaseByteSortOrder(value) {
    const type = typeof(value)
    if (value === null) {
        return Symbol.for("\u0000")
    }
    if(type==="symbol") {
        const str = makeStringOneCharHigher((value.match(/Symbol\((.*)\)/)||[])[1]);
        return Symbol.for(str)
    }
    if(value===false) {
        return true;
    }
    if (value===true) {
        return Number.MIN_SAFE_INTEGER
    }
    if(type==="number") {
        value += Number.EPSILON;
    }
    if(value===Number.MAX_VALUE) {
        return "\u0000";
    }
    if(type==="string") {
        return makeStringOneCharHigher(value);
    }
    throw new TypeError(`Cannot increase sort order of type ${type}`)
}

class IDBObjectStore {
    constructor(env, name, options={}) {
        this.env = env;
        this.dbi = env.openDB({name,...options,cache:true});
        this.name = name;
        this.options = options;
    }

    add(value, key) { // todo, fix so throws when value already exists
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
        try {
            const request = new IDBRequest({result:this.dbi.remove(key),readyState:"pending"});
            request.result.then(async (result) => {
                await this.dbi.flushed;
                request._readyState = "done";
                request._result = result;
                request.dispatchEvent(new Event("success"))});
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    deleteIndex(name) {
        throw new Error("Not implemented");
    }

    get(key) {
        try {
            const request = new IDBRequest({result:this.dbi.get(key),readyState:"done"});
            setTimeout(()=> request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    getAll(query, count=MAX_RECORDS) {
        if(count<0 || count>MAX_RECORDS) throw new TypeError("Invalid count")
        try {
            const start = query.lower ? query.lower : (query.lower ? increaseByteSortOrder(query.lower) : undefined),
                end = query.upperOpen ?  query.upper : (query.upper ? increaseByteSortOrder(query.upper) : undefined),
                result =  [...this.dbi.getRange({start,end,limit:count})].map(({key,value}) => value);
            const request = new IDBRequest({result,readyState:"done"});
            setTimeout(()=> request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    getAllKeys(query, count=MAX_RECORDS) {
        if(count<0 || count>MAX_RECORDS) throw new TypeError("Invalid count")
        try {
            const start = query.lower ? query.lower : (query.lower ? increaseByteSortOrder(query.lower) : undefined),
                end = query.upperOpen ?  query.upper : (query.upper ? increaseByteSortOrder(query.upper) : undefined),
                result =  [...this.dbi.getKeys({start,end,limit:count})];
            const request = new IDBRequest({result,readyState:"done"});
            setTimeout(()=> request.dispatchEvent(new Event("success")));
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }

    index(name) {
        throw new Error("Not implemented");
    }

    openCursor(query, direction) {
        try {
            const start = query.lower ? query.lower : (query.lower ? increaseByteSortOrder(query.lower) : undefined),
                end = query.upperOpen ?  query.upper : (query.upper ? increaseByteSortOrder(query.upper) : undefined),
                reverse = direction==="prev" || direction==="prevunique",
                range = this.dbi.getRange({start,end,reverse}),
                cursor = new IDBCursorWithValue(null, this,new IDBRequest({readyState:"done"}),range, direction);
            setTimeout(()=> { cursor.request._result=cursor; cursor.request.dispatchEvent(new Event("success")) });
            return cursor.request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
     }

    openKeyCursor(range, direction) {
        return new IDBCursor(this.env, this.dbi, range, direction);
    }

    put(key,value) {
        try {
            const request = new IDBRequest({result:this.dbi.put(key, value),readyState:"pending"});
            request.result.then((result) => {
                request._readyState = "done";
                request._result = result;
                request.dispatchEvent(new Event("success"))});
            return request;
        } catch(e) {
            const request = new IDBRequest({error:e,readyState:"done"});
            setTimeout(() => request.dispatchEvent(new Event("error")));
            return request;
        }
    }
}
export default IDBObjectStore;