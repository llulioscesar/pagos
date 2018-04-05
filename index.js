var config = require('./config');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var mercadopago = require('mercadopago');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.set('view engine', 'jade');

mercadopago.configure({
   client_id: '7983174738600312',
   client_secret: 'UtFcz7h7SJrLjBhgR5gExd9cXdd6XYic'
});

app.get("/", function (req, res) {

  var fileFromParameter = req.params[0] + '.js';

  console.log(fileFromParameter);
  console.log(req.params);

  if (fs.existsSync(fileFromParameter)) {
    // Execute the file found
    require('./' + fileFromParameter).run(req, res);
  } else {
    // Return 404
    res.status(404).render('404', {
      file: fileFromParameter
    });
  }
});

app.post("/", function(req, res) {

  var preference = {}

  var item = {
    id: 'P01',
    title: 'Plan basico',
    quantity: 1,
    currency_id: 'COP',
    unit_price: 55000
  }

  var payer = {
    name: "Pedro",
    surname: "Madrigal",
    email: "ruth_bashirian@hotmail.com"
  }

  /*date_created: "2018-004-004T12:58:41.425-04:00",
  phone: {
    area_code: "",
    number: "642682074"
  },
  identification: {
    type: "DNI",
    number: "123456789"
  },
  address: {
    street_name: "Extramuros Agustín",
    street_number: 88,
    zip_code: "26247"
  }*/

  preference.items = [item]
  preference.payer = payer

  mercadopago.preferences.create(preference).then(function (data) {
    res.json(data);
  }).catch(function (error) {
    res.send(error);
  });

})

app.listen(config.port);

console.log('Server running on port:', config.port);
