$(document).ready(() => {


    $("#login-button").click(() => {

        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

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

    $("#GOTOcreate-button").click(() => {
        window.location.href = "createuser.html";

    });

});