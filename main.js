const express = require('express');
const app = express();
const port = 3030; 
const fs = require('fs'); 

app.use(express.json()); 

let usersData = require('./users.json');

app.get('/getUsers', function(req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
      console.log(data);
      res.end(data);
    });
})

app.get('/getUsers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersData.users.find((user) => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/addUsers', (req, res) => {
  const newUser = req.body; 
  newUser.id = usersData.users.length + 1;
  usersData.users.push(newUser);
  fs.writeFileSync('./users.json', JSON.stringify(usersData, null, 2), 'utf-8');
  res.status(201).json(newUser);
});

app.delete('/deleteUser/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = usersData.users.findIndex((user) => user.id === id);
  if (userIndex >= 0) {
    const deletedUser = usersData.users.splice(userIndex, 1);

    fs.writeFileSync('./users.json', JSON.stringify(usersData, null, 2), 'utf-8');

    res.json(deletedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
