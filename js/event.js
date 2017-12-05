$(document).ready(() => {

  SDK.User.loadNav();

    const $eventList = $("#event-list");
    const $AllAttendingStudents = $("#all-attending-students");

  SDK.Event.findAll ( (cb, events) => {
    events = JSON.parse(events);
    events.forEach((event) => {
        const eventHtml = `
        <div class="col-lg-4 event-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${event.eventName}</h3>
                </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Date</dt>
                        <dd>${event.eventDate}</dd>
                        <dt>Location</dt>
                        <dd>${event.location}</dd>
                        <dt>Description</dt>
                        <dd>${event.description}</dd>
                        <dt>Owner</dt>
                        <dd>${event.owner}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${event.price}</span></p>
                        </div>
                      <button class="col-lg-8 tex-right">
                      <button class="btn btn-outline-success attendEvent-button" data-event-id="${event.idEvent}">Attend event</button>
                      <button class="btn findAttendingStudents-button"  data-attend-event-id="${event.idEvent}">See all attending students</button>       
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        $eventList.append(eventHtml);

    });

    $(".attendEvent-button").click(function() {

        const idEvent = $(this).data("event-id");
        const event = events.find((event) => event.idEvent === idEvent);

        console.log(event);

        SDK.Event.attendEvent(idEvent, event.eventName, event.eventDate, event.location, event.description, event.price, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error")
            }
            else if (err){
                console.log("An error happened")
                window.alert("An error occurred while signing up for the event - try again");
            } else {
                window.location.href = "my-page.html";

            }
        })

    });

    $(".findAttendingStudents-button").click(function() {


        var idEvent = $(this).data("attend-event-id");

        $("#AllAttendingStudents-button").modal("toggle");

        //console.log(idEvent);

        SDK.Event.findAttendingStudents(idEvent, (cb, students) => {
            console.log(students);
            if (students) {
                students = JSON.parse(students);
                students.forEach((student) => {

                    const attendingHtml = `
                <tr>
                    <td> ${student.firstName} </td>
                    <td> ${student.lastName} </td>
                    <td> ${student.email} </td>
                    </tr> `;

                    $AllAttendingStudents.append(attendingHtml)
                });
            } else {
                window.alert("There is no students attending!")
            }

        });

    });

  });

    $("#close").click(function () {


$("#AllAttendingStudents-button").modal("toggle");
    });


    $("#AllAttendingStudents-button").on("hidden.bs.modal", function() {

        $("#all-attending-students").html("");
    });

    /*$("#attend-modal").on("shown.es.modal", () => {
      const egneEvents = SDK.Storage.load("egneEvents");
      const $modalTbody = $("#modal-tbody");
      egneEvents.forEach((entry) => {
          $modalTbody.append(`
        <tr>
            <td>${entry.event.eventName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.event.price}</td>
            <td>kr. 0</td>
        </tr>
      `);
      });
    });
*/

});