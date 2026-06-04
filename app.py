from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

RECIPES = {
    "Burger": ["Bun Top", "Cheese", "Beef", "Tomato", "Lettuce", "Bun Bottom"],
    "Bologna Sandwich": ["Bread Top", "Mayo", "Bologna", "Cheese", "Lettuce", "Bread Bottom"],
    "PB&J": ["Bread Top", "Peanut Butter", "Jelly", "Bread Bottom"]
}

@app.route('/')
def index(): return render_template('index.html')

@app.route('/get_order')
def get_order():
    name = random.choice(list(RECIPES.keys()))
    return jsonify({"name": name, "stack": RECIPES[name]})

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json
    user_s, target_s = data['stack'], RECIPES[data['target_name']]
    
    points = 0
    for i, item in enumerate(user_s):
        if i < len(target_s) and item == target_s[i]:
            points += 5
        elif item in target_s:
            points += 2

    is_perfect = user_s == target_s
    msg = "✅ Perfect!" if is_perfect else ("Almost correct!" if points > 0 else "❌ Try again!")
    
    return jsonify({"points": points, "message": msg, "status": "SUCCESS" if is_perfect else "FAIL"})

if __name__ == '__main__':
    app.run(debug=True)