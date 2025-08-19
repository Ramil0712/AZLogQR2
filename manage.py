"""
Утилита для запуска проекта
Использование: python manage.py
"""

import os
import subprocess
import sys

def create_venv():
    print("🔧 Создаём виртуальное окружение...")
    subprocess.check_call([sys.executable, '-m', 'venv', 'venv'])
    print("✅ Виртуальное окружение создано: venv/")

def install_deps():
    print("📦 Устанавливаем зависимости...")
    if os.name == 'nt':  # Windows
        pip = 'venv\\Scripts\\pip'
        python = 'venv\\Scripts\\python'
    else:  # Mac/Linux
        pip = 'venv/bin/pip'
        python = 'venv/bin/python'

    subprocess.check_call([pip, 'install', '-r', 'backend/requirements.txt'])
    print("✅ Зависимости установлены")

def run_server():
    print("🚀 Запускаем сервер...")
    if os.name == 'nt':
        python = 'venv\\Scripts\\python'
    else:
        python = 'venv/bin/python'

    os.chdir('backend')
    subprocess.call([python, 'app.py'])

def main():
    if not os.path.exists('venv'):
        create_venv()
        install_deps()

    run_server()

if __name__ == '__main__':
    main()