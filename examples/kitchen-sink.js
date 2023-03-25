import {indexedDB}  from "../index.js";
import IDBKeyRange from "../src/idbkeyrange.js";

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