import IconSetting from "@/components/svg/setting";
import { useAuthSession } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const STORAGE_KEY = "cardBackgroundImage";

const backgroundImages = [
  {
    url: "https://static.vecteezy.com/system/resources/thumbnails/054/581/638/small_2x/recycling-symbol-on-green-leafy-background-representing-environmental-conservation-and-sustainability-photo.jpeg"
  },
  {
    url: "https://static.vecteezy.com/system/resources/previews/008/415/975/non_2x/recycling-at-home-concept-background-free-vector.jpg",
  },
  {
    url: "https://img.freepik.com/vector-gratis/fondo-plano-celebracion-dia-mundial-medio-ambiente_23-2150400536.jpg?semt=ais_hybrid&w=740",
  },
  {
    url: "https://img.freepik.com/foto-gratis/reciclar-marco-verde-acuarela_53876-104461.jpg",
  },
];

type UserPayload = {
  name?: string;
  barcode?: string;
};

export default function Index() {
  const { token, isLoading } = useAuthSession();
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((img) => {
      if (img) {
        setBgImage(img);
        setTempImage(img);
      } else {
        setBgImage(backgroundImages[0].url);
        setTempImage(backgroundImages[0].url);
      }
    });
  }, []);

  useEffect(() => {
    if (token?.current) {
      const decoded: UserPayload = jwtDecode(token.current);
      if (decoded?.name) setUserName(decoded.name);
      if (decoded?.barcode) {
        setBarcode(decoded.barcode)
        AsyncStorage.setItem('user_barcode', decoded.barcode).catch((error) => {
          console.error('Error saving barcode:', error);
        });
      }
    }
  }, [token]);

  const confirmImage = async () => {
    if (tempImage) {
      setBgImage(tempImage);
      await AsyncStorage.setItem(STORAGE_KEY, tempImage);
    }
    setModalVisible(false);
  };

  useEffect(() => {
    if (token?.current) {
      const fetchQr = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/barcode`, {
            headers: { Authorization: `Bearer ${token.current}` },
          });

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setQrBase64(base64data);
            setLoadingQr(false);
          };
          reader.readAsDataURL(blob);

        } catch (error) {
          setLoadingQr(false);
        }
      };
      fetchQr();
    }
  }, [token]);

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


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!token?.current) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsIcon} onPress={() => setModalVisible(true)}>
        <IconSetting width={24} height={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ImageBackground
        source={bgImage ? { uri: bgImage } : undefined}
        style={styles.card}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.qrWrapper}>
          {loadingQr ? (
            <>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.loadingText}>Cargando código...</Text>
            </>
          ) : qrBase64 ? (
            <View>
              <Text style={styles.userName}>{userName}</Text>
              <Image source={{ uri: qrBase64 }} style={styles.image} resizeMode="contain" />
            </View>
          ) : (
            <Text style={styles.errorText}>No se pudo cargar el código.</Text>
          )}
        </View>
      </ImageBackground>

      {/* Modal de selección */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un fondo</Text>
            <View style={styles.imageGrid}>
              {backgroundImages.map(({ url }) => (
                <TouchableOpacity
                  key={url}
                  style={[
                    styles.imageOption,
                    tempImage === url && styles.selectedImage,
                  ]}
                  onPress={() => setTempImage(url)}
                >
                  <Image source={{ uri: url }} style={styles.optionImage} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc", borderColor: "#000000", borderWidth: 1, }]} onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#4CAF50", borderColor: "#318b60", borderWidth: 1, }]} onPress={confirmImage}>
                <Text style={{ color: "white" }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#2e3341",
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
  },
  card: {
    width: screenWidth - 32,
    height: 240,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    overflow: "hidden",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qrWrapper: {
    width: 280,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 160,
    overflow: "hidden",
  },
  image: {
    width: 240,
    height: 120,
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  imageOption: {
    margin: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedImage: {
    borderColor: "#4CAF50",
  },
  optionImage: {
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  imageLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
});
