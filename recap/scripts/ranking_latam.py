"""Ranking de AWS Student Builder Groups de Latinoamérica con datos públicos de Meetup.

Uso:
    python ranking_latam.py <carpeta_con_html_de_meetup> <salida.json>

Universo: los grupos de Meetup listados en https://dondeaprendoaws.com/comunidades/estudiantes/
(Latinoamérica). Para cada grupo se lee la página pública: miembros, eventos pasados,
calificación, valoraciones y fecha de creación. El ritmo se calcula como eventos pasados
por mes desde la creación del grupo hasta la fecha de corte.
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

CORTE = date(2026, 11, 3)
YO = "aws-sbg-at-university-of-the-valle"


def leer(f):
    h = f.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', h, re.S)
    if not m:
        return None
    st = json.loads(m.group(1))["props"]["pageProps"].get("__APOLLO_STATE__", {})
    for k, v in st.items():
        if k.startswith("Group:") and "stats" in v:
            past = [vv for kk, vv in v.items() if "PAST" in kk and "events" in kk]
            creado = date.fromisoformat(v["foundedDate"][:10])
            meses = max((CORTE - creado).days / 30.4375, 1)
            eventos = past[0]["totalCount"] if past else 0
            return {
                "urlname": v["urlname"],
                "nombre": v["name"],
                "ciudad": v.get("city"),
                "pais": (v.get("country") or "").upper(),
                "creado": creado.isoformat(),
                "miembros": v["stats"]["memberCounts"]["all"],
                "eventos": eventos,
                "eventos_por_mes": round(eventos / meses, 2),
                "calificacion": v["stats"]["eventRatings"]["average"],
                "valoraciones": v["stats"]["eventRatings"]["total"],
                "url": f"https://www.meetup.com/{v['urlname']}/",
            }
    return None


def main(carpeta, salida):
    unicos = {}
    for f in sorted(Path(carpeta).glob("*.html")):
        if g := leer(f):
            unicos[g["urlname"]] = g
    grupos = list(unicos.values())
    if not any(g["urlname"] == YO for g in grupos):
        raise SystemExit("Falta la página de Univalle en la carpeta")
    rankings = {}
    for clave in ["eventos", "miembros", "valoraciones", "eventos_por_mes"]:
        orden = sorted(grupos, key=lambda g: -g[clave])
        puesto = 1 + [g["urlname"] for g in orden].index(YO)
        rankings[clave] = {"puesto": puesto, "top5": [{"nombre": g["nombre"], "pais": g["pais"], "valor": g[clave]} for g in orden[:5]]}
    # Ritmo solo entre grupos con al menos 6 meses de vida (evita grupos recién creados con 1 evento).
    maduros = [g for g in grupos if (CORTE - date.fromisoformat(g["creado"])).days >= 182]
    orden = sorted(maduros, key=lambda g: -g["eventos_por_mes"])
    rankings["eventos_por_mes_grupos_6_meses"] = {
        "puesto": 1 + [g["urlname"] for g in orden].index(YO),
        "universo": len(maduros),
        "top5": [{"nombre": g["nombre"], "pais": g["pais"], "valor": g["eventos_por_mes"]} for g in orden[:5]],
    }
    out = {
        "fecha_corte": CORTE.isoformat(),
        "universo": f"{len(grupos)} AWS Student Builder Groups de Latinoamérica con página en Meetup, listados en dondeaprendoaws.com",
        "paises": sorted({g["pais"] for g in grupos}),
        "rankings": rankings,
        "grupos": sorted(grupos, key=lambda g: -g["eventos"]),
    }
    Path(salida).write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(out["universo"], "·", len(out["paises"]), "países")
    for k, r in rankings.items():
        print(f"\n{k}: Univalle puesto {r['puesto']}")
        for g in r["top5"]:
            print("  ", g["valor"], g["pais"], g["nombre"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
