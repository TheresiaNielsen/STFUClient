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
          `)

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
                    <td><button class="btn-primary updateMyEvent-button" data-toogle="modal" data-target="#updateMyEventModal" data-update-my-event-id="${event.idEvent}">Update your Event</button></td>
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
                      window.location.href = "index.html";

                  }
              })

          });

          $(".updateMyEvent-button").click(function () {

              const idEvent = $(this).data("update-my-event-id");

              console.log(idEvent);

              $("#submitMyUpdatedEventButton").click(() => {
                  const eventName = $("#inputEventNameUpdate").val();
                  const eventDate = $("#inputEventDateUpdate").val();
                  const location = $("#inputLocationUpdate").val();
                  const description = $("#inputDescriptionUpdate").val();
                  const price = $("#inputPriceUpdate").val();
                  //const idEvent = SDK.URL.getParameterByName("eventId")

                  console.log(eventName);

                  SDK.Event.updateMyEvent(idEvent, eventName, eventDate, location, description, price, (err, data) => {
                      if (err & err.xhr.status === 401) {
                          $(".form-group").addClass("has-error")
                      }
                      else if (err){
                          console.log("An error happened")
                          window.alert("An error occurred while update the event - please try again");
                      } else {
                          window.location.href = "my-page.html";
                      }
                  })
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


  /*  let currentUser = data;
    console.log(data);
  });

  $(".page-header").html(`
    <h1>Hi, ${currentUser.firstName} ${currentUser.lastName}</h1>
  `);

  $(".img-container").html(`
    <img src="${currentUser.avatarUrl}" height="150"/>
  `);

  $(".profile-info").html(`
    <dl>
        <dt>Name</dt>
        <dd>${currentUser.firstName} ${currentUser.lastName}</dd>
        <dt>Email</dt>
        <dd>${currentUser.email}</dd>
        <dt>ID</dt>
        <dd>${currentUser.id}</dd>
     </dl>
  `);

  SDK.Order.findMine((err, orders) => {
    if(err) throw err;
    orders.forEach(order => {
      $basketTbody.append(`
        <tr>
            <td>${order.id}</td>
            <td>${parseOrderItems(order.orderItems)}</td>
            <td>kr. ${sumTotal(order.orderItems)}</td>
        </tr>
      `);
    });
  });

  function parseOrderItems(items){
    return items.map(item => {
      return item.count + " x " + item.bookInfo.title
    }).join(", ");
  }

  function sumTotal(items){
    let total = 0;
    items.forEach(item => {
      total += item.count * item.bookInfo.price
    });
    return total;
  }

*/
});