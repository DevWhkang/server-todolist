const http = require("http");
const Todo = require("./controller");
const { getReqData } = require("./utils");
const url = require('url') 

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };

  // preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  }

  // /api/todos : GET
  if (req.url === "/api/todos" && req.method === "GET") {
    const todos = await new Todo().getTodos();

    res.writeHead(200, headers);
    res.end(JSON.stringify(todos));
  }
  
  // /api/todos/filter :GET
  else if (req.url.match(/\/api\/todos\/filter\?(\w+)/)&& req.method === "GET") {
    try {
      const query = url.parse(req.url, true).query;
      const filterTodos = await new Todo().getFilterTodos(query);

      res.writeHead(200, headers);
      res.end(JSON.stringify(filterTodos));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }
  
  // /api/todos/:id : GET
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "GET") {
    try {
      const id = req.url.split("/")[3];
      const todo = await new Todo().getTodo(id);

      res.writeHead(200, headers);
      res.end(JSON.stringify(todo));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : DELETE
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "DELETE") {
    try {
      const id = req.url.split("/")[3];
      let message = await new Todo().deleteTodo(id);
      res.writeHead(200, headers);
      res.end(JSON.stringify({ message }));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : UPDATE
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "PATCH") {
    try {
      const id = req.url.split("/")[3];
      let todo_data = await getReqData(req);
      let updated_todo = await new Todo().updateTodo(id, JSON.parse(todo_data));

      res.writeHead(200, headers);
      res.end(JSON.stringify(updated_todo));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/ : POST
  else if (req.url === "/api/todos" && req.method === "POST") {
    let todo_data = await getReqData(req);
    let todo = await new Todo().createTodo(JSON.parse(todo_data));
    res.writeHead(200, headers);
    res.end(JSON.stringify(todo));
  }

  // No route present
  else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
