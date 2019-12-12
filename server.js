var express = require('express'),
	app = express(),
	port = process.env.PORT || 3003,
	bodyParser = require('body-parser');
var cors = require('cors');
var mathJax = require('./mathjax.js');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.post('/math', math);

app.use(function(req, res) {
	res.status(404).send({ url: req.originalUrl + ' not found' });
});

function math(req, res) {
	var math = req.query.math || '';
	try {
		mathJax(math)
			.then(function(data) {
				if (!data.errors) {
					// console.log(data.svg);
					res.status(200).json({ success: true, data: data.svg });
				} else res.status(500).json({ success: false, data: data.errors });
			})
			.catch(function(error) {
				res.status(500).json({ success: false, data: error });
			});
	} catch (error) {
		res.status(500).json({ success: false, data: error });
	}
}

app.listen(port);

console.log('API server started on: ' + port);
