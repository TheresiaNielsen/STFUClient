const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        /* let headers = {};
         if (options.headers) {
           Object.keys(options.headers).forEach((h) => {
             headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
           });
         }
         Slet???
         */

        let token = {
            "authorization": localStorage.getItem("token")
        }


        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    Event: {

        /*addToAttendingEvents: (event) => {

            SDK.request({
                method: "POST",
                url: "/events/join"
            });

          let egneEvents = SDK.Storage.load("egneEvents");

          //Has anything been added to egne events before?
          if (!egneEvents) {
            return SDK.Storage.persist("egneEvents", [{
              count: 1,
              event: event
            }]);
          }

          //Does the event already exist?
          let foundEvent = egneEvents.find(e => e.event.id === event.id);
          if (foundEvent) {
            let i = egneEvents.indexOf(foundEvent);
            egneEvents[i].count++;
          } else {
            egneEvents.push({
              count: 1,
              event: event
            });
          }

          SDK.Storage.persist("egneEvents", event);
        },*/

        findAll: (cb, event) => {
            SDK.request({
                method: "GET",
                url: "/events",
                headers: {
                    filter: {
                        include: ["events"]
                    }
                }
            }, cb);
        },

        createEvent: (eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    eventName: eventName,
                    location: location,
                    price: price,
                    eventDate: eventDate,
                    description: description,
                },
                url: "/events",
                method: "POST"
            }, (err, data) => {

                if (err) return cb(err);

                SDK.Storage.persist("crypted", data);

                cb(null, data);

                //headers: {authorization: SDK.Storage.load("tokenId")}
                //cb);

            });

        },

        attendEvent: (idEvent, eventName, eventDate, location, description, price, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    eventDate: eventDate,
                    location: location,
                    description: description,
                    price: price,
                },
                method: "POST",
                url: "/events/join"

            }, (err, data) => {

                cb(null, data);

            });
        },

        deleteMyEvent: (idEvent, eventName, eventDate, location, description, price, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    eventDate: eventDate,
                    location: location,
                    description: description,
                    price: price,
                },
                method: "PUT",
                url: "/events/" + idEvent + "/delete-event",

            }, cb);
        },

        updateMyEvent: (idEvent, eventName, eventDate, location, description, price, cb) => {
            SDK.request ({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    eventDate: eventDate,
                    location: location,
                    description: description,
                    price: price,
                },
                method: "PUT",
                url: "/events/" + idEvent + "/update-event"
            }, cb);
        },

        findAttendingStudents: (idEvent, cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students"
            }, cb);
        }
    },



    /*Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/orders",
                data: data,
                headers: {authorization: SDK.Storage.load("tokenId")}
            }, cb);
        },
        findMine: (cb) => {
            SDK.request({
                method: "GET",
                //url: "/orders/" + SDK.User.current().id + "/allorders",
                headers: {
                    authorization: SDK.Storage.load("tokenId")
                }
            }, cb);
        }
    },*/
    User: {
        findAll: (cb) => {
            SDK.request({method: "GET", url: "/staffs"}, cb);
        },
        current: (cb) => {
            SDK.request({
                    url: "/students/profile",
                    method: "GET"
                }, (err, data) => {

                    if (err) return cb(err);

                    localStorage.setItem("idStudent", JSON.parse(data).idStudent);


                    cb(null, data);

                }
            )
        },
        logOut: () => {
            //SDK.Storage.remove("tokenId"); slet?
            //SDK.Storage.remove("userId"); slet?
            //SDK.Storage.remove("user"); slet?
            localStorage.removeItem("token"); // token slettes når man logger ud
            window.location.href = "index.html";
        },
        login: (email, password, cb) => {
            SDK.request({
                data: {
                    email: email,
                    password: password
                },
                url: "/login",
                method: "POST"
            }, (err, data) => {

                //On login-error
                if (err) return cb(err);


                localStorage.setItem("token", data);
                //SDK.Storage.persist("crypted", data);
                //SDK.Storage.persist("userId", data.userId);
                //SDK.Storage.persist("user", data.user);

                cb(null, data);

            });
        },
        createUser: (firstname, lastname, email, password, verify, cb) => {
            SDK.request({
                data: {
                    firstName: firstname,
                    lastName: lastname,
                    email: email,
                    password: password,
                    verifyPassword: verify
                },
                url: "/register",
                method: "POST"
            }, (err, data) => {

                //On create-error
                if (err) return cb(err);

                //SDK.Storage.persist("crypted", data);

                cb(null, data);

            });
        },

        findAttendingEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/students/" + localStorage.getItem("idStudent") + "/events",
                headers: {
                    filter: {
                        include: ["events"]
                    }
                }
            }, cb);

        },

        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                let currentUser = null;
                SDK.User.current((error, data) => {
                    currentUser = data;

                    if (currentUser) {
                        $(".navbar-right").html(`
            <li><a href="#" id="logout-link">Log-out</a></li>
          `);
                    } else {
                        $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                    }
                    $("#logout-link").click(() => SDK.User.logOut());

                })

                cb && cb();
            });
        }
    },
    Storage: {
        prefix: "BookStoreSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};