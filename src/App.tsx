import { useState } from 'react'
import Chat from './components/chat';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Chat />

    </>
  )
}

export default App
