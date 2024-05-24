async function postData() {
    const url = "http://localhost:4000"
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      
    });
    const result = response.json(); 
    console.log(result)
}

