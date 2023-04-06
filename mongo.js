const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Please provide at least the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://marcopdonoso:${password}@cluster0.oxq2euy.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = new mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
	console.log("phonebook:");
	Person.find({}).then((persons) => {
		persons.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
}

if (process.argv.length === 5) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(() => {
		console.log(`Added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
}
