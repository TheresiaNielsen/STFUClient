$(document).ready(() => {

    // The method, "create user" runs when pressing the button

    $("#create-button").click(() => {

        // gets the inputs
        const firstname = $("#inputFirstnameCreate").val();
        const lastname = $("#inputLastnameCreate").val();
        const email = $("#inputEmailCreate").val();
        const password = $("#inputPasswordCreate").val();
        const verify = $("#inputVerifyCreate").val();

        console.log('test');

        // pass the inputs
        SDK.User.createUser(firstname, lastname, email, password, verify, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("Bad stuff happened")
            } else {
                console.log('test', data);
                window.location.href = "login.html";
            }
        });

    });

    // Forwarded to "login" when pressing the button
    $("#ReturnToLogin-button").click (() => {
        window.location.href = "login.html";
    });


});