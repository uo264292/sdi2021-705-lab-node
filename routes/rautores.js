module.exports = function (app,swig){

    app.get('/autores', function (req,res){
        let autores = [{
            "nombre" : "Axel Rose",
            "grupo" : "Guns And Roses",
            "rol" : "Cantante"
        }, {
            "nombre": "Freddie Mercury",
            "grupo": "Queen",
            "rol" : "Cantante"
        },{
            "nombre": "Brian May",
            "grupo": "Queen",
            "rol" : "Guitarrista"
        }];

        let respuesta = swig.renderFile('views/autores/autores.html',{
            listaAutores : autores
        });

        res.send(respuesta);
    })


    app.get('/autores/agregar', function (req,res){

        let roles = [{
            "cantante" : "Cantante",
            "guitarrista" : "Guitarrista",
            "bateria": "Bateria",
            "bajista": "Bajista",
            "teclista" : "Teclista"
        }];

        let respuesta = swig.renderFile('views/autores/bagregar.html',{
            listaRoles : roles
        });
        res.send(respuesta);
    })

    app.post('/autores/agregar', function (req,res){
        let respuesta ="";

        if (typeof (req.body.nombre) == "undefined"){
            respuesta += "Autor: no enviado en la peticion." +"<br>"
                + " grupo: " + req.body.grupo + "<br>"
                + " rol: " + req.body.rol;
        }

        else if (typeof (req.body.grupo) == "undefined"){
            respuesta += "Autor agregado: "+ req.body.nombre +"<br>"
                + " grupo: no enviado en la peticion " + "<br>"
                + " rol: " + req.body.rol;
        }

        else if (typeof (req.body.rol) == "undefined"){
            respuesta += "Autor agregado: "+ req.body.nombre +"<br>"
                + " grupo: "+ req.body.grupo + "<br>"
                + " rol: no enviado en la peticion";
        }

        else{
            respuesta += "Autor agregado: "+ req.body.nombre +"<br>"
            + " grupo: "+ req.body.grupo + "<br>"
            + " rol: " + req.body.rol;
        }

        res.send(respuesta);
    })


    app.get('/autores/*', function (req,res){
        res.redirect('/autores');
    })

};