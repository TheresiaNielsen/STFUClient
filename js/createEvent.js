$(document).ready(() => {

    SDK.User.loadNav();

    //The method, "create event" runs when pressing the button

    $("#create-event-button").click(() => {

        const eventName = $("#inputEventNameCreate").val();
        const location = $("#inputLocationCreate").val();
        const price = $("#inputPriceCreate").val();
        const eventDate = $("#inputEventDateCreate").val();
        const description = $("#inputDescriptionCreate").val();

        SDK.Event.createEvent(eventName, location, price, eventDate, description, (err, data) => {
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