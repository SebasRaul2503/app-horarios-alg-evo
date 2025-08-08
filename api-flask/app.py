from flask import Flask, jsonify
from models import db
from generate_horario import generar_horario
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Cargar variables de entorno
load_dotenv()


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DB_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/horario-optimo', methods=['GET'])
def horario_optimo():
    horario = generar_horario()
    return jsonify(horario)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
