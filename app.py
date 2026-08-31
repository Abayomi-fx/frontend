import os
import uuid
from io import BytesIO

from flask import Flask, render_template, request, redirect, url_for, abort
from flask_sqlalchemy import SQLAlchemy
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Upload configuration
UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'}
MAX_CONTENT_LENGTH = 20 * 1024 * 1024  # 20 MB hard limit on incoming uploads
WEBP_QUALITY = 80   # 0-100; 80 gives excellent visual quality at ~10x smaller than raw JPEG
JPEG_QUALITY = 82   # fallback JPEG quality
MAX_DIMENSION = 1920  # downscale if either dimension exceeds this

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

db = SQLAlchemy(app)


# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------

class Task(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(100))
    description = db.Column(db.String(200))
    # Stores the base filename without extension, e.g. "abc123"
    image_name  = db.Column(db.String(200), nullable=True)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def allowed_file(filename: str) -> bool:
    return (
        '.' in filename
        and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def _resize(img: Image.Image) -> Image.Image:
    """Downscale image so neither dimension exceeds MAX_DIMENSION."""
    w, h = img.size
    if w > MAX_DIMENSION or h > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
    return img


def save_compressed_images(file_storage) -> str:
    """
    Accept a Werkzeug FileStorage object, compress it and save both a WebP
    and a JPEG fallback into static/uploads.

    Returns the base filename (without extension) so both variants can be
    reconstructed later as ``<base>.webp`` and ``<base>.jpg``.
    """
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    base_name = uuid.uuid4().hex  # collision-safe, filesystem-safe

    # Read into Pillow
    img = Image.open(file_storage.stream)

    # Normalise colour mode (RGBA / palette images can't be saved as JPEG)
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGBA')
    else:
        img = img.convert('RGB')

    img = _resize(img)

    # --- Save WebP ---
    webp_path = os.path.join(UPLOAD_FOLDER, f'{base_name}.webp')
    webp_img = img if img.mode == 'RGB' else img  # RGBA is fine for WebP
    webp_img.save(webp_path, format='WEBP', quality=WEBP_QUALITY, method=4)

    # --- Save JPEG fallback (must be RGB) ---
    jpg_path = os.path.join(UPLOAD_FOLDER, f'{base_name}.jpg')
    rgb_img = img.convert('RGB')  # drop alpha if present
    rgb_img.save(jpg_path, format='JPEG', quality=JPEG_QUALITY, optimize=True)

    return base_name


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route('/')
def index():
    tasks = Task.query.all()
    return render_template('index.html', tasks=tasks)


@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        title       = request.form['title']
        description = request.form['description']
        image_name  = None

        file = request.files.get('image')
        if file and file.filename and allowed_file(file.filename):
            image_name = save_compressed_images(file)

        new_task = Task(title=title, description=description, image_name=image_name)
        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for('index'))

    return render_template('add.html')


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    task = Task.query.get_or_404(id)

    if request.method == 'POST':
        task.title       = request.form['title']
        task.description = request.form['description']

        file = request.files.get('image')
        if file and file.filename and allowed_file(file.filename):
            # Remove old images if they exist
            if task.image_name:
                for ext in ('webp', 'jpg'):
                    old = os.path.join(UPLOAD_FOLDER, f'{task.image_name}.{ext}')
                    if os.path.exists(old):
                        os.remove(old)
            task.image_name = save_compressed_images(file)

        db.session.commit()
        return redirect(url_for('index'))

    return render_template('edit.html', task=task)


@app.route('/delete/<int:id>')
def delete(id):
    task = Task.query.get_or_404(id)

    # Clean up image files
    if task.image_name:
        for ext in ('webp', 'jpg'):
            path = os.path.join(UPLOAD_FOLDER, f'{task.image_name}.{ext}')
            if os.path.exists(path):
                os.remove(path)

    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('index'))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
