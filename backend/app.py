import os
from flask import Flask, request, jsonify, render_template, redirect, url_for, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, GuestbookEntry

load_dotenv()

# The template_folder and static_folder are set to point to root-level directories
# which we will create later for the traditional frontend.
app = Flask(__name__, static_folder='../frontend-vanilla', template_folder='../templates')

# Allow CORS for API routes to be accessed by the React frontend
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# --- Database Configuration ---
# It will use the DATABASE_URL from the .env file.
# As a fallback, it uses a local SQLite database for easier local testing.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///guestbook.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# --- API Routes ---
@app.route('/api/entries', methods=['GET'])
def get_entries():
    """API endpoint to get all guestbook entries."""
    entries = GuestbookEntry.query.order_by(GuestbookEntry.timestamp.desc()).all()
    return jsonify([entry.to_dict() for entry in entries])

@app.route('/api/entries', methods=['POST'])
def add_entry():
    """API endpoint to add a new guestbook entry."""
    data = request.get_json()
    if not data or not 'name' in data or not 'message' in data:
        return jsonify({'error': 'Name and message are required'}), 400
    
    new_entry = GuestbookEntry(name=data['name'], message=data['message'])
    db.session.add(new_entry)
    db.session.commit()
    
    return jsonify(new_entry.to_dict()), 201

# --- New API Routes for Deletion ---
@app.route('/api/entries', methods=['DELETE'])
def delete_all_entries():
    """API endpoint to delete all guestbook entries."""
    try:
        num_deleted = GuestbookEntry.query.delete()
        db.session.commit()
        return jsonify({'message': f'{num_deleted} entries deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """API endpoint to delete a specific guestbook entry by ID."""
    entry = GuestbookEntry.query.get(entry_id)
    if not entry:
        return jsonify({'error': 'Entry not found'}), 404
    
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Entry deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



# --- Traditional Frontend Route ---
@app.route('/')
def index():
    """Serves the vanilla JS frontend."""
    return send_from_directory(app.static_folder, 'index.html')

# A command to initialize the database
@app.cli.command("init-db")
def init_db_command():
    """Creates the database tables."""
    db.create_all()
    print("Initialized the database.")

if __name__ == '__main__':
    # Note: For production, use a proper WSGI server like Gunicorn or Waitress.
    # The db.create_all() call is removed from here to be handled by the 'flask init-db' command.
    app.run(debug=True, port=5001) # Using port 5001 to avoid conflict with React's default 5173
