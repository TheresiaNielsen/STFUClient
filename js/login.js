$(document).ready(() => {


    // The method, "login" runs when pressing the button

    $("#login-button").click(() => {

        // gets the inputs
        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

        // pass the inputs
        SDK.User.login(email, password, (err, data) => {
            console.log(data);


            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            } else {
                window.location.href = "index.html";

            }
        });


    });

    // Forwarded to "create user" when pressing the button
    $("#GOTOcreate-button").click(() => {
        window.location.href = "createuser.html";

    });

});