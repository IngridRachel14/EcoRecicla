"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Star, Package, CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Navbar from '@/components/Nav';
import Footer from '@/components/Footer';

export default function Tienda() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [error, setError] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [processingRedemption, setProcessingRedemption] = useState(false);
  const [redemptionStatus, setRedemptionStatus] = useState(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };


  // Fetch user points
  const fetchUserPoints = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) return;
      console.log("hola")
      const response = await fetch(`https://api.sakuraocean.app/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserPoints(userData.user.totalPoints || userData.user?.totalPoints || 0);
        console.log(userData.user)
      }
    } catch (err) {
      console.error('Error fetching user points:', err);
    }
  };

  // Fetch products from API with authentication
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('No se encontró token de autenticación');
          setLoading(false);
          return;
        }

        const response = await fetch('https://api.sakuraocean.app/product', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token de autenticación inválido o expirado');
          }
          throw new Error(`Error al cargar productos: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products || data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
    fetchUserPoints();
  }, []);

  // Process redemption for a single product
  const processProductRedemption = async (product, quantity) => {
    try {
      const token = getAuthToken();

      const response = await fetch('https://api.sakuraocean.app/product/redeem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el canje');
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Handle cart redemption
  const handleRedemption = async () => {
    if (cart.length === 0) return;

    setProcessingRedemption(true);
    setRedemptionStatus(null);

    try {
      const totalCost = getCartTotal();
      
      if (userPoints < totalCost) {
        throw new Error(`Puntos insuficientes. Tienes: ${userPoints}, Necesitas: ${totalCost}`);
      }

      const redemptionResults = [];
      
      // Process each item in cart
      for (const item of cart) {
        try {
          const result = await processProductRedemption(item, item.quantity);
          redemptionResults.push({
            product: item.name,
            success: true,
            result: result
          });
        } catch (error) {
          redemptionResults.push({
            product: item.name,
            success: false,
            error: error.message
          });
        }
      }

      // Check if all redemptions were successful
      const allSuccessful = redemptionResults.every(r => r.success);
      
      if (allSuccessful) {
        setRedemptionStatus({
          type: 'success',
          message: 'Todos los productos han sido canjeados exitosamente',
          details: redemptionResults
        });
        
        // Clear cart and refresh user points
        setCart([]);
        await fetchUserPoints();
        
        // Update product stock (refresh products)
        const token = getAuthToken();
        const response = await fetch('https://api.sakuraocean.app/product', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || data);
        }
        
      } else {
        const failedItems = redemptionResults.filter(r => !r.success);
        setRedemptionStatus({
          type: 'partial',
          message: `${failedItems.length} productos no pudieron ser canjeados`,
          details: redemptionResults
        });
      }

    } catch (error) {
      setRedemptionStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setProcessingRedemption(false);
      
      // Auto-hide status message after 5 seconds
      setTimeout(() => {
        setRedemptionStatus(null);
      }, 5000);
    }
  };

  // Add to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.units) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update cart quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Retry with fresh token
  const retryWithAuth = () => {
    const token = getAuthToken();
    if (token) {
      setError(null);
      setLoading(true);
      window.location.reload();
    } else {
      setError('No se encontró token de autenticación. Por favor, inicia sesión.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-[#0d542b]" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
              <p className="text-red-600 mb-6">{error}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={retryWithAuth}
                className="w-full bg-[#0d542b] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Status Messages */}
        {redemptionStatus && (
          <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md w-full mx-4 ${
            redemptionStatus.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : redemptionStatus.type === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700'
              : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
          }`}>
            <div className="flex items-start">
              {redemptionStatus.type === 'success' && <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />}
              {redemptionStatus.type === 'error' && <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />}
              {redemptionStatus.type === 'partial' && <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />}
              <div>
                <p className="font-medium">{redemptionStatus.message}</p>
                {redemptionStatus.details && (
                  <div className="text-sm mt-2">
                    {redemptionStatus.details.map((detail, index) => (
                      <div key={index} className={`${detail.success ? 'text-green-600' : 'text-red-600'}`}>
                        {detail.product}: {detail.success ? '✓ Canjeado' : `✗ ${detail.error}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Points Display */}
        <div className="fixed top-24 left-6 z-40">
          <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-[#0d542b]">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-[#0d542b]">{userPoints} puntos</span>
            </div>
          </div>
        </div>

        {/* Botón flotante del carrito */}
        <div className="fixed top-24 right-6 z-40">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-[#0d542b] relative text-white p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="h-6 w-6" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {getCartItemsCount()}
              </span>
            )}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Grid */}
            <div className={`${showCart ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.url?.replace('undefined/', '') || '/api/placeholder/300/200'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                        <span className="text-sm font-semibold text-gray-600">
                          {product.units} disponibles
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {product.descr}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-green-700 flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {product.price} pts
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.units === 0}
                          className="bg-[#0d542b] text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:bg-green-700"
                        >
                          {product.units === 0 ? 'Agotado' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            {showCart && (
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Carrito de Canjes
                  </h3>

                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Tu carrito está vacío
                    </p>
                  ) : (
                    <div>
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <img
                              src={item.images?.[0]?.url?.replace('undefined/', '') || '/api/placeholder/60/60'}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-800 truncate">
                                {item.name}
                              </h4>
                              <p className="text-sm text-[#0d542b] font-semibold flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                {item.price} pts
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.units}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-2xl font-bold text-[#0d542b] flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 mr-1" />
                            {getCartTotal()} pts
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4 text-sm">
                          <span className="text-gray-600">Puntos disponibles:</span>
                          <span className={`font-semibold ${userPoints >= getCartTotal() ? 'text-green-600' : 'text-red-600'}`}>
                            {userPoints} pts
                          </span>
                        </div>

                        <button 
                          onClick={handleRedemption}
                          disabled={processingRedemption || userPoints < getCartTotal() || cart.length === 0}
                          className="w-full bg-[#0d542b] text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingRedemption ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              <span>Procesando...</span>
                            </>
                          ) : (
                            <>
                              <Star className="h-5 w-5" />
                              <span>Canjear Productos</span>
                            </>
                          )}
                        </button>
                        
                        {userPoints < getCartTotal() && cart.length > 0 && (
                          <p className="text-red-600 text-sm mt-2 text-center">
                            Puntos insuficientes para completar el canje
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer/>
      </div>
    </>
  );
}