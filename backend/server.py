from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route("/decode", methods=["POST"])
def decode_error():
    data = request.json
    error_text = data.get("error_text", "")

    if not error_text.strip():
        return jsonify({"error": "No error text provided"}), 400

    prompt = f"""You are a senior developer. A student pasted this error:

{error_text}

Explain:
1. What caused this error (plain English, 2-3 sentences)
2. The most likely fix (specific, actionable)
3. One tip to avoid this in future

Keep it beginner-friendly. Format as plain text with clear sections."""

    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[{"role": "user", "content": prompt}]
    )

    result = response.choices[0].message.content
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(debug=True, port=5000)