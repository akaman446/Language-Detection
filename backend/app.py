from flask import Flask, request, jsonify
from flask_cors import CORS
from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException
import pycountry

app = Flask(__name__)
CORS(app)

# Set seed for consistent results
DetectorFactory.seed = 0

def get_language_name(lang_code):
    try:
        return pycountry.languages.get(alpha_2=lang_code).name
    except AttributeError:
        return lang_code

@app.route('/api/detect-language', methods=['POST'])
def detect_language():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        lang_code = detect(text)
        language_name = get_language_name(lang_code)
        return jsonify({
            'language_code': lang_code,
            'language_name': language_name
        })
    except LangDetectException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)