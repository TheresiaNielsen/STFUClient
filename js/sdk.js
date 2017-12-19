const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {



        let token = {
            "authorization": localStorage.getItem("token")
        };


        // AJAX (Asynchronous JavaScript and XML)
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
            success: (data, status, xhr) => {
                cb(null, SDK.Encryption.decrypt(data), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    Event: {


        // Finding all the events
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

        // The current user can create a new event. Passes data to the server
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


            });

        },

        // The current user can attend an event. Passes data to the server
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

        // The current user can delete own event. Passes data to the server
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

        // The current user can update own event. Passes data to the server
        updateMyEvent: (idEvent, eventName, eventDate, location, description, price, cb) => {
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
                url: "/events/" + idEvent + "/update-event"
            }, cb);
        },

        // Finding the attending students for an specific event.
        findAttendingStudents: (idEvent, cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students"
            }, cb);
        }
    },



    User: {
        findAll: (cb) => {
            SDK.request({method: "GET", url: "/staffs"}, cb);
        },

        // Finding the current user. Passes to localStorage
        current: (cb) => {
           SDK.request({
                    url: "/students/profile",
                    method: "GET"
                }, (err, data) => {

                    if (err) return cb(err);

                    localStorage.setItem("idStudent", JSON.parse(data).idStudent);


                    cb(null, data);

                });
        },

        // Logout for the current user
        logOut: () => {

            localStorage.removeItem("token"); // token slettes når man logger ud
            window.location.href = "login.html";
        },

        // login for the current user. Passes email and password to the server
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

                // Gets current users token and store it in localStorage
                localStorage.setItem("token",JSON.parse(data));

                cb(null, data);

            });
        },

        // A student can create a user. Passes data to server
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

                if (err) return cb(err);


                cb(null, data);

            });
        },

        // Finding the attending events for the current user
        findAttendingEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                // gets the current users ID from localStorage
                url: "/students/" + localStorage.getItem("idStudent") + "/events",
                headers: {
                    filter: {
                        include: ["events"]
                    }
                }
            }, cb);

        },

        // Load navigation-bar and controls whether to show the login or logout in the right corner
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                var currentUser = null;
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

                });

                cb && cb();
            });
        }
    },

    // Storage-method that makes it possible to store in localStorage
    Storage: {
        prefix: "",
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
    },

    Encryption: {

        // encrypt the values sent from client to server
        encrypt: (encrypt) => {
            if (encrypt !== undefined && encrypt.length !== 0) {
                const fields = ['J', 'M', 'F'];
                let encrypted = '';
                for (let i = 0; i < encrypt.length; i++) {
                    encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return encrypted;
            } else {
                return encrypt;
            }
        },

        // decrypt the methods received from the server
        decrypt: (decrypt) => {
            if (decrypt.length > 0 && decrypt !== undefined) {
                const fields = ['J', 'M', 'F'];
                let decrypted = '';
                for (let i = 0; i < decrypt.length; i++) {
                    decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return decrypted;
            } else {
                return decrypt;
            }
        }
    },
};