import { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [tasks, setTasks] = useState<string[]>([])
  const [newTask, setNewTask] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()])
      setNewTask('')
    }
  }

  const suggestTasks = async () => {
    setLoading(true)
    try {
      const prompt = "Sugiere 3 tareas productivas para hacer hoy."
      const response = await axios.post(
        '/openai/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY ?? ''}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const content = response.data.choices[0].message.content as string
      const aiTasks = content
        .split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((t: string) => t.length > 0)

      setTasks((prev) => [...prev, ...aiTasks])
    } catch (error) {
      console.error('Error al obtener tareas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>🧠 AI To-Do List</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Escribe una tarea"
      />
      <button onClick={addTask}>Agregar</button>
      <button onClick={suggestTasks} disabled={loading}>
        {loading ? 'Generando...' : 'Sugerir con IA'}
      </button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
