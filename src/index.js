const express = require('express');
const app = express();

require('./init/logging')();
require('./init/database')();
require('./init/security')(app);
require('./init/routes')(app);


const PORT = process.env.PORT || 5000
const server = app.listen(PORT,()=>{
    console.log(`Server is listening on http://localhost:${PORT}`)
})