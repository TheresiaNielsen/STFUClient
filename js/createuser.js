$(document).ready(() => {

    SDK.User.loadNav();

    $("#create-button").click(() => {

        const firstname = $("#inputFirstname").val();
        const lastname = $("#inputLastname").val();
        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();
        const verify = $("#inputVerify").val();

        SDK.User.create(firstname, lastname, email, password, verify, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("Bad stuff happened")
            } else {
                window.location.href = "index.html";
            }
        });

    });


});