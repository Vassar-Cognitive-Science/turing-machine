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
import { createIdFromTimeStamp } from './utils';

var MongoClient = require('mongodb').MongoClient;

const POST_DATA_SIZE_LIMIE = '50mb';
const databaseName = 'turingMachine';
const databaseCollection = 'saves';
const url = "mongodb://localhost:27017/" + databaseName;

var app = new Express();

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(BodyParser.urlencoded({
  extended: true,
  limit: POST_DATA_SIZE_LIMIE,
  parameterLimit:50000
}));
app.use(BodyParser.json({limit: POST_DATA_SIZE_LIMIE})); 

app.use(Express.static(path.join(__dirname + '/../../public')));
app.use('/error', Express.static(path.join(__dirname + '/../../public')));

app.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname + "/../../public/index.html"));
	res.send(template({}))
});


app.get('/error/404', function(req, res) {
	// res.sendFile(path.join(__dirname + "/../../public/index.html"));
	res.send(template({}))
});

app.get('/:id', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err || db === null) {
			res.redirect('/error/404');
			return;
		}

		db.collection(databaseCollection).findOne({
				id: req.params.id.toString()
			},
			function(err, target) {
				if (target && target.state) {
					res.send(template(target.state));
				} else {
					res.redirect('/error/404');
				}
			}
		);


		db.close();
	});
});

app.post('/', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err || db === null) {
			res.status(403).send({
				error: "No response"
			});
			return;
		}

		var id = createIdFromTimeStamp();
		db.collection(databaseCollection).insert({
			id: id,
			state: req.body
		}, function(err, docsInserted) {
			res.send({
				id: id
			});
		});

		db.close();
	});
});

app.all('*', function(req, res) {
  res.redirect('/error/404');
});

var server = app.listen(80, function() {
	// var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://localhost:%s", port);
})