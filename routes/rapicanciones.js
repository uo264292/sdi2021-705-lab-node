module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });


    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });


    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        let cancion_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;

        gestorBD.eliminarCancion(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });


    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        validarDatosAlCrear(cancion, function (errores){
            if (errores !== null && errores.length>0){
                res.status(403);
                res.json({
                   errores : errores
                });
            }
            else{
                gestorBD.insertarCancion(cancion, function(id){
                    if (id == null) {
                        errores.push("Se ha producido un error")
                        res.status(500);
                        res.json({
                            errores : errores
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "canción insertada",
                            _id : id
                        })
                    }
                });
            }
        });


    });



    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar

        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;

        gestorBD.modificarCancion(criterio, cancion, function(result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje : "canción modificada",
                    _id : req.params.id
                })
            }
        });
    });


    app.post("/api/autenticar/", function (req,res){
        let seguro = app.get("crypto").createHmac('sha256',app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios){
           if (usuarios == null || usuarios.length == 0){
               res.status(401); //No autorizado
               res.json({
                   autenticado : false
               });
           }
           else{
               let token = app.get('jwt').sign({usuario: criterio.email , tiempo: Date.now()/1000}, "secreto");
               res.status(200);
               res.json({
                  autenticado : true,
                   token : token
               });
           }
        });
    });

    function validarDatosAlCrear(cancion, funcionCallBack){
        let errores = new Array();
        if (cancion.nombre===null|| typeof cancion.nombre ==='undefined'||cancion.nombre==='')
            errores.push("Debe rellenarse el nombre de la cancion.");
        if (cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero ==='')
            errores.push("Debe rellenarse el campo del genero.");
        if (cancion.precio===null || typeof cancion.precio === 'undefined' || cancion.precio < 0 || cancion.precio==='')
            errores.push("El campo del precio no puede ser negativo.");
        if (errores.length<=0){
            funcionCallBack(null);
        }
        else
            funcionCallBack(errores);
    }

    function usuarioEsAutorDeLaCancion(usuario, cancion_id, funcionCallBack){

    }
}