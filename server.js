var express = require('express'),
	app = express(),
	port = process.env.PORT || 3003,
	bodyParser = require('body-parser');
var cors = require('cors');
var mathJax = require('./mathjax.js');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var expressWinston = require('express-winston');
var winston = require('winston');

// const { createLogger, format, transports } = require('winston');
// const { combine, timestamp, label, prettyPrint } = format;

// const logger = createLogger({
// 	format: combine(label({ label: 'mathjax-node' }), timestamp(), prettyPrint()),
// 	transports: [new transports.Console()]
// });

// logger.log({
// 	level: 'info',
// 	message: 'What time is the testing at?'
// });

// logger.info('Hello, this is a logging event with a custom pretty print', { foo: 'bar' });

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// console.log(logger);
// app.use(logger);

app.use(
	expressWinston.logger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(winston.format.colorize(), winston.format.json()),
		meta: true, // optional: control whether you want to log the meta data about the request (default to true)
		msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
		expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
		colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
		ignoreRoute: function(req, res) {
			return false;
		} // optional: allows to skip some log messages based on request and/or response
	})
);

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
