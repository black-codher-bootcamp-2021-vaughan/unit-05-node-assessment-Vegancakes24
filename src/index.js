require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = __dirname + process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable
let todos = require(todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
  console.log("Hello");

  // res.status(200).end();
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, );

  // res.status(200).end();
});




//Add GET request with path '/todos/overdue'
app.get("/todos/overdue", (_, res) => {
  res.header("Content-Type", "application/json");

  fs.readFile(todoFilePath, function (err, jsonString) {
    if (err) {
      console.log(err);
    } else {
      try {
        const data = JSON.parse(jsonString);
      
        //Code for current date

        const overdue = data.filter((todo) => new Date(todo.due) < new Date());
        
        res.send(overdue);
      } catch (err) {
        console.log("Error parsing JSON", err);
      }
    }
  });

  //read the todos json/filter based on the date/return any dates that are overdue//
  // date objects - create a new date which will be a currents date(needs to be cooded in and not written by me)
  //filter on date and not on overdue Date - need to the todo
});

//Add GET request with path '/todos/completed'

app.get("/todos/completed", (_, res) => {
  res.header("Content-Type", "application/json");

  const todo = todos.filter((todo) => {
    if (todo.completed) {
      return true;
    }
  });
  res.json(todo);
  res.write(JSON.stringify(todo));
  res.status(200).end();
});

// GET todos/:id

app.get("/todos/:id",(req, res) =>{
  const foundTodo = todos.find((todo) => {
    return todo.id == req.params.id;
  });
  console.log(foundTodo, todos[0])
  if (!foundTodo) {
    return res.status(400).send("bad request");
  }
res.status(200).send(foundTodo)
}) 


//Add POST request with path '/todos/

app.post("/todos", (req, res) => {
  var fs = require("fs");
  console.log(req.body);
  todos.push(req.body);
  if (!todos) return res.sendStatus(400);
  console.log('todos', todos)
  fs.writeFile(todoFilePath, JSON.stringify(todos), (err) => {
    console.log('writing file', err)
    if (err) {
      console.error(err);
      return;
    }
  });
  res.status(200).json(todos);
});

//Need to add this text {'name' : 'Buy oatmilk x 2', 'due':'2021-11-20T18:25:43.511Z'} to the todos json file BUT needs to be done via POSTMAN
//1. Read in todo.json/ 2. Add the new todo item into the ones that we have just read/ 3. Save all of them in the todos.json//

//Add PATCH request with path '/todos/:id

app.patch("/todos/:id", (req, res) => {
  const foundTodo = todos.find((todo) => {
    return todo.id == req.params.id;
  });
  if (!foundTodo) {
    return res.status(400).send("bad request");
  }

  var fs = require("fs");
  console.log(req.params.id);
  const newTodos = todos.map((todo) => {
    if (todo.id == req.params.id) {
      todo = {
        ...todo,
        ...req.body,
      };
    }
    return todo;
  });

  fs.writeFile(todoFilePath, JSON.stringify(newTodos), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.status(200).json(newTodos);
});

//Add DELETE request with path '/todos/:id

app.delete("/todos/:id", (req, res) => {
  var fs = require("fs");
  console.log(req.params.id);
  const todo = todos.filter((todo) => {
    if (todo.id == req.params.id) {
      return false;
    }
  });
  if (!todo) return res.sendStatus(400);
  fs.writeFile(todoFilePath, JSON.stringify(todo), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.json(todo);
});

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

//Add POST request with path '/todos/:id/undo
app.post('/todos/:id/undo', (req, res) => {
  var fs = require("fs");
  console.log( req.params.id );
  const todo = todos.map( todo => {
      if (todo.id == req.params.id ){
        todo.completed = false;
      }
         return todos;
   } );
  if (!todo) return res.sendStatus(400);
  fs.writeFile( __dirname + todoFilePath , JSON.stringify(todo) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todo);

 });

//POST - /todos/:id/complete

app.post('/todos/:id/complete', (req, res)=>{
  const foundTodo = todos.find((todo) => {
    return todo.id == req.params.id;
  });
  if (!foundTodo) {
    return res.status(400).send("bad request");
  }

  var fs = require("fs");
  console.log(req.params.id);
  const newTodos = todos.map((todo) => {
    if (todo.id == req.params.id) {
      todo = {
        ...todo,
        ...complete=true
      };
    }
    return todo;
  });

  fs.writeFile(todoFilePath, JSON.stringify(newTodos), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.status(200).json(newTodos);
});

 

module.exports = app;
