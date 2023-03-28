const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

morgan.token("bodyContent", (req, res) => JSON.stringify(req.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :bodyContent"
	)
);

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/info", (request, response) => {
	const personsNumber = persons.length;
	const currentTime = new Date();

	response.send(
		`<p>Phonebook has info for ${personsNumber} people</p><p>${currentTime}</p>`
	);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((p) => p.id !== id);
	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const id = Math.floor(Math.random() * 999999);
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "content missing",
		});
	}

	if (persons.find((p) => p.name === body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const newPerson = {
		id: id,
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(newPerson);
	response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
