// === Языки ===
const translations = {
    az: {
        title: "Mesajınızı göndərin",
        labelFirstName: "Ad",
        labelLastName: "Soyad",
        labelPhone: "Telefon",
        labelTextMessage: "Mesaj",
        placeholderFirstName: "Adınızı daxil edin",
        placeholderLastName: "Soyadınızı daxil edin",
        placeholderPhone: "Telefon nömrənizi daxil edin",
        placeholderText: "Mətn daxil edin...",
        addFileBtn: "➕ Fayl əlavə et",
        takePhoto: "Foto çək",
        selectPhoto: "Qalereyadan seç",
        recordVideo: "Video çək",
        selectVideo: "Videofayl seç",
        recordAudio: "Səs yaz",
        selectAudio: "Səs faylı seç",
        dropZoneText: "Faylları buraya atın",
        dropZoneHint: "(şəkil, video, səs)",
        submitBtn: "Göndər",
        status: "✅ Mesaj göndərildi!",
        error: "Xəta: Ən azı bir sahə doldurulmalıdır!",
        themeLight: "☀️ Açiq tema",
        themeDark: "🌙 Tünd tema"
    },
    en: {
        title: "Send Your Message",
        labelFirstName: "First Name",
        labelLastName: "Last Name",
        labelPhone: "Phone",
        labelTextMessage: "Message",
        placeholderFirstName: "Enter your first name",
        placeholderLastName: "Enter your last name",
        placeholderPhone: "Enter your phone number",
        placeholderText: "Enter text...",
        addFileBtn: "➕ Add File",
        takePhoto: "Take Photo",
        selectPhoto: "Select from Gallery",
        recordVideo: "Record Video",
        selectVideo: "Select Video",
        recordAudio: "Record Audio",
        selectAudio: "Select Audio",
        dropZoneText: "Drop files here",
        dropZoneHint: "(photos, videos, audio)",
        submitBtn: "Send",
        status: "✅ Message sent!",
        error: "Error: Fill at least one field!",
        themeLight: "☀️ Light theme",
        themeDark: "🌙 Dark theme"
    }
};

// === Переменные ===
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const langSwitcher = document.getElementById('langSwitcher');
const flags = document.querySelectorAll('.flag');

// === Переключатель языка с флагами ===
function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Обновляем тексты
    document.getElementById('title').textContent = t.title;
    document.getElementById('labelFirstName').textContent = t.labelFirstName;
    document.getElementById('labelLastName').textContent = t.labelLastName;
    document.getElementById('labelPhone').textContent = t.labelPhone;
    document.getElementById('labelTextMessage').textContent = t.labelTextMessage;
    document.getElementById('addFileBtn').textContent = t.addFileBtn;
    document.getElementById('submitBtn').textContent = t.submitBtn;
    document.getElementById('status').textContent = t.status;
    document.getElementById('dropZoneText').textContent = t.dropZoneText;
    document.getElementById('dropZoneHint').textContent = t.dropZoneHint;

    // Placeholders
    document.getElementById('firstName').placeholder = t.placeholderFirstName;
    document.getElementById('lastName').placeholder = t.placeholderLastName;
    document.getElementById('phone').placeholder = t.placeholderPhone;
    document.getElementById('textMessage').placeholder = t.placeholderText;

    // Меню
    document.querySelectorAll('.menu-text').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) el.textContent = t[key];
    });

    // Обновляем активный флаг
    flags.forEach(flag => {
        flag.classList.toggle('active', flag.dataset.lang === lang);
    });

    // ✅ Обновляем текст кнопки темы в зависимости от языка и текущей темы
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const t = translations[currentLang];
    themeToggle.textContent = currentTheme === 'dark' ? t.themeLight : t.themeDark;
}

// Клик по флагу
flags.forEach(flag => {
    flag.addEventListener('click', () => {
        const lang = flag.dataset.lang;
        if (currentLang === lang) return;

        currentLang = lang;
        setLanguage(currentLang);
        localStorage.setItem('lang', currentLang);
    });
});

// === Переключение темы ===
themeToggle.addEventListener('click', () => {
    currentTheme = body.classList.toggle('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    // ✅ Обновляем текст с учётом языка
    updateThemeButtonText();
});

// === Инициализация при загрузке ===
window.onload = () => {
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
    }
    setLanguage(currentLang);
};

// === Выпадающее меню ===
const addFileBtn = document.getElementById('addFileBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

addFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
        dropdownMenu.classList.remove('show');
    }
});

// === Обработка выбора из меню ===
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        dropdownMenu.classList.remove('show');

        const inputMap = {
            'capture-photo': 'photoCapture',
            'select-photo': 'photoSelect',
            'record-video': 'videoRecord',
            'select-video': 'videoSelect',
            'record-audio': 'audioRecord',
            'select-audio': 'audioSelect'
        };

        if (inputMap[action]) {
            const input = document.getElementById(inputMap[action]);
            input.onchange = null;
            input.onchange = () => {
                if (input.files.length) {
                    Array.from(input.files).forEach(addFileToPreview);
                }
            };
            input.click();
        }
    });
});

// === Drag & Drop ===
const dropZone = document.getElementById('dropZone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => e.preventDefault());
    document.body.addEventListener(eventName, e => e.preventDefault());
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('dragover');
    });
});

dropZone.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    if (files.length) {
        Array.from(files).forEach(addFileToPreview);
    }
});

// === Превью файлов ===
function addFileToPreview(file) {
    if (!file) return;
    const item = document.createElement('div');
    const url = URL.createObjectURL(file);
    const type = file.type.split('/')[0];

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = url;
        item.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        item.appendChild(video);
    } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
        item.appendChild(audio);
    }

    document.getElementById('filePreview').appendChild(item);
}

// === Отправка формы ===
document.getElementById('messageForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';

    const formData = new FormData();

    formData.append('firstName', document.getElementById('firstName').value.trim());
    formData.append('lastName', document.getElementById('lastName').value.trim());
    formData.append('phone', document.getElementById('phone').value.trim());
    formData.append('textMessage', document.getElementById('textMessage').value.trim());

    // Собираем файлы
    const files = [];
    document.querySelectorAll('.file-inputs input[type="file"]').forEach(input => {
        if (input.files.length) {
            Array.from(input.files).forEach(file => files.push(file));
        }
    });
    files.forEach(file => formData.append('files', file));

    // Проверка
    const hasText = formData.get('textMessage').length > 0;
    const hasNameOrPhone = formData.get('firstName') || formData.get('lastName') || formData.get('phone');
    if (!hasText && !hasNameOrPhone && files.length === 0) {
        errorDiv.textContent = currentLang === 'az'
            ? 'Xəta: Ən azı bir sahə doldurulmalıdır!'
            : 'Error: Fill at least one field!';
        return;
    }

    try {
        const res = await fetch('/api/send', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('status').style.display = 'block';
            setTimeout(() => {
                document.getElementById('status').style.display = 'none';
            }, 3000);

            this.reset();
            document.getElementById('filePreview').innerHTML = '';
        } else {
            errorDiv.textContent = data.error || 'Server error';
        }
    } catch (err) {
        errorDiv.textContent = currentLang === 'az'
            ? 'Serverə qoşulmaqda xəta'
            : 'Connection error';
    }
});