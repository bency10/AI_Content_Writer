from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

def query_llama(prompt):
    try:
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        })
        print("📩 Ollama Raw Response:", response.text)
        return response.json()["response"]
    except Exception as e:
        print("❌ LLaMA error:", str(e))
        return "Error from LLaMA"

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        print("🟡 Flask received:", data)

        task = data.get('task')
        input_text = data.get('input')

        if task == "keywords":
            prompt = f"List 5 SEO keyword phrases for the topic '{input_text}'. Only return the keywords as a list without any explanation or extra sentences."
        elif task == "titles":
            prompt = f"Generate 3 SEO-optimized blog titles using the keyword '{input_text}'. Only return the titles as a numbered list. Do not include explanations or additional comments."
        elif task == "topics":
            prompt = f"Give 2 blog topic ideas or a blog outline for: {input_text}"
        elif task == "content":
           prompt = f"Write a 150-word SEO-optimized blog introduction on the topic: '{input_text}'. Start with an engaging hook, clearly mention the keyword near the beginning, and keep the tone informative and motivating. Focus on benefits and relevance for the reader."

        else:
            return jsonify({"error": "Invalid task"}), 400

        print("🧠 Prompt sent to LLaMA 3:", prompt)
        result = query_llama(prompt)
        print("✅ LLaMA response:", result)

        # Optional post-processing for keywords
        if task == "keywords":
            cleaned_lines = result.split('\n')
            keywords = [line.strip() for line in cleaned_lines if line.strip() and "remember" not in line.lower()]
            return jsonify({"result": '\n'.join(keywords)})

        return jsonify({"result": result})

    except Exception as e:
        print("❌ Flask Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=7000)
