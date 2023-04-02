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

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => {
			next(error);
		});
});

app.post("/api/persons", (request, response, next) => {
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

	person
		.save()
		.then((personSaved) => personSaved.toJSON())
		.then((personSavedAndFormatted) => response.json(personSavedAndFormatted))
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;
	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
	})
		.then((personUpdated) => personUpdated.toJSON())
		.then((personUpdatedAndFormatted) =>
			response.json(personUpdatedAndFormatted)
		)
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted Id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
