var express = require('express'); //express
var app = express();
var bodyParser = require('body-parser'); //para poder enviar del front al backend
var db = require('mongoose');
/* eslint global-require: 0*/
const glob = require('glob'); //poder leer archivos de forma eficiente
const path = require('path');
const _ = require('lodash');


//instancia de mongo 
var connectDb = () => {
  // se conecta a un ruta, en este caso la ruta de mongo por default es este, y se va crear la base de datos todo-list sino existe
  db.connect('mongodb://127.0.0.1:27017/todo-list', { 
    promiseLibrary: global.Promise
  }).then(() => {
    // console.log('db-connect', DB_URI);
  }, err => {
    // console.log('err-db-connect', err);
    connectDb();
  });
};

db.Promise = global.Promise; //libreria nativa
connectDb();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


//es para la parte del navegador
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce' +
    ', X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId' +
    ', X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires');
  res.header('Access-Control-Allow-Methods', 'HEAD,OPTIONS,GET,PUT,POST,DELETE');
  next();
});

//este paquete lee las rutas y nos devuelve las require que le solicitemos. esto para cuando la API crece y ocupamos muchos endpoints.
glob('./server/modules/**/*.routes.js', {}, (err, files) => {
  _.each(files, (file) => {
    require(path.resolve(file))(app);
  });
});

//servidor
app.listen(3000, () => {
  console.log('El server esta funcionando en el puerto 3000');
});