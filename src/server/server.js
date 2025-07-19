import Express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import BodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { createIdFromTimeStamp } from './utils.js';

import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEV_ENVIRONMENT = process.env.NODE_ENV !== 'production';

const POST_DATA_SIZE_LIMIE = '50mb',
	databaseName = 'turingMachine',
	databaseCollection = 'saves',
	url = "mongodb://localhost:27017/" + databaseName;

const app = new Express(),
	port = process.env.PORT || (DEV_ENVIRONMENT ? 3000 : 80);

// In development, proxy static assets to esbuild dev server
if (DEV_ENVIRONMENT && process.env.ESBUILD_HOST && process.env.ESBUILD_PORT) {
	const esbuildUrl = `http://${process.env.ESBUILD_HOST}:${process.env.ESBUILD_PORT}`;
	
	// Proxy static assets and esbuild WebSocket for hot reload
	app.use('/static', createProxyMiddleware({
		target: esbuildUrl,
		changeOrigin: true,
		pathRewrite: {
			'^/static': '/static'
		}
	}));
	
	app.use('/esbuild', createProxyMiddleware({
		target: esbuildUrl,
		changeOrigin: true,
		ws: true, // Enable WebSocket proxying for hot reload
	}));
}

app.use(BodyParser.urlencoded({
	extended: true,
	limit: POST_DATA_SIZE_LIMIE,
	parameterLimit: 50000
}));
app.use(BodyParser.json({
	limit: POST_DATA_SIZE_LIMIE
}));

app.use(Express.static(path.join(__dirname + '/../../public')));

// API endpoint to get machine state by ID
app.get('/api/state/:id', function(req, res) {
	MongoClient.connect(url, { 
		serverSelectionTimeoutMS: 2000,  // Timeout after 2 seconds
		connectTimeoutMS: 2000
	}, function(err, db) {
		if (err || db === null) {
			console.warn('MongoDB connection failed:', err?.message);
			res.status(503).json({ error: "Database unavailable. Please start MongoDB to use save/load features." });
			return;
		}

		db.collection(databaseCollection).findOne({
				id: req.params.id.toString()
			},
			function(err, target) {
				if (target && target.state) {
					res.json({ state: target.state });
				} else {
					res.status(404).json({ error: "State not found" });
				}
				db.close();
			}
		);
	});
});

// Serve index.html for all non-API routes (SPA routing)
app.get('*', function(req, res) {
	// Skip API routes
	if (req.path.startsWith('/api/')) {
		res.status(404).json({ error: "API endpoint not found" });
		return;
	}
	res.sendFile(path.join(__dirname + '/../../public/index.html'));
});

app.post('/api/save', function(req, res) {
	MongoClient.connect(url, { 
		serverSelectionTimeoutMS: 2000,  // Timeout after 2 seconds
		connectTimeoutMS: 2000
	}, function(err, db) {
		if (err || db === null) {
			console.warn('MongoDB connection failed:', err?.message);
			res.status(503).json({
				error: "Database unavailable. Please start MongoDB to use save/load features."
			});
			return;
		}

		var id = createIdFromTimeStamp();
		db.collection(databaseCollection).insert({
			id: id,
			state: req.body
		}, function(err, docsInserted) {
			if (err) {
				res.status(500).json({ error: "Failed to save state" });
			} else {
				res.json({ id: id });
			}
			db.close();
		});
	});
});



var server = app.listen(port, function() {
	var port = server.address().port;

	console.log("Example app listening at http://localhost:%s", port);
})