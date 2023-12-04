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

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((err) => next(err))
})

app.get("/info", (req, res, next) => {
  Person.find({})
    .countDocuments()
    .then((result) => {
      const total = result,
        date = new Date()

      res.send(`
      <p>Phonebook has info for ${total} people</p>
      <p>${date}</p>
    `)
    })
    .catch((err) => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((err) => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then((person) => {
      res.status(201).json(person)
    })
    .catch((err) => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body,
    person = {
      name: body.name,
      number: body.number
    }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" })
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

app.listen(HTTP_PORT, () => {
  console.log(`App is running on port ${HTTP_PORT}`)
})
