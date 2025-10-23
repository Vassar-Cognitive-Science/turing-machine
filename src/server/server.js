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
	port = process.env.PORT || (DEV_ENVIRONMENT ? 3001 : 80);

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
app.get('/api/state/:id', async function(req, res) {
	let client;
	try {
		client = new MongoClient(url, {
			serverSelectionTimeoutMS: 2000,
			connectTimeoutMS: 2000
		});
		
		await client.connect();
		const db = client.db(databaseName);
		
		const target = await db.collection(databaseCollection).findOne({
			id: req.params.id.toString()
		});
		
		if (target && target.state) {
			res.json({ state: target.state });
		} else {
			res.status(404).json({ error: "State not found" });
		}
		
	} catch (err) {
		console.warn('MongoDB operation failed:', err?.message);
		if (err.name === 'MongoServerSelectionError') {
			res.status(503).json({ 
				error: "Database unavailable. Please start MongoDB to use save/load features." 
			});
		} else {
			res.status(500).json({ error: "Database query failed" });
		}
	} finally {
		if (client) {
			await client.close();
		}
	}
});

// Health check endpoint for production monitoring
app.get('/api/health', function(_req, res) {
	const healthCheck = {
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || 'development',
		version: process.env.npm_package_version || '0.0.1',
		services: {
			server: 'healthy',
			database: 'unknown'
		}
	};

	// Check database connection
	MongoClient.connect(url, { 
		serverSelectionTimeoutMS: 1000,
		connectTimeoutMS: 1000
	}, function(err, db) {
		if (err || db === null) {
			healthCheck.services.database = 'unavailable';
			healthCheck.status = 'degraded';
			res.status(503).json(healthCheck);
		} else {
			healthCheck.services.database = 'healthy';
			db.close();
			res.status(200).json(healthCheck);
		}
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

app.post('/api/save', async function(req, res) {
	let client;
	try {
		client = new MongoClient(url, {
			serverSelectionTimeoutMS: 2000,
			connectTimeoutMS: 2000
		});
		
		await client.connect();
		const db = client.db(databaseName);
		
		const id = createIdFromTimeStamp();
		await db.collection(databaseCollection).insertOne({
			id: id,
			state: req.body,
			createdAt: new Date()
		});
		
		res.json({ id: id });
		
	} catch (err) {
		console.warn('MongoDB operation failed:', err?.message);
		if (err.name === 'MongoServerSelectionError') {
			res.status(503).json({
				error: "Database unavailable. Please start MongoDB to use save/load features."
			});
		} else {
			res.status(500).json({ error: "Failed to save state" });
		}
	} finally {
		if (client) {
			await client.close();
		}
	}
});



var server = app.listen(port, function() {
	var port = server.address().port;

	console.log("Example app listening at http://localhost:%s", port);
})