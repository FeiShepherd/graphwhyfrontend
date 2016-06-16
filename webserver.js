// Set up =================================
var express = require('express');
var app = express();

// Constants =================================
var PORT = 3000;

// Config =================================
app.use(express.static(__dirname + '/www'));

// Routes =================================

app.all('*', function (req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
	res.sendFile('www/index.html', { root: __dirname });
});

// Listen =================================
app.listen(process.env.PORT, process.env.IP);
