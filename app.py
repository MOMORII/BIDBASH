# This app.py file is the main entry point for the Flask application. It sets up the Flask app, configures it, and defines the routes and views for the web application. The file also includes any necessary imports and initializes any required extensions or modules
# Currently, we will be using a minimal starter to get the project deployed.
# Updated as of 2026-09-10

from pathlib import Path
import sqlite3

from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="frontend", static_url_path="")

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "bidbash.db"


def get_db():
    DB_PATH.parent.mkdir(exist_ok=True)

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row

    return connection


def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS listings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)


@app.get("/")
def home():
    return send_from_directory("frontend", "index.html")


@app.get("/api/status")
def status():
    return jsonify({
        "message": "BIDBASH backend is running"
    })


@app.get("/api/listings")
def get_listings():
    with get_db() as db:
        rows = db.execute("""
            SELECT id, title, created_at
            FROM listings
            ORDER BY id DESC
        """).fetchall()

    return jsonify([dict(row) for row in rows])


@app.post("/api/listings")
def create_listing():
    data = request.get_json()

    title = data.get("title", "").strip()

    if not title:
        return jsonify({
            "error": "Listing title is required"
        }), 400

    with get_db() as db:
        cursor = db.execute(
            "INSERT INTO listings (title) VALUES (?)",
            (title,)
        )

        listing_id = cursor.lastrowid

    return jsonify({
        "id": listing_id,
        "title": title
    }), 201


if __name__ == "__main__":
    init_db()
    app.run(debug=True)