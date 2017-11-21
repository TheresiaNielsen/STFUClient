$(document).ready(() => {

  SDK.User.loadNav();

    const $eventList = $("#event-list");

  SDK.Event.findAll ( (cb, events) => {
    events = JSON.parse(events);
    events.forEach((event) => {
        const eventHtml = `
        <div class="col-lg-4 event-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${event.eventname}</h3>
                </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Date</dt>
                        <dd>${event.eventdate}</dd>
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
                      <button class="btn btn-succes attend-button" data-event-id="${event.id}">Attend event</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        $eventList.append(eventHtml);

    });

      $(".attend-button").click(function() {
          const eventId = $(this).data("event-id");
          const event = events.find((event) => event.id === eventId);
          window.alert(eventId);
          SDK.Event.addToAttendingEvents(event);
      });

  });

    $("#attend-modal").on("shown.es.modal", () => {
      const egneEvents = SDK.Storage.load("egneEvents");
      const $modalTbody = $("#modal-tbody");
      egneEvents.forEach((entry) => {
          $modalTbody.append(`
        <tr>
            <td>${entry.event.eventname}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.event.price}</td>
            <td>kr. 0</td>
        </tr>
      `);
      });
    });

});