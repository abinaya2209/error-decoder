import { useState } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [errorText, setErrorText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDecode = async () => {
    if (!errorText.trim()) return
    setLoading(true)
    setResult('')

    try {
      const response = await fetch('http://127.0.0.1:5000/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error_text: errorText })
      })
      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setResult('Error connecting to server. Make sure the backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <h1>🐛 Error Decoder</h1>
      <p>Paste your error or stack trace below</p>

      <textarea
        value={errorText}
        onChange={(e) => setErrorText(e.target.value)}
        placeholder="Paste your error here..."
        rows={8}
      />

      <button onClick={handleDecode} disabled={loading}>
        {loading ? 'Decoding...' : 'Decode Error'}
      </button>

      {result && (
        <div className="result-box">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default App