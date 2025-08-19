from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

app = Flask(__name__, static_folder='../frontend', template_folder='../frontend')

# Настройки
UPLOAD_FOLDER = 'backend/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm', 'mov', 'wav', 'mp3', 'ogg'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/send', methods=['POST'])
def upload_data():
    first_name = request.form.get('firstName', '').strip()
    last_name = request.form.get('lastName', '').strip()
    phone = request.form.get('phone', '').strip()
    text_message = request.form.get('textMessage', '').strip()

    has_text = bool(text_message)
    has_name_or_phone = bool(first_name or last_name or phone)

    files = request.files.getlist('files')
    saved_files = []

    for file in files:
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            import time
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{int(time.time())}{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            saved_files.append(filename)

    if not (has_text or has_name_or_phone or saved_files):
        return jsonify({'error': 'Fill at least one field or add a file'}), 400

    print(f"Received: {first_name} {last_name}, Phone: {phone}")
    print(f"Message: {text_message}")
    print(f"Files: {saved_files}")

    return jsonify({'message': 'Data received', 'files': saved_files}), 200

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

# Раздаём статику
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)