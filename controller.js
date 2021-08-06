const db = require("./db");

class Controller {
  async getTodos() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM todos", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async getFilterTodos(query) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM todos WHERE completed=${query.completed}`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  async getTodo(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM todos WHERE id=${id}`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }


  async createTodo(body) {
    return new Promise((resolve, reject) => {
      db.get(
        "INSERT INTO todos(text, completed, reference) VALUES ($text, $completed, $reference)",
        { $text: body.text, $completed: body.completed, $reference: body.reference.join(",") },
        (err) => {
          if(err) reject(err);
          else resolve("Success add todo");
        }
      );
    });
  }

  async updateTodo(id, body) {
    return new Promise((resolve, reject) => {
      if (body.text && !body.completed) {
        db.run(
          "UPDATE todos SET text=$text, reference=$reference WHERE id=$id",
          { $text: body.text, $reference: body.reference.join(","), $id: id },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
      } else {
        db.run(
          "UPDATE todos SET completed=$completed WHERE id=$id",
          { $completed: body.completed, $id: id },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
      }
    });
  }

  async deleteTodo(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todos WHERE id=$id", { $id: id }, (err, res) => {
        if (err) reject(err);
        resolve("Todo deleted successfully");
      });
    });
  }
}
module.exports = Controller;
