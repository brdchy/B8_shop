import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
}

export function SalesPoint() {
  const { products, addSale } = useStore();
  const [buyerId, setBuyerId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState('');

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      const existingItem = cart.find(item => item.product_id === product.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, {
          product_id: product.id,
          quantity: 1,
          price: product.price,
          name: product.name
        }]);
      }
      setBarcode('');
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      alert(`Доступно только ${product.quantity} единиц товара`);
      return;
    }

    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.20; // 20% НДС
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!buyerId || cart.length === 0) return;

    for (const item of cart) {
      await addSale({
        buyer_id: Number(buyerId),
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        date: new Date().toISOString()
      });
    }

    setCart([]);
    setBuyerId('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Информация о покупателе</h3>
          <input
            type="text"
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            placeholder="Отсканируйте QR-код покупателя..."
            className="w-full p-2 border rounded mb-4"
          />
          
          <form onSubmit={handleBarcodeSubmit} className="mb-4">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Отсканируйте штрих-код товара..."
              className="w-full p-2 border rounded"
              autoFocus
            />
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Корзина</h3>
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Цена: {item.price} ₽</p>
                  <p className="text-sm text-gray-600">Сумма: {(item.price * item.quantity).toFixed(2)} ₽</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                    className="w-16 p-1 border rounded"
                    min="1"
                  />
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 border-t space-y-2">
            <p className="text-gray-600">Подытог: {subtotal.toFixed(2)} ₽</p>
            <p className="text-gray-600">НДС (20%): {tax.toFixed(2)} ₽</p>
            <p className="text-xl font-bold">Итого: {total.toFixed(2)} ₽</p>
            <button
              onClick={handleCheckout}
              disabled={!buyerId || cart.length === 0}
              className="w-full mt-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              Оформить продажу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}