const mongoose = require("mongoose")
const URL = process.env.MONGODB_URI

console.log(`connecting to ${URL}`)

mongoose.set("strictQuery", false)
mongoose
  .connect(URL)
  .then((res) => console.log("connected to MONGODB"))
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`)
    mongoose.connection.close()
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
