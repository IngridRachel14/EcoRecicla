import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect, router } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Success() {
  const { token, isLoading } = useAuthSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<null | {
    id: number;
    uri: string;
    description: string;
    createdAt: string;
    bottle: number;
    valid: boolean;
  }>(null);

  const [imagenes, setImagenes] = useState<
    {
      id: number;
      uri: string;
      description: string;
      createdAt: string;
      bottle: number;
      valid: boolean;
    }[]
  >([]);

  const [isCapturing, setIsCapturing] = useState(false);
  const [lastImageCount, setLastImageCount] = useState(0);

  if (isLoading) return <Text>Loading...</Text>;
  if (!token?.current) return <Redirect href="/(auth)/sign-up" />;

  // Cargar imágenes iniciales al montar el componente
  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
  const loadStoredBarcode = async () => {
    try {
      const storedBarcode = await AsyncStorage.getItem('user_barcode');
      if (storedBarcode) {
        setBarcode(storedBarcode);
      }
    } catch (error) {
      console.error('Error loading stored barcode:', error);
    }
  };
  
  loadStoredBarcode();
}, []);

  const loadImages = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scan/images`, {
        headers: {
          Authorization: `Bearer ${token.current}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data.images)) {
        const mapped = data.images.map(img => ({
          id: img.id,
          uri: img.url,
          description: img.description,
          createdAt: img.createdAt,
          bottle: img.bottle,
          valid: img.valid
        }));
        setImagenes(mapped);
        setLastImageCount(mapped.length);
      }
    } catch (err) {
      return
    }
  };

  const waitForNewImage = async () => {
    let retries = 0;
    const maxRetries = 15; // Aumentado a 10 intentos
    const initialCount = lastImageCount;

    while (retries < maxRetries) {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scan/images`, {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data.images)) {
          const mapped = data.images.map(img => ({
            id: img.id,
            uri: img.url,
            description: img.description,
            createdAt: img.createdAt,
            bottle: img.bottle,
            valid: img.valid
          }));
          
          // Si hay nuevas imágenes
          if (mapped.length > initialCount) {
            setImagenes(mapped);
            setLastImageCount(mapped.length);
            console.log(`Nueva imagen detectada! Total: ${mapped.length}`);
            return true; // Éxito
          }
        }
      } catch (err) {
        console.warn("Error esperando imagen:", err);
      }

      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      retries++;
    }

    return false; // Timeout
  };

  const takephoto = async () => {
    if (isCapturing) return; 
    
    setIsCapturing(true);
    try {
      console.log("Iniciando captura...");
      const response = await fetch(`${process.env.EXPO_PUBLIC_SCANNER_URL}/capture`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
      }

      console.log("Esperando nueva imagen...");
      const success = await waitForNewImage();
      
      if (success) {
        console.log("¡Foto capturada exitosamente!");
      } else {
        console.log("Timeout esperando la imagen, pero la foto pudo haberse tomado.");
        // Recargar imágenes por si acaso
        await loadImages();
      }
    } catch (error) {
      return
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImagePress = (item: typeof imagenes[0]) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const finishphoto = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SCANNER_URL}/finish`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
      }
      router.replace('/(authorized)/(tabs)');
      return;
    } catch (error) {
    }
  };

  const quitphoto = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SCANNER_URL}/quit`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
      }
      router.replace('/(authorized)/(tabs)');
      return;
    } catch (error) {
    }
  };

  const getObjectType = (item: typeof imagenes[0]) => {
    if (item.description.toLowerCase().includes('can') || item.description.toLowerCase().includes('metal')) {
      return 'Lata';
    } else if (item.bottle > 0 || item.description.toLowerCase().includes('bottle')) {
      return 'Botella';
    } else {
      return 'Sin detección';
    }
  };

   useEffect(() => {
    if (!barcode) return;

    const ws = new WebSocket(`${process.env.EXPO_PUBLIC_WS_URL}/${barcode}`);

    ws.onopen = () => {

    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.event === "redirect") {
        const path = data?.payload?.redirectTo ?? "/success";
        router.replace(path);
      }
    };

    ws.onerror = (error) => {
      const canceltrans = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scan/cancel-error`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.current}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          return
        }
      };

      canceltrans();

    };

    ws.onclose = () => {
    };

    return () => {
      ws.close();
    };
  }, [barcode]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Imágenes escaneadas ({imagenes.length})</Text>
      
      {imagenes.length === 0 && (
        <Text style={styles.emptyText}>No hay imágenes. Toma una foto para comenzar.</Text>
      )}
      
      <View style={{ width: '100%' }}>
        {imagenes.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card, 
              item.description === "Sin detección" && styles.noDetectionCard
            ]}
            onPress={() => handleImagePress(item)}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardText}>
                {getObjectType(item)} - {item.description}
              </Text>
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#d32f2f' }]} 
          onPress={quitphoto}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: isCapturing ? '#666' : '#1976d2',
              opacity: isCapturing ? 0.6 : 1 
            }
          ]} 
          onPress={takephoto}
          disabled={isCapturing}
        >
          <Text style={styles.buttonText}>
            {isCapturing ? 'Capturando...' : 'Tomar Foto'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#388e3c' }]} 
          onPress={finishphoto}
        >
          <Text style={styles.buttonText}>Terminar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.uri }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>
                  {getObjectType(selectedItem)}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Descripción: </Text>
                  {selectedItem.description}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Botellas detectadas: </Text>
                  {selectedItem.bottle}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Válido: </Text>
                  {selectedItem.valid ? 'Sí' : 'No'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Fecha: </Text>
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </Text>
              </>
            )}
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 140,
    paddingHorizontal: 15,
    backgroundColor: '#efefef',
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDetectionCard: {
    borderColor: '#ffab00',
    backgroundColor: '#fff8e1',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  cardInfo: {
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
});