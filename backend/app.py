import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static', template_folder='templates')

# Настройки
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm', 'mov', 'wav', 'mp3', 'ogg'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Создаём папку для файлов
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/send', methods=['POST'])
def upload_data():
    # Поля формы
    first_name = request.form.get('firstName', '').strip()
    last_name = request.form.get('lastName', '').strip()
    phone = request.form.get('phone', '').strip()
    text_message = request.form.get('textMessage', '').strip()

    # Проверка: хотя бы одно поле
    has_text = bool(text_message)
    has_name_or_phone = bool(first_name or last_name or phone)

    # Файлы
    files = request.files.getlist('files')
    saved_files = []

    # Сохраняем файлы
    for file in files:
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Чтобы избежать перезаписи, добавим временную метку
            import time
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{int(time.time())}{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            saved_files.append(filename)

    # Проверка: хотя бы что-то заполнено
    if not (has_text or has_name_or_phone or saved_files):
        return jsonify({'error': 'Заполните хотя бы одно поле или добавьте файл'}), 400

    # Лог в консоль
    print(f"Получено: {first_name} {last_name}, Телефон: {phone}")
    print(f"Текст: {text_message}")
    print(f"Файлы: {saved_files}")

    return jsonify({'message': 'Данные успешно получены', 'files': saved_files}), 200

# Раздаём статику
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)