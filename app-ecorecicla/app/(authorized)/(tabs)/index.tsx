import React, { useState, useEffect } from 'react';
import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator 
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const fetchTransactionHistory = async (token) => {
  try {
    const response = await fetch('http://67.205.137.87:3000/scan/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.current}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { transactions: [] };
  }
};

export default function Index() {
  const { token, isLoading } = useAuthSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout( async() => {
      const resp = await fetchTransactionHistory(token)
      setTransactions(resp.transactions);
      setLoading(false);
    }, 1000);
  }, [transactions]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0369a1" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!token?.current) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="leaf" size={60} color="white" />
      </View>
      
      <Text style={styles.emptyTitle}>
        ¡Recicla Pa' la racha! 🔥
      </Text>
      
      <Text style={styles.emptySubtitle}>
        Comienza tu aventura ecológica.{'\n'}
        Cada botella cuenta para un futuro mejor.
      </Text>
      
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>
          Empezar a Reciclar
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="leaf" size={40} color="#22c55e" />
        <Text style={styles.loadingHistoryText}>
          Cargando tu historial...
        </Text>
      </View>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyState />;
  }

  const totalPoints = transactions.reduce((total, t) => total + t.totalPoints, 0);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="trophy" size={28} color="white" />
          <Text style={styles.headerTitleText}>
            Historial de Reciclaje
          </Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>
            Total de puntos ganados
          </Text>
          <Text style={styles.pointsValue}>
            {totalPoints} pts
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>

              <View style={styles.transactionHeader}>
                <View>
                  <Text style={styles.transactionTitle}>
                    Transacción #{transaction.id}
                  </Text>
                  <View style={styles.dateContainer}>
                    <Ionicons name="calendar" size={16} color="white" />
                    <Text style={styles.dateText}>
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>
                    +{transaction.totalPoints} pts
                  </Text>
                </View>
              </View>

              {/* Items */}
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>
                  Artículos reciclados ({transaction.items.length})
                </Text>
                
                {transaction.items.map((item) => (
                  <View 
                    key={item.id} 
                    style={[
                      styles.itemCard,
                      { 
                        backgroundColor: item.valid ? '#f0fdf4' : '#fef2f2',
                        borderLeftColor: item.valid ? '#22c55e' : '#ef4444'
                      }
                    ]}
                  >
                    <Image 
                      source={{ uri: item.url }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.itemBottles}>
                        {item.bottle} {item.bottle === 1 ? 'botella' : 'botellas'}
                      </Text>
                    </View>
                    
                    <View style={styles.itemStatus}>
                      <Ionicons 
                        name={item.valid ? "checkmark-circle" : "close-circle"} 
                        size={24} 
                        color={item.valid ? "#22c55e" : "#ef4444"} 
                      />
                      <Text style={[
                        styles.itemStatusText,
                        { color: item.valid ? '#22c55e' : '#ef4444' }
                      ]}>
                        {item.valid ? 'Válido' : 'Rechazado'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cada acción cuenta para un planeta más verde 🌍
          </Text>
          <Text style={{fontWeight: 'bold', marginTop: 10}}>¡Recicla Pa' la racha! 🔥</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff'
  },
  loadingText: {
    fontSize: 18,
    color: '#0369a1',
    marginTop: 10
  },
  loadingHistoryText: {
    fontSize: 16,
    color: '#0369a1',
    marginTop: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f0f9ff'
  },
  emptyIconContainer: {
    backgroundColor: '#22c55e',
    borderRadius: 80,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 15
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20
  },
  startButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  header: {
    backgroundColor: '#0369a1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10
  },
  pointsContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center'
  },
  pointsLabel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9
  },
  pointsValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1
  },
  transactionsContainer: {
    padding: 20
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  transactionHeader: {
    backgroundColor: '#22c55e',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transactionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  dateText: {
    color: 'white',
    marginLeft: 8,
    opacity: 0.9
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  pointsBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  itemsContainer: {
    padding: 20
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 15
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15
  },
  itemInfo: {
    flex: 1
  },
  itemDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4
  },
  itemBottles: {
    fontSize: 13,
    color: '#64748b'
  },
  itemStatus: {
    alignItems: 'center'
  },
  itemStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  }
});