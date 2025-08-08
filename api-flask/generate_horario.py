import random
from models import Curso, Profesor, Laboratorio

# ----------------------------
# Funciones de Algoritmo Genético
# ----------------------------

def generar_horario():
    """
    Genera un horario óptimo usando un algoritmo genético.
    El horario evita choques de profesores y laboratorios, 
    respeta disponibilidad y busca compatibilidad software–curso.
    """

    # ==========================
    # 1. Preparar datos base
    # ==========================
    cursos = Curso.query.all()
    profesores = {p.id: p for p in Profesor.query.all()}
    laboratorios = Laboratorio.query.all()

    # Disponibilidad en dict
    disponibilidad_prof = {
        p.id: [tuple(d.split('-')) for d in p.disponibilidad.split(',')]
        for p in profesores.values()
    }

    # Posibles franjas: unimos todas las disponibilidades de todos
    franjas_posibles = list({
        franja for disp in disponibilidad_prof.values() for franja in disp
    })

    # ==========================
    # 2. Parámetros del GA
    # ==========================
    POP_SIZE = 50         # Tamaño de población
    GENERACIONES = 100    # Iteraciones
    MUTACION_RATE = 0.1   # Probabilidad de mutar

    # ==========================
    # 3. Generar población inicial
    # ==========================
    def crear_individuo():
        """
        Un individuo es una lista de asignaciones:
        [ (curso_id, dia, hora, lab_id) , ... ]
        """
        horario = []
        for curso in cursos:
            # Filtrar labs válidos para este curso
            labs_validos = [
                lab for lab in laboratorios
                if curso.software_requerido in lab.software.split(';')
                and lab.capacidad >= curso.total_alumnos
            ]
            if not labs_validos:
                continue

            dia, hora = random.choice(franjas_posibles)
            lab = random.choice(labs_validos)
            horario.append((curso.id, dia, hora, lab.id))
        return horario

    poblacion = [crear_individuo() for _ in range(POP_SIZE)]

    # ==========================
    # 4. Función de fitness
    # ==========================
    def fitness(individuo):
        """
        Evalúa la calidad de un horario.
        Puntaje alto = horario mejor.
        """
        score = 0
        ocupacion_prof = {}
        ocupacion_lab = {}

        for curso_id, dia, hora, lab_id in individuo:
            curso = next(c for c in cursos if c.id == curso_id)
            profesor_id = curso.profesor_id

            # --- Penalizar choques de profesor ---
            if (profesor_id, dia, hora) in ocupacion_prof:
                score -= 50  # choque grave
            else:
                ocupacion_prof[(profesor_id, dia, hora)] = True

            # --- Penalizar choques de laboratorio ---
            if (lab_id, dia, hora) in ocupacion_lab:
                score -= 20
            else:
                ocupacion_lab[(lab_id, dia, hora)] = True

            # --- Disponibilidad del profesor ---
            if (dia, hora) in disponibilidad_prof.get(profesor_id, []):
                score += 10  # premia disponibilidad correcta
            else:
                score -= 15  # penaliza si el profe no puede

            # --- Compatibilidad software ---
            lab = next(l for l in laboratorios if l.id == lab_id)
            if curso.software_requerido in lab.software.split(';'):
                score += 5

        return score

    # ==========================
    # 5. Selección por torneo
    # ==========================
    def seleccionar(poblacion):
        torneo = random.sample(poblacion, 3)
        return max(torneo, key=fitness)

    # ==========================
    # 6. Cruce de un punto
    # ==========================
    def cruzar(padre1, padre2):
        punto = random.randint(1, len(padre1) - 1)
        hijo = padre1[:punto] + padre2[punto:]
        return hijo

    # ==========================
    # 7. Mutación
    # ==========================
    def mutar(individuo):
        if random.random() < MUTACION_RATE:
            idx = random.randint(0, len(individuo) - 1)
            curso_id, _, _, _ = individuo[idx]
            labs_validos = [
                lab for lab in laboratorios
                if next(c for c in cursos if c.id == curso_id).software_requerido in lab.software.split(';')
            ]
            nuevo_dia, nuevo_hora = random.choice(franjas_posibles)
            nuevo_lab = random.choice(labs_validos)
            individuo[idx] = (curso_id, nuevo_dia, nuevo_hora, nuevo_lab.id)
        return individuo

    # ==========================
    # 8. Evolución
    # ==========================
    for _ in range(GENERACIONES):
        nueva_poblacion = []
        for _ in range(POP_SIZE):
            padre1 = seleccionar(poblacion)
            padre2 = seleccionar(poblacion)
            hijo = cruzar(padre1, padre2)
            hijo = mutar(hijo)
            nueva_poblacion.append(hijo)
        poblacion = nueva_poblacion

    # ==========================
    # 9. Mejor individuo final
    # ==========================
    mejor = max(poblacion, key=fitness)

    # ==========================
    # 10. Convertir a formato JSON
    # ==========================
    resultado = []
    for curso_id, dia, hora, lab_id in mejor:
        curso = next(c for c in cursos if c.id == curso_id)
        resultado.append({
            'curso': curso.nombre,
            'profesor': profesores[curso.profesor_id].nombre,
            'dia': dia,
            'hora': hora,
            'laboratorio': next(l for l in laboratorios if l.id == lab_id).nombre
        })

    return resultado
