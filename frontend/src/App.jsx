import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Todo App</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할일 입력"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={addTodo}
          >
            추가
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => toggleTodo(todo._id, e.target.checked)}
                />
                <span className={todo.completed ? "line-through text-gray-400" : ""}>
                  {todo.title}
                </span>
              </div>

              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteTodo(todo._id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;