# Proyecto Completo - Backend NestJS + Frontend Angular + API Python

## Integrantes
| Código de estudiante | Apellidos y Nombres                |
|----------------------|----------------------------------|
| 0202314008           | Boyer Espinola Antony Gabriel    |
| 0202214006           | Corales Samame Santos Dilver     |
| 0201914060           | Angeles Osorio Denilson Fabrisio |
| 0202014031           | Castillo Vasquez Sebastian Raul  |

---

## Descripción del proyecto

Este repositorio contiene una aplicación completa que incluye:

- **Backend** desarrollado con **NestJS v11.0.7**.
- **Frontend** desarrollado con **Angular v17.3.11**.
- Una API adicional desarrollada en **Python 3.10.13** con Flask.

Cada proyecto dentro del repositorio cuenta con su propio **Dockerfile** para construcción y despliegue independiente.

---

## Configuración

Para que los servicios funcionen correctamente, es necesario configurar las variables de entorno correspondientes:

- En el backend de **NestJS**:  
  `DATABASE_URL` — Cadena de conexión a la base de datos.

- En la API de **Python (Flask)**:  
  `DB_URI` — Cadena de conexión a la base de datos.

---

## Construcción con Docker

Para construir cada servicio se debe usar el Dockerfile que se encuentra en la carpeta de cada proyecto. Por ejemplo:

```bash
# Para NestJS
docker build -t nest-backend ./backend

# Para Angular
docker build -t angular-frontend ./frontend

# Para Python Flask
docker build -t python-api ./python-api
