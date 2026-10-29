from pathlib import Path
import csv
from ultralytics import YOLO

BASE = Path(__file__).resolve().parent
CARPETAS = {
    "PET": Path.home() / "Downloads" / "PET",
    "NO_PET": Path.home() / "Downloads" / "No PET",
}
MODELOS = {
    "Anterior_best": BASE / "src" / "best.pt",
    "Nuevo_Roboflow": BASE / "src" / "weights.pt",
}
EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
CONF = 0.25

resultados = []

for nombre_modelo, ruta_modelo in MODELOS.items():
    print(f"\nCargando modelo: {nombre_modelo}")
    try:
        modelo = YOLO(str(ruta_modelo))
    except Exception as e:
        print(f"ERROR al cargar {ruta_modelo}: {e}")
        continue

    for categoria, carpeta in CARPETAS.items():
        imagenes = sorted(
            p for p in carpeta.rglob("*")
            if p.is_file() and p.suffix.lower() in EXTENSIONES
        )

        print(f"\n{nombre_modelo} | {categoria}: {len(imagenes)} imágenes")

        for imagen in imagenes:
            try:
                prediccion = modelo.predict(
                    source=str(imagen),
                    conf=CONF,
                    verbose=False
                )[0]

                cajas = prediccion.boxes
                cantidad = len(cajas) if cajas is not None else 0
                confianzas = (
                    [float(x) for x in cajas.conf.cpu().tolist()]
                    if cantidad else []
                )
                clases = (
                    [modelo.names[int(x)] for x in cajas.cls.cpu().tolist()]
                    if cantidad else []
                )
                detectado = cantidad > 0

                if categoria == "PET":
                    evaluacion = "ACIERTO" if detectado else "NO_DETECTO_PET"
                else:
                    evaluacion = "FALSO_POSITIVO" if detectado else "RECHAZO_CORRECTO"

                fila = {
                    "modelo": nombre_modelo,
                    "categoria_real": categoria,
                    "imagen": imagen.name,
                    "detecta_objeto": detectado,
                    "cantidad_detecciones": cantidad,
                    "confianza_maxima": round(max(confianzas), 4) if confianzas else "",
                    "clases_detectadas": ";".join(map(str, clases)),
                    "evaluacion": evaluacion,
                    "umbral_confianza": CONF,
                }
                resultados.append(fila)

                print(
                    f"  {imagen.name}: {evaluacion}"
                    + (f" | confianza máxima {max(confianzas):.2f}" if confianzas else "")
                )

            except Exception as e:
                print(f"  ERROR con {imagen.name}: {e}")
                resultados.append({
                    "modelo": nombre_modelo,
                    "categoria_real": categoria,
                    "imagen": imagen.name,
                    "detecta_objeto": "",
                    "cantidad_detecciones": "",
                    "confianza_maxima": "",
                    "clases_detectadas": "",
                    "evaluacion": f"ERROR: {e}",
                    "umbral_confianza": CONF,
                })

salida = BASE / "resultados_comparacion.csv"
campos = [
    "modelo", "categoria_real", "imagen", "detecta_objeto",
    "cantidad_detecciones", "confianza_maxima", "clases_detectadas",
    "evaluacion", "umbral_confianza"
]

with salida.open("w", newline="", encoding="utf-8-sig") as archivo:
    escritor = csv.DictWriter(archivo, fieldnames=campos)
    escritor.writeheader()
    escritor.writerows(resultados)

print("\n========== RESUMEN ==========")
for modelo in MODELOS:
    filas = [r for r in resultados if r["modelo"] == modelo]
    pet = [r for r in filas if r["categoria_real"] == "PET"]
    no_pet = [r for r in filas if r["categoria_real"] == "NO_PET"]

    detecta_pet = sum(r["evaluacion"] == "ACIERTO" for r in pet)
    falsos = sum(r["evaluacion"] == "FALSO_POSITIVO" for r in no_pet)
    rechazos = sum(r["evaluacion"] == "RECHAZO_CORRECTO" for r in no_pet)

    print(f"\n{modelo}")
    print(f"Botellas PET detectadas: {detecta_pet}/{len(pet)}")
    print(f"Objetos NO PET detectados incorrectamente: {falsos}/{len(no_pet)}")
    print(f"Objetos NO PET rechazados correctamente: {rechazos}/{len(no_pet)}")

print(f"\nCSV guardado en: {salida}")
