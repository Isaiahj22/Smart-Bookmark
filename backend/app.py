from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows your frontend to connect to your backend

@app.route('/get-tip')
def get_tip():
    return jsonify({
        "tip": "Ask students to predict what happens next in the story!"
    })

if __name__ == '__main__':
    app.run(debug=True)

