window.onload = function() {
    // var getsession = window.localStorage.getItem('sessionResponse');
    
    document.getElementById("sessionData").innerHTML = window.localStorage.getItem('sessionResponse'); 
    document.getElementById("displaySrNumber").innerHTML = window.localStorage.getItem('SrNumber'); 
    
    // document.write(localStorage.getItem("sessionData"))
    // console.log("get session");
}
