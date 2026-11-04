"""Genera investigacion/eventos.json y metricas.json a partir de las instantáneas.

Uso (desde la raíz del repo):
    python3 recap/scripts/construir_datos.py

Todas las cifras del recap salen de aquí. Si una cifra cambia, se actualiza la
instantánea o el bloque MANUAL de este archivo y se vuelve a ejecutar.
"""

import json
import statistics
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
INST = RAIZ / "investigacion" / "instantaneas"

FECHA_CORTE = "2026-11-03"
INICIO_AVAL = "2025-11-17"  # creación del grupo en Meetup; el aval de AWS fue en noviembre de 2025
LANZAMIENTO = "2026-02-28"

MEETUP_GRUPO = "https://www.meetup.com/aws-sbg-at-university-of-the-valle/"

# ---------------------------------------------------------------------------
# Datos que no vienen en Meetup: clasificación editorial y ponentes publicados.
# Cada ponente sale de la descripción pública del evento o de la página de
# LinkedIn del grupo (ver FUENTES.md). None = no publicado.
# ---------------------------------------------------------------------------
MANUAL = {
    "313397936": ("Comunidad y lanzamiento", None, "Lanzamiento oficial con taller de EC2"),
    "313727453": ("Carrera y empleabilidad", ["Carlos Zambrano (AWS Hero)"], None),
    "313879391": ("Carrera y empleabilidad", ["William Antonio Guzmán Bernal"], None),
    "314370028": ("Comunidad y lanzamiento", None, None),
    "314572381": ("Certificación y fundamentos", None, "Inscripción por formulario externo: las confirmaciones de Meetup subestiman la asistencia"),
    "314572643": ("IA y datos", None, "Inscripción por formulario externo: las confirmaciones de Meetup subestiman la asistencia"),
    "314742420": ("Certificación y fundamentos", None, None),
    "314748297": ("IA y datos", None, None),
    "315079375": ("Seguridad", None, None),
    "315086726": ("Serverless y arquitectura", None, None),
    "315092436": ("Serverless y arquitectura", None, None),
    "315114097": ("Serverless y arquitectura", None, None),
    "315179163": ("IA y datos", None, None),
    "315075645": ("DevOps e IaC", None, None),
    "315184184": ("Comunidad y lanzamiento", None, "Evento nacional organizado por líderes de SBG de Colombia; Univalle aparece como comunidad participante"),
    "315578404": ("IA y datos", ["Jhon Robert Quintero (AWS Community Builder)", "Raúl Alzate"], "Coorganizado con AWS User Group Valle del Cauca, CENESIS e IEEE Computer Society"),
    "316292610": ("Serverless y arquitectura", None, "Escuela de Policía Simón Bolívar, Tuluá"),
    "316292639": ("Certificación y fundamentos", None, "Escuela de Policía Simón Bolívar, Tuluá"),
    "316436196": ("IA y datos", ["Lucas Vera Toro"], None),
    "316372017": ("Reto Cloud Practitioner", None, "Sesión 1 de 8, con el SBG de la UCEVA"),
    "316572977": ("IA y datos", ["Carlos Fernando Chicata"], None),
    "316375692": ("Reto Cloud Practitioner", None, "Sesión 2 de 8, con el SBG de la UCEVA"),
    "316375729": ("Reto Cloud Practitioner", None, "Sesión 3 de 8, con el SBG de la UCEVA"),
    "316601837": ("Carrera y empleabilidad", ["Julián Darío Luna Patiño (AWS Community Builder, TryCatch.tv)"], None),
    "316375755": ("Reto Cloud Practitioner", None, "Sesión 4 de 8, con el SBG de la UCEVA"),
    "316546840": ("Seguridad", None, "Workshop práctico, 26 cupos anunciados"),
    "316764639": ("DevOps e IaC", ["José Verbel Tous"], None),
    "316796377": ("DevOps e IaC", None, "Realizado en la Universidad Icesi"),
    "316375782": ("Reto Cloud Practitioner", None, "Sesión 5 de 8; la descripción dice 3 de octubre (ver CONFLICTOS.md)"),
    "316898074": ("Comunidad y lanzamiento", None, "Kick-off regional con Univalle, Icesi, UCEVA y U. de San Buenaventura"),
    "316375800": ("Reto Cloud Practitioner", None, "Sesión 6 de 8, con el SBG de la UCEVA"),
    "317021873": ("IA y datos", None, "Workshop práctico, 30 cuentas temporales anunciadas"),
    "316852576": ("Carrera y empleabilidad", ["Germán Ruiz (Senior Solutions Architect, AWS)"], None),
    "316375847": ("Reto Cloud Practitioner", None, "Sesión 7 de 8; la descripción dice 15 de octubre (ver CONFLICTOS.md)"),
    "317022147": ("Carrera y empleabilidad", ["Diana David (HR Manager LATAM)"], None),
    "316375885": ("Reto Cloud Practitioner", None, "Sesión 8 de 8; la descripción dice 22 de octubre (ver CONFLICTOS.md)"),
}

# Lugar normalizado a partir del venue de Meetup.
def sede(venue, tipo):
    if tipo == "ONLINE" or not venue:
        return "Virtual"
    texto = " ".join(str(v) for v in venue.values() if v).lower()
    if "policia" in texto or "policía" in texto:
        return "Tuluá · Escuela de Policía"
    if "tulu" in texto:
        return "Tuluá · Univalle Villa Campestre"
    if "icesi" in texto:
        return "Cali · Universidad Icesi"
    if "melendez" in texto or "meléndez" in texto:
        return "Cali · Univalle Meléndez"
    if "bogot" in texto:
        return "Bogotá"
    return venue.get("city") or "Sin dato"


def cargar(nombre):
    return json.loads((INST / nombre).read_text(encoding="utf-8"))


def redondear(x, n=1):
    return round(x + 0.0, n)


def main():
    meetup = cargar("meetup_eventos_2026-11-03.json")
    pares = cargar("sbg_colombia_2026-11-03.json")["grupos"]

    eventos = []
    for e in meetup["eventos"]:
        cat, ponentes, nota = MANUAL[e["id"]]
        lugar = sede(e["venue"], e["eventType"])
        venue = e["venue"] or {}
        eventos.append({
            "id": e["id"],
            "titulo": e["title"],
            "fecha": e["dateTime"][:10],
            "hora": e["dateTime"][11:16],
            "modalidad": "Virtual" if e["eventType"] == "ONLINE" else "Presencial",
            "sede": lugar,
            "lugar": "En línea" if e["eventType"] == "ONLINE" else ", ".join(v for v in [venue.get("name"), venue.get("city")] if v and not (v == venue.get("city") and v in (venue.get("name") or ""))),
            "tema": cat,
            "ponentes_publicos": ponentes or [],
            "confirmaciones_meetup": e["rsvpYes"],
            "nota": nota,
            "url": e["url"],
        })
    eventos.sort(key=lambda x: (x["fecha"], x["hora"]))

    # --------------------------- métricas de eventos ---------------------------
    rsvps = [e["confirmaciones_meetup"] for e in eventos]
    virt = [e for e in eventos if e["modalidad"] == "Virtual"]
    pres = [e for e in eventos if e["modalidad"] == "Presencial"]
    reto = [e for e in eventos if e["tema"] == "Reto Cloud Practitioner"]
    propios = [e for e in eventos if e["id"] != "315184184"]

    inicio = date.fromisoformat(INICIO_AVAL)
    lanz = date.fromisoformat(LANZAMIENTO)
    corte = date.fromisoformat(FECHA_CORTE)
    dias_aval = (corte - inicio).days
    dias_lanz = (corte - lanz).days
    meses_aval = dias_aval / 30.4375
    meses_lanz = dias_lanz / 30.4375

    por_mes = {}
    for e in eventos:
        k = e["fecha"][:7]
        por_mes.setdefault(k, {"eventos": 0, "confirmaciones": 0, "virtuales": 0, "presenciales": 0})
        por_mes[k]["eventos"] += 1
        por_mes[k]["confirmaciones"] += e["confirmaciones_meetup"]
        por_mes[k]["virtuales" if e["modalidad"] == "Virtual" else "presenciales"] += 1
    meses = []
    y, mth = 2025, 11
    while (y, mth) <= (2026, 11):
        k = f"{y}-{mth:02d}"
        meses.append({"mes": k, **por_mes.get(k, {"eventos": 0, "confirmaciones": 0, "virtuales": 0, "presenciales": 0})})
        mth += 1
        if mth == 13:
            y, mth = y + 1, 1

    por_tema, por_sede = {}, {}
    for e in eventos:
        por_tema.setdefault(e["tema"], {"eventos": 0, "confirmaciones": 0})
        por_tema[e["tema"]]["eventos"] += 1
        por_tema[e["tema"]]["confirmaciones"] += e["confirmaciones_meetup"]
        por_sede.setdefault(e["sede"], {"eventos": 0, "confirmaciones": 0})
        por_sede[e["sede"]]["eventos"] += 1
        por_sede[e["sede"]]["confirmaciones"] += e["confirmaciones_meetup"]

    top = sorted(eventos, key=lambda e: -e["confirmaciones_meetup"])[:5]
    ponentes_invitados = sorted({p for e in eventos for p in e["ponentes_publicos"]})
    ciudades = sorted({e["sede"].split(" · ")[0] for e in pres})

    # --------------------------- comparación SBG ---------------------------
    pares_ord = sorted(pares, key=lambda g: -g["members"])
    def puesto(clave):
        orden = sorted(pares, key=lambda g: -g[clave])
        return 1 + [g["urlname"] for g in orden].index("aws-sbg-at-university-of-the-valle")
    valle = [g for g in pares if g["city"] in ("Cali", "Tuluá")]
    valle.sort(key=lambda g: g["founded"])

    fuente_meetup_grupo = {"url": MEETUP_GRUPO, "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial"}

    metricas = {
        "_descripcion": "Única fuente de cifras del recap AWS SBG Univalle. Generado por recap/scripts/construir_datos.py; no editar a mano los bloques calculados.",
        "fecha_corte": FECHA_CORTE,
        "periodo": {
            "inicio_aval": INICIO_AVAL,
            "lanzamiento_oficial": LANZAMIENTO,
            "fin": FECHA_CORTE,
            "dias_desde_aval": dias_aval,
            "meses_desde_aval": redondear(meses_aval, 2),
            "dias_desde_lanzamiento": dias_lanz,
            "meses_desde_lanzamiento": redondear(meses_lanz, 2),
            "nota": "El inicio usa la fecha de creación del grupo en Meetup (17-nov-2025), coherente con el aval de AWS de noviembre de 2025 confirmado por el líder.",
        },
        "comunidad": {
            "miembros_meetup": {"valor": 1408, **fuente_meetup_grupo},
            "eventos_meetup": {"valor": len(eventos), **fuente_meetup_grupo, "nota": "Eventos pasados publicados en Meetup. Incluye el AWS Student Community Day Colombia, evento nacional listado por el grupo."},
            "eventos_propios_o_coorganizados": {"valor": len(propios), **fuente_meetup_grupo, "nota": "36 eventos menos el Student Community Day Colombia, que es un evento nacional."},
            "calificacion_meetup": {"valor": 4.86, "valor_redondeado": 4.9, "valoraciones": 183, **fuente_meetup_grupo},
            "seguidores_linkedin": {"valor": 863, "url": "https://www.linkedin.com/company/aws-studentbuildergroupunivalle/", "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial"},
            "suscriptores_youtube": {"valor": 56, "videos": 7, "url": "https://www.youtube.com/@awscloudunivalle", "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial"},
            "repos_publicos_github": {"valor": 12, "url": "https://github.com/AWS-Cloud-Club-at-Universidad-del-Valle", "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial"},
            "miembros_sitio_web": {"valor": 922, "eventos": 27, "url": "https://awsunivalle.dev/", "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial", "nota": "Cifra fija en el código del sitio; desactualizada frente a Meetup (ver CONFLICTOS.md)."},
            "estudiantes_impactados": {"valor": 900, "texto": "más de 900", "actividades": 27, "url": "https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026", "fecha_corte": "2026-10-15", "nivel": "fuente oficial", "nota": "Cifra publicada por la Agencia de Noticias Univalle con datos aportados por el grupo."},
        },
        "eventos": {
            "total": len(eventos),
            "virtuales": len(virt),
            "presenciales": len(pres),
            "confirmaciones_total": sum(rsvps),
            "confirmaciones_promedio": redondear(statistics.mean(rsvps)),
            "confirmaciones_mediana": statistics.median(rsvps),
            "confirmaciones_promedio_virtual": redondear(statistics.mean(e["confirmaciones_meetup"] for e in virt)),
            "confirmaciones_promedio_presencial": redondear(statistics.mean(e["confirmaciones_meetup"] for e in pres)),
            "aviso_confirmaciones": "Las confirmaciones (RSVP «Asistiré») de Meetup no son asistencia real. En varios eventos presenciales la inscripción se hizo por formulario externo, así que Meetup los subestima.",
            "eventos_por_mes_desde_aval": redondear(len(eventos) / meses_aval, 2),
            "eventos_por_mes_desde_lanzamiento": redondear(len(eventos) / meses_lanz, 2),
            "eventos_por_semana_desde_lanzamiento": redondear(len(eventos) / (dias_lanz / 7), 2),
            "confirmaciones_por_mes_desde_lanzamiento": redondear(sum(rsvps) / meses_lanz),
            "ciudades_presenciales": ciudades,
            "por_mes": meses,
            "por_tema": por_tema,
            "por_sede": por_sede,
            "top_confirmaciones": [{"titulo": e["titulo"], "fecha": e["fecha"], "confirmaciones": e["confirmaciones_meetup"], "url": e["url"]} for e in top],
            "ponentes_invitados_publicos": ponentes_invitados,
            "fuente": "investigacion/eventos.json (Meetup, consultado el 2026-11-03)",
        },
        "reto_cloud_practitioner": {
            "sesiones": len(reto),
            "aliado": "AWS Student Builder Group UCEVA",
            "sede": "Univalle Tuluá, Villa Campestre",
            "inicio": reto[0]["fecha"],
            "fin": reto[-1]["fecha"],
            "confirmaciones_por_sesion": [e["confirmaciones_meetup"] for e in reto],
            "confirmaciones_promedio": redondear(statistics.mean(e["confirmaciones_meetup"] for e in reto)),
            "confirmaciones_max": max(e["confirmaciones_meetup"] for e in reto),
            "nota": "Cupos llenos según Meetup; programa cerrado a participantes inscritos.",
            "fuente": "https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316372017/",
        },
        "comparacion_sbg_colombia": {
            "fecha_corte": FECHA_CORTE,
            "universo": f"{len(pares)} AWS Student Builder Groups de Colombia listados en dondeaprendoaws.com con página en Meetup",
            "metodo": "Datos públicos de cada página de Meetup el mismo día. Miembros y eventos son acumulados desde la creación de cada grupo, que varía entre mayo de 2025 y septiembre de 2026.",
            "puesto_univalle_miembros": puesto("members"),
            "puesto_univalle_eventos": puesto("pastEvents"),
            "puesto_univalle_valoraciones": puesto("ratingCount"),
            "grupos": [{"nombre": g["name"], "ciudad": g["city"], "creado": g["founded"][:10], "miembros": g["members"], "eventos_pasados": g["pastEvents"], "calificacion": g["ratingAvg"], "valoraciones": g["ratingCount"], "url": g["url"]} for g in pares_ord],
            "valle_del_cauca": [{"nombre": g["name"], "ciudad": g["city"], "creado": g["founded"][:10]} for g in valle],
            "fuente": "https://dondeaprendoaws.com/comunidades/estudiantes/ y páginas de Meetup de cada grupo",
        },
        "hitos_confirmados_por_lider": {
            "_nivel": "confirmado por el líder del grupo; sin fuente pública verificable al corte salvo donde se indica",
            "vouchers_entregados": {"valor": 20, "texto": "más de 20", "detalle": "Vouchers de certificación entregados a estudiantes de Tuluá, Yumbo y otras sedes"},
            "summit_bogota_2026": {"texto": "Ponentes invitados por AWS en el AWS Summit Bogotá 2026 (29 y 30 de julio de 2026)", "fuente_publica": "https://sessionize.com/juan-manuel-hoyos/ (AWS Builder Spotlight, autodeclarado)"},
            "community_day_peru": {"texto": "Participación virtual en el AWS Community Day Perú"},
            "ieee": {"texto": "Sesiones para la comunidad de IEEE", "fuente_publica": "https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/315578404/ (coorganizado con IEEE Computer Society)"},
            "cloud_quest": {"texto": "AWS Cloud Quest realizado en el Valle del Cauca, con muchos ganadores de Univalle", "fuente_publica": "https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/316898074/ (kick-off, 156 confirmaciones)"},
            "reto_sesiones_1_2": {"texto": "Sesiones 1 y 2 del reto centradas en cómputo"},
            "watch_party": {"texto": "AWS re:Invent Watch & Build Party en Tuluá", "fecha": "2026-12-04", "estado": "Aprobada y avalada por AWS"},
            "hackathon": {"texto": "Hackathon de AWS", "fecha": "Diciembre de 2026, por confirmar", "estado": "En preparación"},
        },
        "reconocimientos": {
            "reinvent_beca": {"texto": "Juan Manuel Hoyos Contreras, líder del grupo, obtuvo la beca All Builders Welcome Grant para AWS re:Invent 2026 (Las Vegas, 30 nov – 4 dic)", "url": "https://www.univalle.edu.co/ciencia-y-tecnologia/estudiante-de-univalle-representara-a-colombia-en-aws-re-invent-2026", "fecha": "2026-10-15", "nivel": "fuente oficial"},
            "builder_spotlight": {"texto": "Seleccionado para el AWS Builder Spotlight en el AWS Summit Bogotá 2026", "url": "https://sessionize.com/juan-manuel-hoyos/", "fecha_corte": FECHA_CORTE, "nivel": "fuente pública (autodeclarada en Sessionize)"},
            "community_day_colombia": {"texto": "Juan Hoyos figura entre los líderes organizadores del AWS Student Community Day Colombia 2026 (Bogotá, 26 de junio, 800+ cupos)", "url": "https://awsstudentcommunity.day/en", "fecha_corte": FECHA_CORTE, "nivel": "fuente oficial del evento"},
            "primera_valle": {"texto": "Primer AWS Student Builder Group del Valle del Cauca en Meetup", "detalle": "Univalle se creó el 17-nov-2025; UCEVA (Tuluá) el 28-may-2026 e Icesi (Cali) el 19-sep-2026, según los grupos listados en dondeaprendoaws.com", "url": "https://dondeaprendoaws.com/comunidades/estudiantes/", "fecha_corte": FECHA_CORTE, "nivel": "fuente pública"},
        },
    }

    (RAIZ / "investigacion" / "eventos.json").write_text(json.dumps({
        "_descripcion": "Eventos del AWS SBG Univalle publicados en Meetup. Generado por recap/scripts/construir_datos.py.",
        "fecha_corte": FECHA_CORTE,
        "encontrados": len(eventos),
        "esperados": 36,
        "resumen": f"Se encontraron {len(eventos)} de 36 eventos.",
        "aviso_confirmaciones": metricas["eventos"]["aviso_confirmaciones"],
        "eventos": eventos,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (RAIZ / "metricas.json").write_text(json.dumps(metricas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"eventos: {len(eventos)} | confirmaciones: {sum(rsvps)} | promedio {metricas['eventos']['confirmaciones_promedio']}")
    print(f"desde aval: {dias_aval} días = {meses_aval:.2f} meses -> {len(eventos)/meses_aval:.2f} eventos/mes")
    print(f"desde lanzamiento: {dias_lanz} días = {meses_lanz:.2f} meses -> {len(eventos)/meses_lanz:.2f} eventos/mes")
    print("puestos (miembros, eventos, valoraciones):", metricas["comparacion_sbg_colombia"]["puesto_univalle_miembros"], metricas["comparacion_sbg_colombia"]["puesto_univalle_eventos"], metricas["comparacion_sbg_colombia"]["puesto_univalle_valoraciones"])
    print("por sede:", por_sede)
    print("por tema:", por_tema)
    print("reto:", metricas["reto_cloud_practitioner"]["confirmaciones_por_sesion"], metricas["reto_cloud_practitioner"]["confirmaciones_promedio"])


if __name__ == "__main__":
    main()
