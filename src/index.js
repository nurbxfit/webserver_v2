const express = require('express');
const app = express();

require('./init/logging')();
require('./init/routes')(app);
require('./init/database')();

const PORT = process.env.PORT || 5000
const server = app.listen(PORT,()=>{
    console.log(`Server is listening on http://localhost:${PORT}`)
})