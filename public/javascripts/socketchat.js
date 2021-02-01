const socket = io.connect("/");

socket.on("chat", (data)=>{
    console.log(data)
    processResponse(data);
})


socket.on("access", (data)=>{
    console.log(data)
})


