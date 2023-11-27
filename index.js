const express = require("express")

const app = express(),
  HTTP_PORT = 3001

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

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.listen(HTTP_PORT, () => {
  console.log(`App is running on port ${HTTP_PORT}`)
})
