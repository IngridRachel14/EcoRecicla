import threading
import cv2
import os
import requests
import time
import logging
import sys
from flask import Flask, jsonify, request
from pyzbar.pyzbar import decode
from playsound import playsound
from ultralytics import YOLO
from contextlib import contextmanager
from dataclasses import dataclass
from typing import Optional, Tuple, List
from user import guardar_usuario_activo
from settings import url_backend, API_TOKEN

# Configuración de logging compatible con Windows
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scanner.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configurar el handler de consola para UTF-8 en Windows
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)

app = Flask(__name__)

@dataclass
class DetectionResult:
    """Resultado de la detección de objetos"""
    frame_with_boxes: any
    is_valid: bool
    description: str
    bottle_count: int
    detected_objects: List[dict]

@dataclass
class ScannerConfig:
    """Configuración centralizada del sistema"""
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH: str = 'src/yolov11.pt'
    TEMP_IMAGE_PATH: str = 'temp.jpg'
    SOUND_PATH: str = os.path.join(BASE_DIR, 'sounds', 'scan.mp3')
    CAMERA_WIDTH: int = 640
    CAMERA_HEIGHT: int = 480
    DETECTION_CONFIDENCE: float = 0.5
    RESULT_DISPLAY_TIME: int = 3000
    VALID_CLASSES: List[str] = None
    BOTTLE_CLASSES: List[str] = None
    MAX_RETRIES: int = 3
    REQUEST_TIMEOUT: int = 30

    def __post_init__(self):
        if self.VALID_CLASSES is None:
            self.VALID_CLASSES = ['Transparet Plastic Bottle', 'PET']
        if self.BOTTLE_CLASSES is None:
            # Clases que se consideran botellas para el conteo
            self.BOTTLE_CLASSES = ['Transparet Plastic Bottle', 'PET', 'bottle', 'plastic bottle']

class CameraManager:
    """Manejo seguro de la cámara"""
    
    def __init__(self, camera_id: int = 0):
        self.camera_id = camera_id
        self.cap = None
    
    @contextmanager
    def get_camera(self, width: int = 640, height: int = 480):
        """Context manager para manejo seguro de la cámara"""
        try:
            self.cap = cv2.VideoCapture(self.camera_id)
            if not self.cap.isOpened():
                raise RuntimeError("No se pudo abrir la cámara")
            
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
            
            logger.info(f"Cámara inicializada: {width}x{height}")
            yield self.cap
            
        except Exception as e:
            logger.error(f"Error al inicializar cámara: {e}")
            raise
        finally:
            if self.cap:
                self.cap.release()
                cv2.destroyAllWindows()
                logger.info("Cámara liberada")

class BackendClient:
    """Cliente para comunicación con el backend"""
    
    def __init__(self, base_url: str, api_token: str, timeout: int = 10):
        self.base_url = base_url.rstrip('/')
        self.api_token = api_token
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_token}'
        })
    
    def upload_image(self, frame, detection_result: DetectionResult, max_retries: int = 3) -> dict:
        """Sube imagen al backend con información de validez y conteo de botellas"""
        last_error = None
        
        for attempt in range(max_retries):
            try:
                # Codificar imagen
                success, img_encoded = cv2.imencode('.jpg', frame)
                if not success:
                    logger.error("Error al codificar imagen")
                    return {"success": False, "error": "Error de codificación"}
                
                files = {'image': ('captura.jpg', img_encoded.tobytes(), 'image/jpeg')}
                data = {
                    'description': detection_result.description,
                    'valid': str(detection_result.is_valid).lower(),  # Convertir a string para form data
                    'bottle': str(detection_result.bottle_count)      # Convertir a string para form data
                }
                
                logger.info(f"Subiendo imagen (intento {attempt + 1}/{max_retries})")
                logger.info(f"Datos: valido={detection_result.is_valid}, botellas={detection_result.bottle_count}")
                
                response = self.session.post(
                    f'{self.base_url}/scan/upload/image',
                    files=files,
                    data=data,
                    timeout=self.timeout
                )
                
                response_data = None
                try:
                    response_data = response.json()
                except:
                    response_data = {"message": response.text[:100]}
                
                if response.status_code == 200 or response.status_code == 201:
                    logger.info(f"Imagen subida exitosamente: {detection_result.description}")
                    logger.info(f"Respuesta del servidor: {response_data}")
                    return {"success": True, "data": response_data}
                elif response.status_code == 409:
                    logger.warning(f"Conflicto en el servidor (409): {response_data.get('message', 'Posible duplicado')}")
                    return {"success": False, "error": "Conflicto en el servidor", "status_code": 409}
                else:
                    logger.warning(f"Error del servidor {response.status_code}: {response_data}")
                    last_error = f"HTTP {response.status_code}"
                    
            except requests.exceptions.Timeout as e:
                last_error = f"Timeout después de {self.timeout}s"
                logger.error(f"Timeout de conexión (intento {attempt + 1}): {e}")
            except requests.exceptions.ConnectionError as e:
                last_error = f"Error de conexión: {str(e)[:100]}"
                logger.error(f"Error de conexión (intento {attempt + 1}): {e}")
            except requests.exceptions.RequestException as e:
                last_error = f"Error de request: {str(e)[:100]}"
                logger.error(f"Error de request (intento {attempt + 1}): {e}")
            except Exception as e:
                last_error = f"Error inesperado: {str(e)[:100]}"
                logger.error(f"Error inesperado (intento {attempt + 1}): {e}")
                
            # Esperar antes del siguiente intento (backoff exponencial)
            if attempt < max_retries - 1:
                wait_time = min(2 ** attempt, 10)  # Máximo 10 segundos
                logger.info(f"Esperando {wait_time}s antes del siguiente intento...")
                time.sleep(wait_time)
                    
        return {"success": False, "error": last_error}
    
    def validate_code(self, code_data: str) -> dict:
        """Valida código de barras con el backend"""
        try:
            response = self.session.post(
                f'{self.base_url}/scan/{code_data}',
                timeout=self.timeout
            )
            
            response_data = None
            try:
                response_data = response.json()
            except:
                response_data = {"message": response.text[:100]}
            
            if response.status_code == 200:
                return {"success": True, "message": "Código válido"}
            elif response.status_code == 409:
                message = response_data.get('message', 'Código duplicado')
                return {"success": False, "error": "duplicate", "message": message}
            else:
                message = response_data.get('message', f'Error HTTP {response.status_code}')
                return {"success": False, "error": "invalid", "message": message}
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al validar código: {e}")
            return {"success": False, "error": "network", "message": str(e)}
        
    def finishscan(self) -> dict:
        """Finaliza la transacción y limpia el estado"""
        try:
            logger.info("Finalizando transacción...")
            
            response = self.session.post(
                f'{self.base_url}/scan/complete-scan',
                timeout=self.timeout
            )
            
            response_data = None
            try:
                response_data = response.json()
            except:
                response_data = {"message": response.text[:100]}
            
            if response.status_code == 200:
                total_points = response_data.get('totalPoints', 0)
                items_scanned = response_data.get('itemsScanned', 0)
                logger.info(f"Transacción completada exitosamente: {total_points} puntos, {items_scanned} items")
                return {
                    "success": True, 
                    "message": "Transacción completada exitosamente",
                    "totalPoints": total_points,
                    "itemsScanned": items_scanned
                }
            elif response.status_code == 409:
                message = response_data.get('message', 'Transacción ya completada')
                logger.warning(f"Transacción ya completada: {message}")
                return {
                    "success": True,  # Consideramos exitoso si ya estaba completada
                    "error": "already_completed", 
                    "message": message
                }
            elif response.status_code == 400:
                message = response_data.get('message', 'No hay transacción activa')
                logger.warning(f"Sin transacción activa: {message}")
                return {
                    "success": False, 
                    "error": "no_active_transaction", 
                    "message": message
                }
            elif response.status_code == 404:
                message = response_data.get('message', 'Transacción no encontrada')
                logger.error(f"Transacción no encontrada: {message}")
                return {
                    "success": False, 
                    "error": "not_found", 
                    "message": message
                }
            else:
                message = response_data.get('message', f'Error HTTP {response.status_code}')
                logger.error(f"Error del servidor: {message}")
                return {
                    "success": False, 
                    "error": "server_error", 
                    "message": message
                }
                
        except requests.exceptions.Timeout as e:
            error_msg = f"Timeout después de {self.timeout}s"
            logger.error(f"Timeout al finalizar transacción: {e}")
            return {"success": False, "error": "timeout", "message": error_msg}
        except requests.exceptions.ConnectionError as e:
            error_msg = f"Error de conexión: {str(e)[:100]}"
            logger.error(f"Error de conexión al finalizar: {e}")
            return {"success": False, "error": "connection_error", "message": error_msg}
        except requests.exceptions.RequestException as e:
            error_msg = f"Error de request: {str(e)[:100]}"
            logger.error(f"Error de request al finalizar: {e}")
            return {"success": False, "error": "request_error", "message": error_msg}
        except Exception as e:
            error_msg = f"Error inesperado: {str(e)[:100]}"
            logger.error(f"Error inesperado al finalizar: {e}")
            return {"success": False, "error": "unexpected_error", "message": error_msg}

class ObjectDetector:
    """Detector de objetos usando YOLO"""
    
    def __init__(self, model_path: str, config: ScannerConfig):
        self.config = config
        try:
            self.model = YOLO(model_path)
            logger.info(f"Modelo YOLO cargado: {model_path}")
        except Exception as e:
            logger.error(f"Error al cargar modelo YOLO: {e}")
            raise
    
    def detect_objects(self, frame) -> DetectionResult:
        """Detecta objetos en el frame y retorna resultado detallado"""
        try:
            # Guardar frame temporalmente
            cv2.imwrite(self.config.TEMP_IMAGE_PATH, frame)
            
            # Realizar predicción
            results = self.model.predict(
                self.config.TEMP_IMAGE_PATH, 
                conf=self.config.DETECTION_CONFIDENCE,
                verbose=False
            )
            
            frame_resultado = frame.copy()
            detected_objects = []
            objeto_valido = False
            bottle_count = 0
            
            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    clase = r.names[int(box.cls[0])]
                    confianza = float(box.conf[0])
                    
                    # Almacenar información del objeto detectado
                    obj_info = {
                        'class': clase,
                        'confidence': confianza,
                        'bbox': [x1, y1, x2, y2],
                        'is_valid': clase in self.config.VALID_CLASSES,
                        'is_bottle': clase in self.config.BOTTLE_CLASSES
                    }
                    detected_objects.append(obj_info)
                    
                    logger.info(f'Detectado: {clase} (confianza: {confianza:.2f})')
                    
                    # Verificar si es válido
                    if clase in self.config.VALID_CLASSES:
                        objeto_valido = True
                    
                    # Contar botellas
                    if clase in self.config.BOTTLE_CLASSES:
                        bottle_count += 1
                    
                    # Color según validez
                    color = (0, 255, 0) if clase in self.config.VALID_CLASSES else (0, 0, 255)
                    
                    # Dibujar rectángulo y etiqueta
                    cv2.rectangle(frame_resultado, (x1, y1), (x2, y2), color, 2)
                    
                    # Etiqueta con información adicional
                    label = f'{clase} {confianza:.2f}'
                    if clase in self.config.BOTTLE_CLASSES:
                        label += " (BOTELLA)"
                    
                    cv2.putText(
                        frame_resultado, 
                        label, 
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.6, 
                        color, 
                        2
                    )
            
            # Crear descripción
            if detected_objects:
                class_counts = {}
                for obj in detected_objects:
                    clase = obj['class']
                    class_counts[clase] = class_counts.get(clase, 0) + 1
                
                description_parts = []
                for clase, count in class_counts.items():
                    if count > 1:
                        description_parts.append(f"{clase} ({count})")
                    else:
                        description_parts.append(clase)
                
                descripcion = ", ".join(description_parts)
            else:
                descripcion = "Sin detección"
            
            # Agregar información de validez y conteo al frame
            status_text = f"Valido: {'Si' if objeto_valido else 'NO'} | Botellas: {bottle_count}"
            cv2.putText(
                frame_resultado,
                status_text,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0) if objeto_valido else (0, 0, 255),
                2
            )
            
            logger.info(f"Detección completa - Válido: {objeto_valido}, Botellas: {bottle_count}")
            
            return DetectionResult(
                frame_with_boxes=frame_resultado,
                is_valid=objeto_valido,
                description=descripcion,
                bottle_count=bottle_count,
                detected_objects=detected_objects
            )
            
        except Exception as e:
            logger.error(f"Error en detección de objetos: {e}")
            return DetectionResult(
                frame_with_boxes=frame,
                is_valid=False,
                description="Error en detección",
                bottle_count=0,
                detected_objects=[]
            )

class ScannerApp:
    """Aplicación principal de escaneo"""
    
    def __init__(self):
        self.config = ScannerConfig()
        self.camera_manager = CameraManager()
        self.backend_client = BackendClient(url_backend, API_TOKEN, self.config.REQUEST_TIMEOUT)
        self.detector = ObjectDetector(self.config.MODEL_PATH, self.config)
        
        # Banderas de control
        self._capture_flag = False
        self._quit_flag = False
        self._scanning_active = False
        self._classification_active = False
        self._restart_flag = False  # Nueva bandera para reinicio
        
        # Lock para thread safety
        self._lock = threading.Lock()
    
    @property
    def capture_flag(self) -> bool:
        with self._lock:
            return self._capture_flag
    
    @capture_flag.setter
    def capture_flag(self, value: bool):
        with self._lock:
            self._capture_flag = value
    
    @property
    def quit_flag(self) -> bool:
        with self._lock:
            return self._quit_flag
    
    @quit_flag.setter
    def quit_flag(self, value: bool):
        with self._lock:
            self._quit_flag = value
    
    @property
    def restart_flag(self) -> bool:
        with self._lock:
            return self._restart_flag
    
    @restart_flag.setter
    def restart_flag(self, value: bool):
        with self._lock:
            self._restart_flag = value
    
    def reset_app_state(self):
        """Resetea todos los estados de la aplicación"""
        logger.info("Reseteando estado de la aplicación...")
        
        with self._lock:
            # Detener todas las actividades
            self._scanning_active = False
            self._classification_active = False
            self._capture_flag = False
            self._quit_flag = False
            self._restart_flag = False
        
        # Cerrar todas las ventanas de OpenCV
        cv2.destroyAllWindows()
        
        # Pequeña pausa para asegurar limpieza
        time.sleep(1)
        
        # Reinicializar componentes si es necesario
        try:
            self.camera_manager = CameraManager()
            logger.info("CameraManager reinicializado")
        except Exception as e:
            logger.warning(f"Error al reinicializar CameraManager: {e}")
        
        logger.info("Estado de aplicación reseteado completamente")
    
    def restart_application(self):
        """Reinicia completamente la aplicación"""
        logger.info("Iniciando reinicio completo de la aplicación...")
        cv2.destroyAllWindows()
        # Señalar reinicio a todos los procesos activos
        self.restart_flag = True
        
        # Detener todas las actividades actuales
        self.reset_app_state()
        
        # Iniciar nuevo ciclo de escaneo después de un breve delay
        def delayed_restart():
            time.sleep(2)  # Esperar a que se complete la limpieza
            if not self._scanning_active:  # Solo si no hay escaneo activo
                logger.info("Iniciando nuevo ciclo de escaneo después del reinicio")
                self.start_scanning()
        
        restart_thread = threading.Thread(target=delayed_restart, daemon=True)
        restart_thread.start()
        
        logger.info("Reinicio programado exitosamente")
    
    def scan_barcode(self):
        """Escanea códigos de barras"""
        if self._scanning_active:
            logger.warning("Ya hay un escaneo activo")
            return
        
        self._scanning_active = True
        logger.info("Iniciando escaneo de código de barras")
        
        try:
            with self.camera_manager.get_camera(
                self.config.CAMERA_WIDTH, 
                self.config.CAMERA_HEIGHT
            ) as cap:
                
                while self._scanning_active and not self.restart_flag:
                    ret, frame = cap.read()
                    if not ret:
                        logger.error("No se pudo leer frame de la cámara")
                        break
                    
                    # Verificar si se solicita reinicio
                    if self.restart_flag:
                        logger.info("Reinicio solicitado - saliendo del escaneo")
                        break
                    
                    # Buscar códigos de barras
                    barcodes = decode(frame)
                    for barcode in barcodes:
                        code_data = barcode.data.decode('utf-8')
                        if code_data:
                            logger.info(f"Código detectado: {code_data}")
                            
                            # Reproducir sonido
                            if os.path.exists(self.config.SOUND_PATH):
                                try:
                                    playsound(self.config.SOUND_PATH)
                                except Exception as e:
                                    logger.warning(f"Error al reproducir sonido: {e}")
                            
                            # Validar con backend
                            validation_result = self.backend_client.validate_code(code_data)
                            
                            if validation_result["success"]:
                                logger.info("Codigo validado por el backend")
                                guardar_usuario_activo(code_data)
                                self._scanning_active = False
                                cv2.destroyWindow("Escaner de codigo")
                                # Pequeña pausa antes de iniciar clasificación
                                time.sleep(0.5)
                                if not self.restart_flag:  # Solo continuar si no hay reinicio
                                    self.classify_objects()
                                return
                            elif validation_result.get("error") == "duplicate":
                                logger.warning(f"Codigo ya escaneado: {validation_result['message']}")
                                # Mostrar mensaje al usuario por 3 segundos
                                self._show_duplicate_message(frame, validation_result['message'])
                            else:
                                logger.warning(f"Codigo rechazado: {validation_result['message']}")
                                # Mostrar mensaje de error por 2 segundos
                                self._show_error_message(frame, validation_result['message'])
                    
                    # Mostrar frame
                    cv2.imshow('Escaner de codigo', frame)
                    key = cv2.waitKey(1) & 0xFF
                    if key in [27, ord('q')]:  # ESC o 'q'
                        break
                        
        except Exception as e:
            logger.error(f"Error durante el escaneo: {e}")
        finally:
            self._scanning_active = False
            logger.info("Escaneo de código finalizado")
    
    def classify_objects(self):
        """Clasifica objetos usando YOLO"""
        if self._classification_active:
            logger.warning("Ya hay una clasificación activa")
            return
        
        self._classification_active = True
        logger.info("Iniciando clasificación de objetos")
        
        try:
            with self.camera_manager.get_camera(
                self.config.CAMERA_WIDTH, 
                self.config.CAMERA_HEIGHT
            ) as cap:
                
                logger.info("Presiona 'C' para capturar o usa el endpoint /capture")
                
                while self._classification_active and not self.restart_flag:
                    ret, frame = cap.read()
                    if not ret:
                        logger.error("Error al leer frame de la cámara")
                        break
                    
                    # Verificar si se solicita reinicio
                    if self.restart_flag:
                        logger.info("Reinicio solicitado - saliendo de la clasificación")
                        break
                    
                    # Mostrar frame en vivo
                    cv2.imshow("Clasificacion YOLO - Presiona C para capturar", frame)
                    
                    key = cv2.waitKey(1) & 0xFF
                    
                    # Capturar imagen
                    if key == ord('c') or self.capture_flag:
                        if self.restart_flag:  # Verificar reinicio antes de procesar
                            break
                            
                        logger.info("Capturando y analizando imagen...")
                        
                        detection_result = self.detector.detect_objects(frame)
                        
                        # Mostrar resultado
                        cv2.imshow("Resultado de Deteccion", detection_result.frame_with_boxes)
                        cv2.waitKey(self.config.RESULT_DISPLAY_TIME)
                        cv2.destroyWindow("Resultado de Deteccion")
                        
                        # Subir al backend con información de validez y conteo
                        upload_result = self.backend_client.upload_image(detection_result.frame_with_boxes, detection_result)
                        
                        if detection_result.is_valid:
                            logger.info(f"Clasificación válida: {detection_result.bottle_count} botella(s) detectada(s)")
                        else:
                            logger.warning("Clasificación inválida: objeto no válido detectado")
                        
                        if upload_result["success"]:
                            logger.info("Imagen subida exitosamente al backend")
                        elif upload_result.get("status_code") == 409:
                            logger.warning("Imagen duplicada en el backend - continuando")
                        else:
                            logger.error(f"Error al subir imagen: {upload_result.get('error', 'Error desconocido')}")
                        
                        self.capture_flag = False
                    
                    # Salir
                    elif key in [27, ord('q')] or self.quit_flag:
                        logger.info("Saliendo de la clasificación")
                        self.quit_flag = False
                        break
                        
        except Exception as e:
            logger.error(f"Error durante la clasificación: {e}")
        finally:
            self._classification_active = False
            logger.info("Clasificación finalizada")
    
    def _show_duplicate_message(self, frame, message):
        """Muestra mensaje de código duplicado"""
        try:
            display_frame = frame.copy()
            
            # Configurar el texto
            text = f"CODIGO YA ESCANEADO"
            sub_text = message[:50] + "..." if len(message) > 50 else message
            
            # Dimensiones del frame
            height, width = display_frame.shape[:2]
            
            # Fondo semi-transparente
            overlay = display_frame.copy()
            cv2.rectangle(overlay, (0, height//2 - 60), (width, height//2 + 60), (0, 0, 200), -1)
            cv2.addWeighted(overlay, 0.7, display_frame, 0.3, 0, display_frame)
            
            # Texto principal
            font_scale = min(width/800, 1.5)
            cv2.putText(display_frame, text, (50, height//2), cv2.FONT_HERSHEY_BOLD, font_scale, (255, 255, 255), 2)
            cv2.putText(display_frame, sub_text, (50, height//2 + 30), cv2.FONT_HERSHEY_SIMPLEX, font_scale*0.6, (200, 200, 200), 1)
            
            cv2.imshow('Escaner de codigo', display_frame)
            cv2.waitKey(3000)  # Mostrar por 3 segundos
            
        except Exception as e:
            logger.error(f"Error mostrando mensaje duplicado: {e}")
    
    def _show_error_message(self, frame, message):
        """Muestra mensaje de error"""
        try:
            display_frame = frame.copy()
            
            # Configurar el texto
            text = f"CODIGO INVALIDO"
            sub_text = message[:50] + "..." if len(message) > 50 else message
            
            # Dimensiones del frame
            height, width = display_frame.shape[:2]
            
            # Fondo semi-transparente
            overlay = display_frame.copy()
            cv2.rectangle(overlay, (0, height//2 - 60), (width, height//2 + 60), (0, 0, 255), -1)
            cv2.addWeighted(overlay, 0.7, display_frame, 0.3, 0, display_frame)
            
            # Texto principal
            font_scale = min(width/800, 1.5)
            cv2.putText(display_frame, text, (50, height//2), cv2.FONT_HERSHEY_BOLD, font_scale, (255, 255, 255), 2)
            cv2.putText(display_frame, sub_text, (50, height//2 + 30), cv2.FONT_HERSHEY_SIMPLEX, font_scale*0.6, (200, 200, 200), 1)
            
            cv2.imshow('Escaner de codigo', display_frame)
            cv2.waitKey(2000)  # Mostrar por 2 segundos
            
        except Exception as e:
            logger.error(f"Error mostrando mensaje de error: {e}")
            
    def _quit_application(self):
        """Cierra la aplicación de forma segura"""
        try:
            # Establecer banderas de salida
            self._scanning_active = False
            self._classification_active = False
            self.quit_flag = True
            
            # Cerrar todas las ventanas de OpenCV
            cv2.destroyAllWindows()
            
            # Pequeña pausa para permitir que se cierren las ventanas
            time.sleep(1)
            
            # Forzar salida del programa
            import os
            os._exit(0)
            
        except Exception as e:
            print(f"Error al cerrar aplicación: {e}")
            import os
            os._exit(1)
    
    def start_scanning(self):
        """Inicia el hilo de escaneo"""
        if not self._scanning_active and not self.restart_flag:
            scanning_thread = threading.Thread(target=self.scan_barcode, daemon=True)
            scanning_thread.start()
            return True
        return False

# Instancia global de la aplicación
scanner_app = ScannerApp()

# Rutas Flask mejoradas
@app.route('/capture', methods=['POST'])
def capture_endpoint():
    """Endpoint para capturar imagen"""
    try:
        scanner_app.capture_flag = True
        return jsonify({
            "success": True,
            "message": "Captura iniciada"
        }), 200
    except Exception as e:
        logger.error(f"Error en endpoint capture: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/quit', methods=['POST'])
def quit_endpoint():
    """Endpoint para salir de la clasificación"""
    try:
        scanner_app.quit_flag = True
        return jsonify({
            "success": True,
            "message": "Señal de salida enviada"
        }), 200
    except Exception as e:
        logger.error(f"Error en endpoint quit: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
        
@app.route('/finish', methods=['POST'])
def finish_endpoint():
    """Endpoint para finalizar transacción y reiniciar aplicación"""
    try:
        logger.info("Solicitud de finalización de transacción recibida")
        
        finish_result = scanner_app.backend_client.finishscan()
        
        if finish_result["success"]:
            logger.info(f"Transacción finalizada exitosamente: {finish_result.get('message', '')}")
            
            if 'totalPoints' in finish_result:
                logger.info(f"Puntos otorgados: {finish_result['totalPoints']}")
                logger.info(f"Items escaneados: {finish_result.get('itemsScanned', 0)}")
        
        elif finish_result.get("error") == "already_completed":
            logger.info("La transacción ya estaba completada")
        
        elif finish_result.get("error") == "no_active_transaction":
            logger.warning("No había transacción activa para completar")
        
        else:
            logger.error(f"Error al finalizar transacción: {finish_result.get('message', 'Error desconocido')}")
        
        def restart_process():
            try:
                time.sleep(1)
                
                scanner_app.restart_application()
                
            except Exception as e:
                logger.error(f"Error durante el proceso de reinicio: {e}")
                scanner_app.reset_app_state()
                time.sleep(2)
                scanner_app.start_scanning()
        
        restart_thread = threading.Thread(target=restart_process, daemon=True)
        restart_thread.start()
        
        return jsonify({
            "success": True,
            "message": "Transacción procesada y reinicio iniciado",
            "transaction_result": finish_result,
            "restart_initiated": True
        }), 200
        
    except Exception as e:
        logger.error(f"Error en endpoint finish: {e}")
        
        try:
            def emergency_restart():
                time.sleep(2)
                scanner_app.restart_application()
            
            restart_thread = threading.Thread(target=emergency_restart, daemon=True)
            restart_thread.start()
            
        except Exception as restart_error:
            logger.error(f"Error en reinicio de emergencia: {restart_error}")
        
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error al procesar finalización, pero reinicio iniciado"
        }), 500

@app.route('/status', methods=['GET'])
def status_endpoint():
    """Endpoint para obtener el estado del sistema"""
    return jsonify({
        "scanning_active": scanner_app._scanning_active,
        "classification_active": scanner_app._classification_active,
        "capture_flag": scanner_app.capture_flag,
        "quit_flag": scanner_app.quit_flag,
        "restart_flag": scanner_app.restart_flag
    }), 200

@app.route('/reset_user', methods=['POST'])
def reset_user_endpoint():
    """Endpoint para resetear el usuario y permitir nuevo escaneo"""
    try:
        
        return jsonify({
            "success": True,
            "message": "Usuario reseteado, puede escanear nuevo código"
        }), 200
    except Exception as e:
        logger.error(f"Error al resetear usuario: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/check_code/<code>', methods=['GET'])
def check_code_endpoint(code):
    """Endpoint para verificar si un código ya fue usado"""
    try:
        validation_result = scanner_app.backend_client.validate_code(code)
        
        return jsonify({
            "success": True,
            "code": code,
            "is_valid": validation_result["success"],
            "message": validation_result.get("message", ""),
            "error_type": validation_result.get("error", None)
        }), 200
        
    except Exception as e:
        logger.error(f"Error al verificar código: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/start_scan', methods=['POST'])
def start_scan_endpoint():
    """Endpoint para iniciar escaneo manualmente"""
    try:
        if scanner_app.start_scanning():
            return jsonify({
                "success": True,
                "message": "Escaneo iniciado"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Ya hay un escaneo activo o se está reiniciando"
            }), 400
    except Exception as e:
        logger.error(f"Error al iniciar escaneo: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/force_restart', methods=['POST'])
def force_restart_endpoint():
    """Endpoint para forzar reinicio completo del sistema (más agresivo)"""
    try:
        logger.info("Reinicio forzado solicitado")
        
        def force_restart():
            # Detener todo inmediatamente
            scanner_app.restart_flag = True
            scanner_app._scanning_active = False
            scanner_app._classification_active = False
            
            # Cerrar ventanas
            cv2.destroyAllWindows()
            
            # Esperar un momento
            time.sleep(3)
            
            # Resetear estado completamente
            scanner_app.reset_app_state()
            
            # Iniciar nuevo ciclo
            time.sleep(1)
            scanner_app.start_scanning()
            
        restart_thread = threading.Thread(target=force_restart, daemon=True)
        restart_thread.start()
        
        return jsonify({
            "success": True,
            "message": "Reinicio forzado iniciado"
        }), 200
        
    except Exception as e:
        logger.error(f"Error en reinicio forzado: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Manejador global de excepciones"""
    logger.error(f"Error no manejado: {e}")
    return jsonify({
        "success": False,
        "error": "Error interno del servidor"
    }), 500

if __name__ == '__main__':
    try:
        # Iniciar escaneo automáticamente
        scanner_app.start_scanning()
        
        # Iniciar servidor Flask
        logger.info("Iniciando servidor Flask...")
        app.run(host='0.0.0.0', port=5000, debug=False)
        
    except KeyboardInterrupt:
        logger.info("Aplicación interrumpida por el usuario")
    except Exception as e:
        logger.error(f"Error fatal: {e}")
    finally:
        # Limpieza
        cv2.destroyAllWindows()
        logger.info("Aplicación finalizada")