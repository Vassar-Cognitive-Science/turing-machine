import Express from 'express';
import path from 'path';
import BodyParser from 'body-parser';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config'

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import template from '../../public/template';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017/turingMachine";

var app = new Express();

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(BodyParser.urlencoded({
  extended: true
}));
app.use(BodyParser.json()); 

app.use(Express.static(path.join(__dirname + '/../../public')));
app.use('/saves', Express.static(path.join(__dirname + '/../../public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/../../public/index.html"));
});

app.get('/saves/:id', function(req, res) {

	MongoClient.connect(url, function(err, db) {
		if (err) res.redirect('/404');

		if (req.params.id.toString().length !== 24) {
			res.redirect('/404');
			return;
		}

		try {
			let id = ObjectID(req.params.id);
			db.collection('saves').findOne({ _id: id },
				function(err, target) {
					if (target.state) {
						res.send(template(target.state));
					} else {
						res.redirect('/404');
					}
				}
			);
		} catch (err) {
			console.log(err);
			res.redirect('/404');
		}

		db.close();
	});
});

app.get('/404', function(req, res) {
	res.sendFile(path.join(__dirname + "/../../public/index.html"));
});

app.post('/', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) res.send({error: err});

		db.collection('saves').insert({ state: req.body }, function(err, docsInserted) {
			let id = docsInserted.insertedIds[0];
			res.send({id: id});
		});

		db.close();
	});
});

app.all('*', function(req, res) {
  res.redirect('/404');
});

var server = app.listen(3000, function() {
	// var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://localhost:%s", port);
})