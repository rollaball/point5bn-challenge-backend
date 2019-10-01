const express = require('express')
const app = express()
const port = process.env.PORT || 9000
const schools = require("./routes/schools")
var cors = require('cors')
app.use(cors())
app.use('/schools', schools)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))