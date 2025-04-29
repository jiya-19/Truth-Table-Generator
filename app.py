from flask import Flask, request, jsonify
import itertools
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

# Function to evaluate logical expressions
def evaluate_expression(expression, local_context):
    # Replace logical operators with Python equivalents
    expression = expression.replace('¬', ' not ')
    expression = expression.replace('∧', ' and ')
    expression = expression.replace('∨', ' or ')
    expression = expression.replace('→', ' <= ')
    expression = expression.replace('↔', ' == ')
    expression = expression.replace('⊼', ' not (')
    expression = expression.replace('⊽', ' not (')
    expression = expression.replace('⇹', ' != ')

    # Evaluate the expression
    try:
        result = eval(expression, {}, local_context)
        return result
    except Exception as e:
        return str(e)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    expression = data.get('expression', '')

    # Validate the expression (basic validation)
    if not expression:
        return jsonify({"error": "No expression provided."}), 400

    # Extract variables from the expression
    variables = sorted(set(filter(str.isalpha, expression)))
    num_vars = len(variables)

    # Generate all combinations of truth values
    combinations = list(itertools.product([True, False], repeat=num_vars))
    
    # Evaluate the expression for each combination
    rows = []
    for combination in combinations:
        # Create a local context for evaluation
        local_context = dict(zip(variables, combination))
        # Evaluate the expression
        try:
            result = evaluate_expression(expression, local_context)
            rows.append(list(combination) + [result])
        except Exception as e:
            return jsonify({"error": str(e)})

    headers = variables + ['Result']
    return jsonify({"headers": headers, "rows": rows})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render sets the PORT env variable
    app.run(host='0.0.0.0', port=port)