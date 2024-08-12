const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('heregoesmongodbURL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const tarefaSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

app.get('/tarefas', async (req, res) => {
  const tarefas = await Tarefa.find();
  res.json(tarefas);
});

app.post('/tarefas', async (req, res) => {
  const newTarefa = new Tarefa({
    title: req.body.title,
    completed: false,
  });
  await newTarefa.save();
  res.json(newTarefa);
});

app.put('/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedTarefa = await Tarefa.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(updatedTarefa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
});


app.delete('/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Tarefa.findByIdAndDelete(id);
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

