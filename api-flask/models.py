from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Profesor(db.Model):
    __tablename__ = 'profesores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    disponibilidad = db.Column(db.Text)  # Ej: "Lunes-08:00,Martes-10:00"
    cursos = relationship("Curso", back_populates="profesor")

class Curso(db.Model):
    __tablename__ = 'cursos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    profesor_id = db.Column(db.Integer, ForeignKey('profesores.id'))
    software_requerido = db.Column(db.String(100))
    peso = db.Column(db.Integer)
    total_alumnos = db.Column(db.Integer)
    prerequisito_id = db.Column(db.Integer, ForeignKey('cursos.id'))
    profesor = relationship("Profesor", back_populates="cursos")

class Laboratorio(db.Model):
    __tablename__ = 'laboratorios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    capacidad = db.Column(db.Integer)
    software = db.Column(db.Text)
