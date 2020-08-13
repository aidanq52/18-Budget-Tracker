const request = window.indexedDB.open("budget", 1);

let db;

request.onupgradeneeded = event =>{
    const db = event.target.result;

    const transactions = db.createObjectStore("transactions", {autoIncrement: true});
}

request.onsuccess = ()=>{
    db = request.result;


}

function saveRecord(record){
    console.log(record)
    const transaction = db.transaction(["transactions"], "readwrite");
    const transactionStore = transaction.objectStore("transactions");

    transactionStore.add(record)
}

window.addEventListener('online', function(e){
    console.log('online');
    // Access data in IndexedDB
    const transaction = db.transaction(["transactions"], "readwrite");
    const transactionStore = transaction.objectStore("transactions");

    const getRequest = transactionStore.getAll();

    getRequest.onsuccess = ()=>{
        console.log(getRequest.result)
    
        transactionStore.clear();
        // Submit to MongoDB
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getRequest.result),
            headers:{
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        })
        .then(response =>{
            console.log(response);
            //clear data from IndexedDB
        })
    }

});