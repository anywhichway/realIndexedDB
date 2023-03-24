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

let request = indexedDB.open("test", 1);
request.addEventListener("success", () => {
    let db = request.result;
    request = db.createObjectStore("test");
    request.addEventListener("success", () => {
        const os = request.result;
        request = os.put("hello", "world");
        request.addEventListener("success", () => {
            request = os.get("world");
            request.addEventListener("success", () => {
                console.log(request.result);
            });
        })
        request.addEventListener("error", () => {
            console.log(request.error);
        })
    })
    request.addEventListener("error", () => {
        console.log(request.error);
    })
})
```

# Change History (Reverse Chronological Order)

2021-03-24 v0.0.1 Initial public release
