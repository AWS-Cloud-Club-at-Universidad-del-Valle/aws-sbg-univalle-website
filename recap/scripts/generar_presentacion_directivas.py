"""Presentación para directivas de Univalle sobre la plantilla del Kick off de Cloud Quest.

Uso:
    python generar_presentacion_directivas.py <base.pptx> <salida.pptx>

<base.pptx> es la plantilla ya reordenada (15 diapositivas). Este script solo
reemplaza textos conservando el formato de la plantilla, cambia el QR y agrega
las notas del orador. Las cifras salen de recap/metricas.json.
"""

import io
import json
import sys
from pathlib import Path

import qrcode
from pptx import Presentation
from pptx.util import Pt

RAIZ = Path(__file__).resolve().parents[1]
M = json.loads((RAIZ / "metricas.json").read_text(encoding="utf-8"))
MEETUP = "https://www.meetup.com/aws-sbg-at-university-of-the-valle/"


def num(v, dec=0):
    s = f"{v:,.{dec}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


ev = M["eventos"]
com = M["comunidad"]
reto = M["reto_cloud_practitioner"]
cmp = M["comparacion_sbg_colombia"]
TULUA = ev["por_sede"]["Tuluá · Univalle Villa Campestre"]["eventos"] + ev["por_sede"]["Tuluá · Escuela de Policía"]["eventos"]
MIEMBROS = num(com["miembros_meetup"]["valor"])
CALIF = num(com["calificacion_meetup"]["valor"], 2)


def poner(shape, textos):
    """Reemplaza el texto de cada párrafo conservando el formato de su primer run."""
    pars = shape.text_frame.paragraphs
    con_texto = [p for p in pars if p.runs]
    if len(con_texto) != len(textos):
        raise ValueError(f"{shape.name}: {len(con_texto)} párrafos con texto, se pasaron {len(textos)}")
    for p, t in zip(con_texto, textos):
        p.runs[0].text = t
        for r in p.runs[1:]:
            r._r.getparent().remove(r._r)


def tam(shape, par, puntos):
    for r in [p for p in shape.text_frame.paragraphs if p.runs][par].runs:
        r.font.size = Pt(puntos)


def notas(slide, texto):
    slide.notes_slide.notes_text_frame.text = texto


def grid6(s, titulo, tarjetas):
    """Diapositiva de 6 tarjetas (índices de forma 0, 4, 8, 12, 16, 20, 24)."""
    poner(s.shapes[0], titulo)
    for idx, (t, d) in zip([4, 8, 12, 16, 20, 24], tarjetas):
        poner(s.shapes[idx], [t, d])


def main(base, salida):
    prs = Presentation(base)
    S = prs.slides

    # 1. Portada
    s = S[0]
    poner(s.shapes[0], ["INFORME A DIRECTIVAS · NOVIEMBRE 2026", "AWS Student Builder Group", "Universidad del Valle"])
    tam(s.shapes[0], 1, 34)
    tam(s.shapes[0], 2, 34)
    poner(s.shapes[1], ["Un año de resultados: noviembre 2025 – noviembre 2026", "Dirección de Sede y Coordinación de Programa"])
    poner(s.shapes[2], ["AWS SBG · Univalle"])
    notas(s, "Buenos días. Gracias por el espacio. Venimos a contarles en pocos minutos el primer año del AWS Student Builder Group de la Universidad del Valle: qué hicimos, con qué resultados y qué necesitamos para el cierre del año. Todas las cifras son públicas y tienen corte al 3 de noviembre de 2026.")

    # 2. Frase central
    s = S[1]
    poner(s.shapes[0], [
        "EN UNA FRASE",
        "De Cali a Tuluá, y de Tuluá a Las Vegas.",
        f"Somos el primer AWS Student Builder Group del Valle del Cauca. Este año, {TULUA} de nuestros {ev['presenciales']} eventos presenciales se hicieron en la sede Tuluá, y nuestro líder viaja a AWS re:Invent con beca.",
    ])
    notas(s, f"Esta frase resume el año. El grupo nació en Cali con el aval de AWS en noviembre de 2025. La mayor parte de la actividad presencial ocurrió en Tuluá: {TULUA} de {ev['presenciales']} eventos. Y el año cierra con Juan Manuel Hoyos, nuestro líder, en AWS re:Invent en Las Vegas, con beca completa.")

    # 3. Línea de tiempo
    s = S[2]
    poner(s.shapes[0], ["LÍNEA DE TIEMPO", "Del aval de AWS a re:Invent"])
    for idx, (t, d) in zip([4, 8, 12, 16], [
        ("Nov 2025 · Aval", "AWS aprueba el grupo: el primer SBG del Valle del Cauca."),
        ("28 feb · Lanzamiento", "«Tu Primer Paso en la Nube», virtual, con 96 confirmaciones."),
        ("May–jul · Tuluá", "Primeros eventos presenciales en Tuluá y Meléndez; ponentes en el AWS Summit Bogotá."),
        ("Sep–oct · Certificación", "Reto Cloud Practitioner de 8 sesiones y AWS Cloud Quest con 4 universidades."),
    ]):
        poner(s.shapes[idx], [t, d])
    notas(s, "En noviembre de 2025 AWS aprobó el grupo. El lanzamiento oficial fue el 28 de febrero. Entre mayo y julio llegamos de forma presencial a Tuluá y a Meléndez, y fuimos ponentes invitados por AWS en el AWS Summit Bogotá. En septiembre y octubre, el periodo más intenso con 20 eventos, corrimos el reto de certificación y lanzamos Cloud Quest con cuatro universidades de la región.")

    # 4. Cifras
    s = S[3]
    grid6(s, ["EN CIFRAS · CORTE 3 NOV 2026", "Un año construyendo en comunidad"], [
        (f"{MIEMBROS} miembros", "Comunidad en Meetup, abierta a estudiantes de todas las sedes."),
        (f"{ev['total']} eventos", f"{ev['presenciales']} presenciales y {ev['virtuales']} virtuales: uno por semana desde el lanzamiento."),
        (f"{TULUA} de {ev['presenciales']} en Tuluá", "Eventos presenciales en Villa Campestre y en la Escuela de Policía."),
        ("Más de 900", "Estudiantes impactados en todas las sedes (Agencia de Noticias)."),
        (f"{CALIF} / 5", f"Calificación de los eventos en Meetup, con {com['calificacion_meetup']['valoraciones']} valoraciones."),
        ("Más de 20", "Vouchers de certificación entregados (dato del equipo)."),
    ])
    for idx in [4, 8, 12, 16, 20, 24]:
        tam(s.shapes[idx], 0, 22)
    notas(s, f"Seis cifras. {MIEMBROS} miembros en Meetup y {ev['total']} eventos, {ev['presenciales']} presenciales. {TULUA} de los presenciales fueron en Tuluá. La Agencia de Noticias de la universidad reportó más de 900 estudiantes impactados en todas las sedes. Los eventos tienen {CALIF} sobre 5. Y entregamos más de 20 vouchers de certificación; ese último dato es del equipo y no tiene todavía una fuente pública. Aclaración: en Meetup también hay {num(ev['confirmaciones_total'])} confirmaciones, pero son RSVP, no asistencia real.")

    # 5. Separador
    s = S[4]
    poner(s.shapes[0], ["IMPACTO", "Lo que logramos en la región"])
    notas(s, "Ahora, el impacto con más detalle.")

    # 6. Tuluá
    s = S[5]
    poner(s.shapes[0], ["LA SEDE TULUÁ", f"{TULUA} de {ev['presenciales']} eventos presenciales"])
    cuerpo = [p for p in s.shapes[1].text_frame.paragraphs if p.runs]
    textos = [
        "La actividad presencial del grupo está en la sede regional: 14 eventos en Villa Campestre y 2 en la Escuela de Policía Simón Bolívar.",
        "Allí se hicieron el reto de certificación de 8 semanas, los workshops de IAM y Amazon Quick, y charlas de serverless, datos y DevOps.",
        "La nube no es solo para la sede principal.",
    ]
    if len(cuerpo) != len(textos):
        raise ValueError(f"Tuluá: {len(cuerpo)} párrafos")
    for p, t in zip(cuerpo, textos):
        p.runs[0].text = t
        for r in p.runs[1:]:
            r._r.getparent().remove(r._r)
    notas(s, "Este es el dato que más nos distingue. De 20 eventos presenciales, 16 se hicieron en Tuluá: 14 en la sede Villa Campestre y 2 en la Escuela de Policía Simón Bolívar. Para la sede esto significa que los estudiantes de Tuluá tuvieron formación en nube de forma constante, sin tener que viajar a Cali.")

    # 7. Reto
    s = S[6]
    poner(s.shapes[0], ["RETO AWS CLOUD PRACTITIONER", "8 sesiones para certificarse, con cupos llenos"])
    poner(s.shapes[3], ["SESIONES", "8", "Presenciales en Tuluá, del 19 de septiembre al 29 de octubre, con el SBG de la UCEVA."])
    poner(s.shapes[6], ["CONVOCATORIA", num(reto["confirmaciones_promedio"], 1), "Confirmaciones promedio por sesión. La sexta sesión igualó a la primera, con 40."])
    poner(s.shapes[9], ["CERTIFICACIÓN", "+20", "Vouchers de examen entregados a estudiantes de Tuluá, Yumbo y otras sedes (dato del equipo)."])
    poner(s.shapes[10], ["+  Confirmaciones de Meetup: RSVP, no asistencia real."])
    notas(s, f"El reto AWS Certified Cloud Practitioner fue un programa de 8 sesiones presenciales en Villa Campestre, organizado con el AWS Student Builder Group de la UCEVA. Los cupos se llenaron desde la primera sesión. El promedio fue de {num(reto['confirmaciones_promedio'], 1)} confirmaciones por sesión, y la convocatoria se sostuvo hasta el final. Además, el equipo entregó más de 20 vouchers para presentar el examen de certificación sin costo.")

    # 8. Qué hicimos
    s = S[7]
    grid6(s, ["QUÉ HICIMOS", f"{ev['total']} eventos, seis líneas de trabajo"], [
        ("Carrera y empleo", "5 charlas sobre CV, LinkedIn y el primer empleo en tecnología."),
        ("IA y datos", "7 eventos: bases de datos para IA, Python y data pipelines."),
        ("Certificación", "El reto de 8 sesiones, más charlas de fundamentos y rutas de certificación."),
        ("Práctica en AWS", "Workshops de IAM, Amazon Quick, contenedores, serverless y CDK."),
        ("Industria en el aula", "Un AWS Hero, un Senior Solutions Architect de AWS y Community Builders."),
        ("Comunidad regional", "Cloud Quest con 4 universidades y eventos con IEEE y el AWS User Group Valle."),
    ])
    notas(s, "Organizamos el trabajo en seis líneas. Las charlas de carrera son las que más convocan en virtual. IA y datos es el tema más frecuente después de la certificación. Hubo práctica real en AWS con workshops. Trajimos a la comunidad a personas de la industria, como el AWS Hero Carlos Zambrano y Germán Ruiz, Senior Solutions Architect de AWS. Y trabajamos con otras universidades de la región.")

    # 9. Alianzas
    s = S[8]
    poner(s.shapes[0], ["ALIANZAS", "Construimos con otros"])
    for idx, (n, t, d) in zip([3, 6, 9, 12], [
        ("01", "UCEVA", "Reto Cloud Practitioner y Cloud Quest"),
        ("02", "Icesi", "Contenedores 101 y Cloud Quest"),
        ("03", "USB", "Cloud Quest Valle del Cauca"),
        ("04", "IEEE", "IEEE Computer Society, CENESIS y AWS UG Valle"),
    ]):
        poner(s.shapes[idx], [n, t, d])
    poner(s.shapes[13], ["También: Escuela de Policía Simón Bolívar (Tuluá) y la red de SBG de Colombia en el AWS Student Community Day."])
    notas(s, "Nada de esto fue en solitario. Con el SBG de la UCEVA hicimos el reto y Cloud Quest. Con Icesi y San Buenaventura, Cloud Quest Valle del Cauca. Con IEEE Computer Society, CENESIS y el AWS User Group Valle del Cauca, un evento en Meléndez. Y la Escuela de Policía de Tuluá nos abrió sus puertas para dos charlas.")

    # 10. Reconocimientos
    s = S[9]
    poner(s.shapes[0], ["RECONOCIMIENTOS", "El trabajo de la comunidad se ve afuera"])
    poner(s.shapes[2], ["01  re:Invent"])
    poner(s.shapes[3], ["BECA", "All Builders Welcome"])
    poner(s.shapes[4], ["+  Las Vegas", "+  Viaje y hospedaje", "+  Fuente: Univalle"])
    poner(s.shapes[6], ["02  Summit"])
    poner(s.shapes[7], ["PONENTES", "Invitados por AWS"])
    poner(s.shapes[8], ["+  Bogotá, julio", "+  Builder Spotlight", "+  Dato del equipo"])
    poner(s.shapes[10], ["03  SCD"])
    poner(s.shapes[11], ["ORGANIZADORES", "Student Community Day Colombia"])
    poner(s.shapes[12], ["+  Bogotá, 26 jun", "+  Más de 800 cupos", "+  Fuente: oficial"])
    notas(s, "Tres reconocimientos. Juan Manuel Hoyos, estudiante de décimo semestre de Ingeniería de Sistemas y líder del grupo, ganó la beca All Builders Welcome para AWS re:Invent; la Agencia de Noticias de la universidad lo publicó el 15 de octubre. Fuimos ponentes invitados por AWS en el AWS Summit Bogotá. Y Juan figura entre los organizadores del AWS Student Community Day Colombia, que tuvo más de 800 cupos.")

    # 11. Contexto nacional
    s = S[10]
    poner(s.shapes[0], ["CONTEXTO NACIONAL", f"{cmp['puesto_univalle_miembros']}.º de {len(cmp['grupos'])} SBG de Colombia en miembros"])
    poner(s.shapes[1], [
        f"Entre los {len(cmp['grupos'])} AWS Student Builder Groups de Colombia revisados en Meetup:",
        f"{cmp['puesto_univalle_miembros']}.º en miembros · {cmp['puesto_univalle_eventos']}.º en eventos · {cmp['puesto_univalle_valoraciones']}.º en valoraciones",
        "Y el único de los cinco primeros fuera de Bogotá y Medellín.",
        "Corte 3 nov 2026 · No es un ranking oficial",
    ])
    tam(s.shapes[1], 1, 22)
    notas(s, f"Para dar contexto sin exagerar: revisamos el mismo día los {len(cmp['grupos'])} SBG de Colombia que aparecen en el directorio dondeaprendoaws.com. Somos segundos en miembros, después de la Universidad Distrital, con 2.951; segundos en eventos, después de EAN, con 37; y primeros en número de valoraciones. Los grupos se crearon en fechas distintas, así que no es un ranking oficial y no decimos que seamos el más grande.")

    # 12. Separador
    s = S[11]
    poner(s.shapes[0], ["LO QUE VIENE", "Diciembre en Tuluá"])
    notas(s, "Y ahora, lo que viene en diciembre.")

    # 13. Watch Party y hackathon
    s = S[12]
    poner(s.shapes[0], ["DICIEMBRE 2026", "Dos eventos para cerrar el año"])
    poner(s.shapes[1], ["VIERNES 4 DE DICIEMBRE", "Watch Party", "AWS re:Invent · Watch & Build", "Tuluá"])
    poner(s.shapes[3], ["DICIEMBRE · POR CONFIRMAR", "Hackathon", "Primera hackathon AWS del grupo", "Pronto"])
    poner(s.shapes[6], ["ÚNETE", "Meetup del grupo"])
    poner(s.shapes[7], ["La Watch Party está aprobada y avalada por AWS. Lugar, horario e inscripción se publicarán en Meetup."])
    pic = s.shapes[5]
    img = qrcode.make(MEETUP, border=1)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    nuevo = s.shapes.add_picture(buf, pic.left, pic.top, pic.width, pic.height)
    nuevo.name = "QR Meetup del grupo"
    pic._element.getparent().replace(pic._element, nuevo._element)
    notas(s, "El 4 de diciembre hacemos en Tuluá la AWS re:Invent Watch & Build Party, aprobada y avalada por AWS. Es el último día de re:Invent: Juan estará en Las Vegas y la comunidad seguirá los anuncios y construirá con ellos desde Tuluá. En diciembre, con fecha por confirmar, viene la primera hackathon de AWS del grupo. El código lleva al Meetup del grupo, donde se publicarán ambos eventos.")

    # 14. Lo que pedimos
    s = S[13]
    grid6(s, ["LO QUE PEDIMOS", "Cómo puede apoyarnos la universidad"], [
        ("Espacio en Tuluá", "Un auditorio o una sala con buena conectividad para la Watch Party del 4 de diciembre."),
        ("Sede para la hackathon", "Espacio y apoyo logístico para una jornada de construcción en equipo."),
        ("Difusión en las sedes", "Canales institucionales para llegar a estudiantes de Tuluá, Yumbo, Cali y las demás sedes."),
        ("Reconocimiento", "Constancias o reconocimiento a los estudiantes que participan y se certifican."),
        ("Salas de sistemas", "Continuidad de los workshops prácticos en la sala de sistemas de Villa Campestre."),
        ("Enlace docente", "Una persona del programa que articule el grupo con cursos y semilleros."),
    ])
    notas(s, "Para cerrar, les pedimos seis cosas concretas. Las dos primeras son urgentes: un espacio en Tuluá para la Watch Party del 4 de diciembre y una sede para la hackathon. Las otras cuatro son para el segundo año: difusión institucional, reconocimiento a los estudiantes, continuidad en las salas de sistemas y un enlace docente.")

    # 15. Cierre
    s = S[14]
    poner(s.shapes[0], ["Gracias.", "Construyamos juntos el segundo año.", "aws.cloud.club@correounivalle.edu.co · awsunivalle.dev/recap", "AWS STUDENT BUILDER GROUP · UNIVERSIDAD DEL VALLE"])
    notas(s, "Muchas gracias. Les dejamos el informe ejecutivo y el informe completo, con fuentes. Quedamos atentos a sus preguntas.")

    prs.save(salida)
    print("✓", salida)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
