const { response, request } = require("express");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("bodyContent", (req, res) => JSON.stringify(req.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :bodyContent"
	)
);

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/info", (request, response) => {
	const currentTime = new Date();

	Person.find({}).then((persons) => {
		response.send(
			`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`
		);
	});
});

app.get("/api/persons/:id", (request, response) => {
	Person.findById(request.params.id).then((person) => response.json(person));
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((p) => p.id !== id);
	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "content missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((personSaved) => {
		response.json(personSaved);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
