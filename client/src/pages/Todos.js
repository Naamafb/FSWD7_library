import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

import styles from "./Todos.module.css";

function Todos() {
  const [Todos, setTodos] = useState([]);//רשימה של כל הטודוס
  const [editingTodoId, setEditingTodoId] = useState(null);//שומר את מספר הכותרת שעושים עליה שינוי
  const [editTitle, setEditTitle] = useState(null);//השינוי שעושים לכותרת
  const [newTodo, setnewTodo] = useState([]);//תוכן של טודו חדש

  const navigate = useNavigate();

  const usern = JSON.parse(localStorage.getItem('currentUser'));
  const todos = JSON.parse(localStorage.getItem("currentTodos"));//כל הרשימה המעודכנת עד עכשיו
  const todosComp = JSON.parse(localStorage.getItem("compTodos"));//במידה והוסיפו גם את המשימות שבוצעו כדי לגעת שבוצעו

  useEffect(() => {
    if (!todos) {
      const temp = getComp(0);
      temp.then(data => setTodos(data));
    }
    else {
      setTodos(todos)
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentTodos", JSON.stringify(Todos));
  }, [Todos]);

  //פונקציה ששולפת את כל המשימות שהמצב שלהן COMP 
  const getComp = async (comp) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${usern.id}/${comp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const newData = await response.json();
        return newData;
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error.message);
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        await setTodos((prevTodos) => {
          return prevTodos.filter(todo => todo.id !== id);
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      navigate("/error");
    }
  };

  const handleSave = async (id, title, c) => {
    if (editingTodoId != null) {
      try {
        const todo = {
          userId: usern.id,
          id: editingTodoId,
          title: editTitle,
          completed: c ? 1 : 0
        };
        console.log(todo);
        const response = await fetch(`http://localhost:3000/todos/update-title/${editingTodoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        });
        if (response.ok) {
          const updatedTodo = await response.json();
          await setTodos(prevTodos => {
            return prevTodos.map(todo => {
              if (todo.id === updatedTodo.id) {
                return updatedTodo;
              }
              return todo;
            });
          });
        }
      } catch (error) {
        console.error("Error updating data:", error);
        navigate("/error");
      } finally {
        setEditingTodoId(null);
        setEditTitle(null);
      }
    }
  };

  const handleCheckChange = async (id, title, completed) => {
    if (!todosComp) {//במצב בו עוד לא מוצגות המשימות שבוצעו
      await setTodos((prevTodos) => {
        return prevTodos.filter(todo => todo.id !== id);
      });
    }
    try {
      const todo = {
        userId: usern.id,
        id: id,
        title: title,
        completed: completed
      };
      const response = await fetch(`http://localhost:3000/todos/update-completed/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        await setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }
            return todo;
          });
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
      navigate("/error");
    }
  }

  const handleEdit = async (id, title) => {
    setEditingTodoId(id);
    setEditTitle(title);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const todo = {
          userId: usern.id,
          id: 0,
          title: newTodo,
          completed: 0
        };
        const response = await fetch(`http://localhost:3000/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        });
        console.log(response);
        if (response.ok) {
          const updatedTodo = await response.json();
          await setTodos(prevTodos => [...prevTodos, updatedTodo]);
          setnewTodo('');
        }
      } catch (error) {
        console.error("Error updating data:", error);
        navigate("/error");
      }
    }
  };

  //מוסיף את המשימות שבוצעו
  const showCompleted = async () => {
    if (!todosComp) {
      const temp = getComp(1);
      temp.then(data => {
        const mergedTodos = Todos.concat(data);
        mergedTodos.sort((a, b) => a.id - b.id);
        localStorage.setItem("compTodos", JSON.stringify(mergedTodos));
        setTodos(mergedTodos)
      });
    }
  };

  return (
    <section className={styles["todos-select"]}>
      <div className={styles["lists"]}>
        <div className={styles["todos-list"]}>
          <input
            type="text"
            value={newTodo}
            onChange={e => setnewTodo(e.target.value)}
          />
          <button onClick={addTodo}>Add Todo</button>
          {Todos.map(todo => (
            <div className={styles["todos-item"]} key={todo.id}>
              <div className={styles["todo-case"]}>
                <input
                  className={styles["todos-checkbox"]}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckChange(todo.id, todo.title, !todo.completed)}
                />
                <span className={todo.completed ? '' : 'completed'}>
                  {editingTodoId === todo.id ? (
                    <input
                      className={styles["todos-input"]}
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  ) : (
                    todo.title
                  )}
                </span>
                <div className="buttons">
                  <button onClick={() => handleDelete(todo.id)}>
                    <FaTrash />
                  </button>
                  <button onClick={() => handleEdit(todo.id, todo.title)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleSave(todo.id, todo.title, todo.completed)}>
                    <FaSave />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!todosComp ? (
            <button onClick={() => showCompleted()}>
              SHOW COMPLETED
            </button>
          ) : (
            <h2>this is all users todo</h2>
          )}
        </div>
      </div>
    </section>
  );
}

export default Todos;
