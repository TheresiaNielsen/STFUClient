$(document).ready(() => {

    SDK.User.loadNav();

    $("#create-event-button").click(() => {

        const eventname = $("#inputEventnameCreate").val();
        const owner = $("#inputOwnerCreate").val();
        const location = $("#inputLocationCreate").val();
        const price = $("#inputPriceCreate").val();
        const eventdate = $("#inputEventdateCreate").val();
        const description = $("#inputDescriptionCreate").val();

        SDK.Event.createEvent(eventname, owner, location, price, eventdate, description, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("Bad stuff happened")
            } else {
                window.location.href = "event.html";
            }
        });

    });


});