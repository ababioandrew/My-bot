function pushDataToServer(formData = {}) {
    // var mainApi = "http://10.233.208.55:8080/MVA/User";
    var mainApi = "/report";
    formData = JSON.stringify(formData);

    // console.log(formData)

    var request = $.ajax({
        url: mainApi,
        type: "POST",
        data: formData,
        contentType: "application/json"
    });

    return request;
}


// function checkStatusFromServer(formData = {}) {
//     // var mainApi = "http://10.233.208.55:8080/MVA/User";
//     var mainApi = "/status";
//     formData = JSON.stringify(formData);

//     // console.log(formData)

//     var request = $.ajax({
//         url: mainApi,
//         type: "POST",
//         data: formData,
//         contentType: "application/json"
//     });

//     return request;
// }


