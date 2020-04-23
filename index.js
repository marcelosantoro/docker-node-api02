// BugFix
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use(function(req, res, next){
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
 res.setHeader("Access-Control-Allow-Headers", "content-type");
 res.setHeader("Content-Type", "application/json");
 res.setHeader("Access-Control-Allow-Credentials", true);
 next();
});

function getDate(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    
    var curData = date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds

    return curData;
}

app.get('/', function(req, res){
    console.log(getDate()+" - Req IP: "+req.ip+" - EndPoint / - GET")
    result = "Acesso invalido ao endpoint /app02/";

    //Environment Vars
    var ENVIRONMENT = process.env.ENVIRONMENT
    var MONGO_USER = process.env.MONGO_USER
    var MONGO_PASS = process.env.MONGO_PASS
    var URL_API = process.env.URL_API
    
    var envVars = {
        ENVIRONMENT: ENVIRONMENT,
        MONGO_USER: MONGO_USER,
        MONGO_PASS: MONGO_PASS,
        URL_API: URL_API
    };

    var response = {status: 'Nao Autorizado', resultado: result, environment_vars: envVars};
    res.json(response);
});

app.get('/api', function(req, res){

    console.log(getDate()+" - Req IP: "+req.ip+" - EndPoint /api - GET")

    fs.readFile('usuarios.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
        } 
        else 
        {
            var obj = JSON.parse(data);
            var result = 'Nenhum usuário foi encontrado';

            result = obj.usuarios;
            obj.usuarios.forEach(function(usuario) {
                
                if (usuario != null) {
                    if (usuario.usuario_id == req.query.usuario_id) {
                        result = usuario;
                    }
                }
            });

            var response = {status: 'sucesso', resultado: result};
            res.json(response);
        }
    });
});

app.post('/api', function(req, res){
    console.log(getDate()+" - Req IP: "+req.ip+" - EndPoint /api - POST")
    fs.readFile('usuarios.json', 'utf8', function(err, data){
        if (err) {
        var response = {status: 'falha', resultado: err};
        res.json(response);
        } else {
        var obj = JSON.parse(data);
        req.body.usuario_id = obj.usuarios.length + 1;

        obj.usuarios.push(req.body);

        fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
            if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
            } else {
            var response = {status: 'sucesso', resultado: 'Usuário cadastrado com sucesso'};
            res.json(response);
            }
        });
        }
    });
});

app.put('/api', function(req, res){
    console.log(getDate()+" - Req IP: "+req.ip+" - EndPoint /api - PUT")
    fs.readFile('usuarios.json', 'utf8', function(err, data){
        if (err) {
        var response = {status: 'falha', resultado: err};
        res.json(response);
        } else {
        var obj = JSON.parse(data);

        obj.usuarios[(req.body.usuario_id - 1)].nome = req.body.nome;
        obj.usuarios[(req.body.usuario_id - 1)].site = req.body.site;

        fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
            if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
            } else {
            var response = {status: 'sucesso', resultado: 'Registro atualizado com sucesso'};
            res.json(response);
            }
        });
        }
    });
});

app.delete('/api', function(req, res){
    console.log(getDate()+" - Req IP: "+req.ip+" - EndPoint /api - DELETE")
    fs.readFile('usuarios.json', 'utf8', function(err, data){
        if (err) {
        var response = {status: 'falha', resultado: err};
        res.json(response);
        } else {
        var obj = JSON.parse(data);

        delete obj.usuarios[(req.body.usuario_id - 1)];

        fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
            if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
            } else {
            var response = {status: 'sucesso', resultado: 'Registro excluído com sucesso'};
            res.json(response);
            }
        });
        }
    });
});

app.listen(80, function(){ console.log('Kubernetes API REST rodando na porta 80') });