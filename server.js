var express = require('express'),
	app = express(),
	port = process.env.PORT || 3003,
	bodyParser = require('body-parser');
var cors = require('cors');
var MathJax = require('./mathjax.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use('/data', data);
// app.post("/", function(req, res) {
//   res.send("hello world");
// });
// POST method route
app.post('/math', math);

app.use(function(req, res) {
	res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(port);

console.log('API server started on: ' + port);

function data(req, res) {
	return res.status(200).json({ success });
}

function math(req, res) {
	renderedata(req.query.math, function(data) {
		if (!data.errors) {
			// console.log(data.svg);
			res.status(500).json({ success: true, data: data.svg });
		} else res.status(200).json({ success: false, data: data.errors });
	});
}

function renderedata(math, callback) {
	return MathJax(math).then(function(data) {
		callback(data);
	});
}
