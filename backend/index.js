require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => {
    console.error('MongoDB 연결 실패:', err);
  });
// ✅ 테스트용 (서버 확인)
app.get('/api/test', (req, res) => {
  res.json({ message: '백엔드 살아있음' });
});

// ✅ Todo 스키마
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// ✅ GET
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// ✅ POST
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ title: req.body.title });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// ✅ PUT
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// ✅ DELETE
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
});

// ❌ app.listen 절대 쓰지 말 것 (Vercel에서는)
// 👉 대신 export
module.exports = app;