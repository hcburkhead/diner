import os
from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Mock data for sandwich structures
SANDWICHES = {
    "Bologna Sandwich": ["Bun Top", "Bologna", "Cheese", "Lettuce", "Mayo", "Bun Bottom"],
    "Beef Burger": ["Bun Top", "Beef", "Cheese", "Tomato", "Lettuce", "Bun Bottom"],
    "Classic PB&J": ["Bread Top", "Peanut Butter", "Jelly", "Bread Bottom"]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_order', methods=['GET'])
def get_order():
    name = random.choice(list(SANDWICHES.keys()))
    return jsonify({"name": name, "stack": SANDWICHES[name]})

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json
    user_stack = data.get('stack')
    target_name = data.get('target_name')
    
    correct_stack = SANDWICHES.get(target_name)
    
    if user_stack == correct_stack:
        return jsonify({"message": "ORDER SERVED PERFECTLY!", "points": 10})
    else:
        return jsonify({"message": "ORDER INCORRECT. Try again!", "points": 0})

if __name__ == '__main__':
    # Render and other cloud platforms provide a PORT environment variable.
    # We use that port if available, otherwise default to 5000 for local dev.
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)