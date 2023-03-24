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
request.addEventListener("error", () => {
    console.log(request.error);
})