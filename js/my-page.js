$(document).ready(() => {

  SDK.User.loadNav();

  const $myEventList = $("#create-event-tbody");
  const $myAttendingList = $("#attend-event-tbody");

  SDK.User.current((error, res) => {

    var currentStudent =JSON.parse(res);

    currentID = $("#Welcome").html(`
          <h1>Hi, ${currentStudent.firstName}</h1>
          <h1>Your lastname: ${currentStudent.lastName}</h1>
          <h1>Your email: ${currentStudent.email}</h1>
          `);

      SDK.Event.findAll((cb, events) => {
          events = JSON.parse(events);
          events.forEach((event) => {
            if (currentStudent.idStudent === event.owner) {
                let eventHtml =`
                <tr>
                    <td>${event.eventName}</td>
                    <td>${event.eventDate}</td>
                    <td>${event.location}</td>
                    <td>${event.description}</td>
                    <td>${event.owner}</td>
                    <td><button class="btn-info updateMyEvent-button" data-toogle="modal" data-target="#updateMyEventModal" data-update-my-event-id="${event.idEvent}">Update your Event</button></td>
                    <td><button class="btn-danger deleteMyEvent-button" data-delete-my-event-id=${event.idEvent}>Delete your event</button></td>
                </tr>`;
                $myEventList.append(eventHtml);
            }
            
          });
          $(".deleteMyEvent-button").click(function() {

              const idEvent = $(this).data("delete-my-event-id");
              const event = events.find((event) => event.idEvent === idEvent);

              console.log(event);

              SDK.Event.deleteMyEvent(idEvent, event.eventName, event.eventDate, event.location, event.description, event.price, (err, data) => {
                  if (err && err.xhr.status === 401) {
                      $(".form-group").addClass("has-error")
                  }
                  else if (err){
                      console.log("An error happened")
                      window.alert("An error occurred while deleting the event - please try again");
                  } else {
                      window.location.href = "my-page.html";

                  }
              })

          });

          $(".updateMyEvent-button").click(function () {

              const idEvent = $(this).data("update-my-event-id");

            $("#updateMyEventModal").modal("toggle");

              $("#submitMyUpdatedEventButton").click(() => {
                  const eventName = $("#inputEventNameUpdate").val();
                  const eventDate = $("#inputEventDateUpdate").val();
                  const location = $("#inputLocationUpdate").val();
                  const description = $("#inputDescriptionUpdate").val();
                  const price = $("#inputPriceUpdate").val();

                  console.log(eventName);

                  SDK.Event.updateMyEvent(idEvent, eventName, eventDate, location, description, price, (err, data) => {

                          window.location.href = "my-page.html";

                  });

              });
          });

      });

      SDK.User.findAttendingEvents ((cb, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
          let eventHtml =`
          <tr>
                <td>${event.eventName}</td>
                <td>${event.eventDate}</td>
                <td>${event.location}</td>
                <td>${event.description}</td>
                <td>${event.owner}</td>
          </tr>`;
          $myAttendingList.append(eventHtml);
        })
      });


          
    });


});