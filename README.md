# realIndexedDB
IndexedDB for Node.js backed by LMDB (vs fakeIndexedDB which it in RAM only and just for testing)

This is ALPHA software. API not yet complete. Unit tests not yet in place.

# Installation

`npm install real-indexeddb`

# Usage

```javascript
import {indexedDB} from "real-indexeddb";

/* standard IndexedDB API Usage */
```

# Implementation Details

IDBObjectStores are LMDB databases inside a master database with a `null` name at the `path` specified with the `indexedB.open(name)` call, where `name` is the path. Indexes are LMDB array keys.

# Status

A database can be created and opened. A value can be put and retrieved. See the file `node_modules/real-indexeddb/examples/kitchen-sink.js` for a working example.

```javascript
import {indexedDB}  from "../index.js";

indexedDB.open("test", 1)
    .withEventListener("success", (event) => {
        const db = event.target.result;
        db.createObjectStore("test")
            .withEventListener("success", (event) => {
                const os = event.target.result;
                os.put("hello", "world")
                    .withEventListener("success", (event) => {
                        os.get("hello")
                            .withEventListener("success", (event) => {
                                console.log(event.target.result);
                                os.delete("hello")
                                    .withEventListener("success", (event) => {
                                        console.log(event.target.result);
                                        os.get("hello")
                                            .withEventListener("success", (event) => {
                                                console.log(event.target.result);
                                            })
                                            .withEventListener(
                                                "error", (event) => {
                                                    console.log(event.target.error);
                                                });
                                    })
                            })
                            .withEventListener(
                                "error", (event) => {
                                    console.log(event.target.error);
                                });
                    })
                    .withEventListener(
                        "error", (event) => {
                            console.log(event.target.error);
                        });
                os.dbi.putSync(true,true);
                os.dbi.putSync(1,1);
                os.dbi.putSync("a","a");
                os.getAllKeys(IDBKeyRange.bound(true,"a",true,true))
                    .withEventListener("success", (event) => {
                        console.log(event.target.result);
                    })
                    .withEventListener("error", (event) => {
                        console.log(event.target.error);
                    })
                os.getAllKeys(IDBKeyRange.bound(true,"a",false,false))
                    .withEventListener("success", (event) => {
                        console.log(event.target.result);
                    })
                    .withEventListener("error", (event) => {
                        console.log(event.target.error);
                    })
                os.getAllKeys(IDBKeyRange.only("a"))
                    .withEventListener("success", (event) => {
                        console.log(event.target.result);
                    })
                    .withEventListener("error", (event) => {
                        console.log(event.target.error);
                    })
                os.getAll(IDBKeyRange.bound(true,"a",false,false))
                    .withEventListener("success", (event) => {
                        console.log(event.target.result);
                    })
                    .withEventListener("error", (event) => {
                        console.log(event.target.error);
                    })
                os.openCursor(IDBKeyRange.bound(true,"a",false,false))
                    .withEventListener("success", (event) => {
                        console.log(event.target.result);
                        const cursor = event.target.result;
                        console.log(cursor.value);
                        cursor.continue();
                        console.log(cursor.value);
                        cursor.continue();
                        console.log(cursor.value);
                    })
                    .withEventListener("error", (event) => {
                        console.log(event.target.error);
                    })
            })
            .withEventListener("error", (event) => {
                console.log(event.target.error);
            })
    }).withEventListener("error", (event) => {
    console.log(event.target.error);
})
```

# Change History (Reverse Chronological Order)

2012-03-25 v0.0.2 Added support for `IDBObjectStore.getAll()`, `IDBObjectStore.getAllKeys()`, and `IDBObjectStore.openCursor()`. Added non-standard `withEventListener` to `IDBRequest` to allow for `addEventListener` to be chained.

2021-03-24 v0.0.1 Initial public release
