require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

const app = express(),
  HTTP_PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static("dist"))
app.use(cors())

morgan.token("content", (req, res) => {
  return Object.values(req.body).length && JSON.stringify(req.body)
})
const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :content"
)

app.use(logger)

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get("/info", (req, res) => {
  Person.find({})
    .countDocuments()
    .then((total) => {
      res.send(`
      <p>Phonebook has info for ${total} people</p>
      <p>${new Date()}</p>
    `)
    })
})

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((err) => {
      res.status(404).json({ error: "not found" })
    })
})

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end()
  })
})

const BOUNDARY = 999999999999,
  generateId = () => Math.round(Math.random() * BOUNDARY)

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    res.status(400).json({ error: "name or number missing" })
    return
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  person.save().then((person) => {
    res.status(201).json(person)
  })
})

app.listen(HTTP_PORT, () => {
  console.log(`App is running on port ${HTTP_PORT}`)
})
