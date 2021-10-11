const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`listen on `, port )
})

module.exports = app;
