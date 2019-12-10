var express = require("express"),
  app = express(),
  port = process.env.PORT || 3003,
  bodyParser = require("body-parser");
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use("/data", data);
app.use("/omr", data);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port);

console.log("API server started on: " + port);

function data(req, res) {
  return res.status(200).json({ success });
}
