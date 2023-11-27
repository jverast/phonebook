const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express(),
  HTTP_PORT = process.env.PORT || 3001

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.use(express.json())
app.use(cors())

morgan.token("content", (req, res) => {
  return Object.values(req.body).length && JSON.stringify(req.body)
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
)

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/info", (req, res) => {
  const total = persons.length,
    date = new Date()

  res.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id),
    person = persons.find((person) => person.id === id)

  if (!person) {
    res.status(404).json({ error: "not found" })
    return
  }

  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter((person) => person.id !== id)
  res.status(204).end()
})

const BOUNDARY = 999999999999,
  generateId = () => Math.round(Math.random() * BOUNDARY)

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    res.status(400).json({ error: "name or number missing" })
    return
  }

  const namesArray = persons.map((person) => person.name)
  if (namesArray.includes(body.name)) {
    res.status(400).json({ error: "name must be unique" })
    return
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.status(201).json(person)
})

app.listen(HTTP_PORT, () => {
  console.log(`App is running on port ${HTTP_PORT}`)
})
