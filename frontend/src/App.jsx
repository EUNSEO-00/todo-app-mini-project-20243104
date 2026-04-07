import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const API = 'http://localhost:5000/api/todos';

  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!title) return;
    await axios.post(API, { title });
    setTitle('');
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(`${API}/${id}`, { completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo App</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할일 입력"
      />
      <button onClick={addTodo}>추가</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => toggleTodo(todo._id, e.target.checked)}
            />
            {todo.title}
            <button onClick={() => deleteTodo(todo._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;