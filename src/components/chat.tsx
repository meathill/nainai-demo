import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", isBot: true }
  ])
  const [input, setInput] = useState('')
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const threshold = 20; // line height
    const rect = messageContainerRef.current?.getBoundingClientRect();
    const containerRect = messageContainerRef.current?.getBoundingClientRect();
    if (rect && containerRect) {
      const isScrolledToBottom = rect.bottom - threshold >= containerRect.bottom;
      if (isScrolledToBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    const userMessage: Message = { id: messages.length + 1, text: input, isBot: false }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    let count = 0;

    // Simulate bot response
    while (count < 10) {
      count++;
      const botMessage: Message = { id: messages.length + 2, text: "I'm processing your request...", isBot: true }
      setMessages(prev => [...prev, botMessage])
      await sleep(500);

      // Simulate streaming response
      const fullResponse = "This is a simulated streaming response. It will be output word by word to mimic a real-time chat experience."
      const words = fullResponse.split(' ')

      while (words.length) {
        setMessages(prev => {
          const updatedMessages = [...prev]
          const lastMessage = updatedMessages[updatedMessages.length - 1]
          if (lastMessage.isBot) {
            lastMessage.text += ' ' + words.shift();
          }
          return updatedMessages
        });
        await sleep(100);
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
