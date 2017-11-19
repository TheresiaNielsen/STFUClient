$(document).ready(() => {

    SDK.User.loadNav();

    $("#create-button").click(() => {

        const firstname = $("#inputFirstnameCreate").val();
        const lastname = $("#inputLastnameCreate").val();
        const email = $("#inputEmailCreate").val();
        const password = $("#inputPasswordCreate").val();
        const verify = $("#inputVerifyCreate").val();

        SDK.User.createUser(firstname, lastname, email, password, verify, (err, data) => {
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