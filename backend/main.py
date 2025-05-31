from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)

CORS(app)

@app.route("/run", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code")
    stdin = data.get("input", "")

    if stdin.strip() == "":
        stdin = "\n"

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name

    try:
        result = subprocess.run(["python", temp_file_path], input=stdin.encode(), capture_output=True, timeout=5)
        output = result.stdout.decode() + result.stderr.decode()
    except subprocess.TimeoutExpired:
        output = "Error: Execution timed out."
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        os.remove(temp_file_path)

    return jsonify({"output": output})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
