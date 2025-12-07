import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from query_generator import generate_graphql_query

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/llm/query', methods=['POST'])
def process_query():
    try:
        data = request.json
        natural_language_query = data.get('query', '')
        
        if not natural_language_query:
            return jsonify({'error': 'No query provided'}), 400
        
        graphql_query = generate_graphql_query(natural_language_query)
        
        return jsonify({
            'success': True,
            'graphql_query': graphql_query,
            'original_query': natural_language_query
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/llm/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'LLM Query Generator'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'LLM Service starting on port {port}...')
    app.run(host='0.0.0.0', port=port, debug=True)

