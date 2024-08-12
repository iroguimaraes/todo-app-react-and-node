import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  //getting the width of the window
  let displayWidth = window.innerWidth;
  document.documentElement.style.setProperty('--display-width', `${displayWidth}px`);

  const [tarefas, setTarefas] = useState([]);
  const [newTarefa, setNewTarefa] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tarefas')
      .then(response => setTarefas(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTarefa = () => {
    axios.post('http://localhost:5000/tarefas', { title: newTarefa })
      .then(response => setTarefas([...tarefas, response.data]))
      .catch(error => console.error(error));
  };

  const deleteTarefa = (id) => {
    axios.delete(`http://localhost:5000/tarefas/${id}`)
      .then(() => {
        setTarefas(tarefas.filter(tarefa => tarefa._id !== id));
      })
      .catch(error => console.error(error));
  };

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:5000/tarefas/${id}`, { title: editingTitle })
      .then(response => {
        setTarefas(tarefas.map(tarefa => (tarefa._id === id ? response.data : tarefa)));
        setEditingId(null);
        setEditingTitle('');
      })
      .catch(error => console.error(error));
  };



  return (
    <div className='contentMain'>
      <div className='column'>
        <div>
          <div>
            <h1 className='textTitle'>Lista de Tarefas</h1>
          </div>
          <div>
            <input
              className='inputTarefa'
              type="text"
              value={newTarefa}
              maxLength="20"
              onChange={(e) => setNewTarefa(e.target.value)}
            />
          </div>
          <div className='addTarefaButtonContainer'>
            <button className='addTarefaButton' onClick={addTarefa}>Adicionar Tarefa</button>
          </div>
        </div>
        <div className='windowWidth'>
          <ul className='tarefaList'>
            {tarefas.map(tarefa => (
              <li className='tarefaElement' key={tarefa._id}>
                {editingId === tarefa._id ? (
                  <>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <button className='editTarefaButton' onClick={() => saveEdit(tarefa._id)}>Salvar</button>
                    <button className='deleteTarefaButton' onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {tarefa.title}
                    <button className='editTarefaButton' onClick={() => startEditing(tarefa._id, tarefa.title)}>Editar</button>
                    <button className='deleteTarefaButton' onClick={() => deleteTarefa(tarefa._id)}>Excluir</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
