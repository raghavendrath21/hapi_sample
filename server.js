'use strict';
const Hapi = require('@hapi/hapi');
const Handlebars = require('handlebars');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    server.route({
        method: 'GET',
        path: '/home',
        handler: function (request, reply) {
            return reply.data = Date.now()
        }
    });
    server.state('data', {
        ttl: null,
        isSecure: true,
        isHttpOnly: true
    });

    server.route({
        method: 'GET',
        path: '/test',
        handler: async (request, h) => {
            await h.state('data', {
                username: 'tom'
            });
            return h.response(request.state.username);
        }
    });
    server.route({
        method: 'POST',
        path: '/hello',
        handler: function (request, h) {
            let firstname = ""
            let lastname = ""
            firstname = request.payload.firstname
            lastname = request.payload.lastname
            //return `POST method : ` + firstname + lastname;          
            console.log("firstname : ", firstname)
            console.log("lastname : ", lastname)
            return h.response(firstname + lastname).code(201)

            // return h.view('index', {
            // })
        }

    });
    // register plugins

    await server.register({
        plugin: require('vision') // add template rendering support in hapi
    })
    server.route({
        method: 'GET',
        path: '/user',
        handler: function (request, h) {
            return h.view('index', {
                name: "demo1"
            })
        }
    });

    // configure template support   
    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        layout: 'index'
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();