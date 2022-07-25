const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const server = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model("Article", articleSchema);

///////// Request Targeting all Articles //////////
app
	.route("/articles")
	.get((req, res) => {
		Article.find({}, (err, foundArticles) => {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})

	.post((req, res) => {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticle.save((err) => {
			if (!err) {
				res.send("Succesfully added a new article");
			} else {
				res.send(err);
			}
		});
	})

	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			if (!err) {
				res.send("Deleted all articles");
			} else {
				res.send(err);
			}
		});
	});

///////// Request Targeting a Specific Article //////////

app
	.route("/articles/:articleTitle")
	.get((req, res) => {
		Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
			if (foundArticle) {
				res.send(foundArticle);
			} else {
				res.send("No Articles matching that title was found");
			}
		});
	})
	.put((req, res) => {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			// i think when you don't include the overwrite methode to true
			// it leaves default content not included to be the same
			(err) => {
				if (!err) {
					res.send("Updated Article successfully");
				}
			}
		);
	})
	.patch((req, res) => {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ $set: req.body },
			(err) => {
				if (!err) {
					res.send("Article Updated!");
				}
			}
		);
	})
	.delete((req, res) => {
		Article.deleteOne({ title: req.params.articleTitle }, (err) => {
			if (!err) {
				res.send("Deleted Article");
			} else {
				res.send(err);
			}
		});
	});

// Listen on the correct PORT
app.listen(server, (req, res) => {
	console.log("App listening at port ", server);
});
