import { useState, useEffect } from 'react'
import { generateAIResponse } from './lib/openai'
import { supabase } from './lib/supabase'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{text: string, isAi: boolean}>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Fehler beim Laden der Nachrichten:', error)
        return
      }

      if (data) {
        const formattedMessages = data.flatMap(conversation => [
          { text: conversation.user_message, isAi: false },
          { text: conversation.ai_response, isAi: true }
        ])
        setMessages(formattedMessages)
      }
    }

    loadMessages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    const userMessage = input.trim()
    setInput('')
    
    // Benutzer-Nachricht hinzufügen
    setMessages(prev => [...prev, { text: userMessage, isAi: false }])

    try {
      // KI-Antwort generieren
      const aiResponse = await generateAIResponse(userMessage)
      
      // KI-Antwort hinzufügen
      setMessages(prev => [...prev, { text: aiResponse || 'Keine Antwort erhalten', isAi: true }])

      // In Supabase speichern
      await supabase.from('conversations').insert([
        {
          user_message: userMessage,
          ai_response: aiResponse,
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { text: 'Ein Fehler ist aufgetreten.', isAi: true }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">AI Chat Tool</h1>
        
        {/* Chat-Verlauf */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.isAi 
                  ? 'bg-blue-100 ml-4' 
                  : 'bg-gray-100 mr-4'
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              Denke nach...
            </div>
          )}
        </div>

        {/* Eingabeformular */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Schreiben Sie Ihre Nachricht..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Senden
          </button>
        </form>
      </div>
    </div>
  )
}

export default App 