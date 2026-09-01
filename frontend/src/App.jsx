import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

const SAMPLES = [
  {
    label: "Python",
    error: `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    print(user["name"])
TypeError: 'NoneType' object is not subscriptable`
  },
  {
    label: "JavaScript",
    error: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at App.jsx:14:23
    at renderWithHooks (react-dom.development.js:16305:18)`
  },
  {
    label: "Java",
    error: `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.main(Main.java:8)`
  }
]

function App() {
  const [errorText, setErrorText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

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
      setResult('❌ Error connecting to server. Make sure the backend is running.')
    }
    setLoading(false)
  }

  const handleClear = () => {
    setErrorText('')
    setResult('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <div className="logo">🐛</div>
        <h1>Error Decoder</h1>
        <p className="subtitle">
          Paste any programming error and get an instant AI-powered explanation and fix
        </p>
        <div className="badges">
          {["Python", "JavaScript", "Java", "C++", "SQL", "+ more"].map(b => (
            <span className="badge" key={b}>{b}</span>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="card">
        <div className="card-header">
          <span>📋 Paste your error</span>
          <span className="char-count">{errorText.length} chars</span>
        </div>

        {/* Sample buttons */}
        <div className="samples-row">
          <span className="samples-label">Try a sample:</span>
          {SAMPLES.map(s => (
            <button
              key={s.label}
              className="sample-btn"
              onClick={() => setErrorText(s.error)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <textarea
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder="e.g. TypeError: Cannot read properties of undefined (reading 'map')..."
          rows={8}
        />

        <div className="button-row">
          <button className="btn-primary" onClick={handleDecode} disabled={loading}>
            {loading ? (
              <span className="loading-text">
                <span className="spinner"></span> Decoding...
              </span>
            ) : (
              <span>⚡ Decode Error</span>
            )}
          </button>
          <button className="btn-secondary" onClick={handleClear}>
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <span>✅ AI Explanation</span>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="result-content">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>Built with ❤️ by Abinaya • Powered by Groq LLM API</p>
      </div>
    </div>
  )
}

export default App