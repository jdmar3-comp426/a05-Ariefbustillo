// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
var db = require("./database.js")

// Require md5 MODULE
var md5 = require("md5")

// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set server port
var HTTP_PORT = 5000
// Start server
app.listen(HTTP_PORT, () => {
    // console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/", (req, res) => {	
	let user = req.body.user
	let pass = md5(req.body.pass)
	const stmt = db.prepare(`INSERT INTO userinfo (user, pass) VALUES (?, ?)`).run(user, pass);
	res.json({"message": `${stmt["changes"]} record created: ID ${stmt["lastInsertRowid"]} (201)`})
	res.status(200);
});
// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users/", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {	
	let id = req.params.id;
	const stmt = db.prepare(`SELECT * FROM userinfo WHERE id = ?`).get(id);
	res.status(200).json(stmt);
});
// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {	
	let id = req.params.id;
	let user = req.body.user
	let pass = md5(req.body.pass)
	const stmt = db.prepare(`update userinfo set user = coalesce(?, user), pass = coalesce(?, pass) where id = ?`).run(user, pass, id);
	res.status(200)

	res.json({"message": `${stmt["changes"]} record updated: ID ${id} (200)`})

});
// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {	
	let id = req.params.id;
	const stmt = db.prepare("DELETE FROM userinfo WHERE id = ?").run(id);
	res.json({"message": `${stmt["changes"]} record deleted: ID ${id} (200)`})

	res.status(200);
});
// Default response for any other request
app.use(function(req, res){
	res.json({"message":"Your API is working!"});
    res.status(404);
});
