usuario_activo = None

def guardar_usuario_activo(code):
    global usuario_activo
    usuario_activo = code

def liberar_maquina():
    global usuario_activo
    usuario_activo = None

def maquina_esta_ocupada():
    return usuario_activo is not None

def obtener_usuario_activo():
    return usuario_activo
