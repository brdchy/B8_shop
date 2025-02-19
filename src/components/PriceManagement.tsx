import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function PriceManagement() {
  const { products, categories, updateProduct, fetchProducts, fetchCategories } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [newPrice, setNewPrice] = useState('');
  const [percentageIncrease, setPercentageIncrease] = useState('');
  const [autoIncreasePercentage, setAutoIncreasePercentage] = useState('');
  const [isAutoIncreaseEnabled, setIsAutoIncreaseEnabled] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isAutoIncreaseEnabled && autoIncreasePercentage) {
      interval = window.setInterval(() => {
        handleAutoIncrease();
      }, 60 * 60 * 1000); // Каждый час
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoIncreaseEnabled, autoIncreasePercentage]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryFilter || product.category_id.toString() === categoryFilter;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleUpdatePrices = async () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;

    for (const productId of selectedProducts) {
      await updateProduct(productId, { price });
    }

    setSelectedProducts([]);
    setNewPrice('');
  };

  const handlePercentageIncrease = async () => {
    const percentage = parseFloat(percentageIncrease);
    if (isNaN(percentage) || percentage < 0) return;

    const multiplier = 1 + (percentage / 100);
    
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      if (product) {
        const newPrice = product.price * multiplier;
        await updateProduct(productId, { price: Number(newPrice.toFixed(2)) });
      }
    }

    setSelectedProducts([]);
    setPercentageIncrease('');
  };

  const handleAutoIncrease = async () => {
    const percentage = parseFloat(autoIncreasePercentage);
    if (isNaN(percentage) || percentage < 0) return;

    const multiplier = 1 + (percentage / 100);
    
    for (const product of products) {
      const newPrice = product.price * multiplier;
      await updateProduct(product.id, { price: Number(newPrice.toFixed(2)) });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Управление ценами</h2>

      <div className="mb-6 flex gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск товаров..."
          className="flex-1 p-2 border rounded"
        />
      </div>

      {selectedProducts.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Новая цена"
              className="p-2 border rounded"
              min="0"
              step="0.01"
            />
            <button
              onClick={handleUpdatePrices}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Обновить цены ({selectedProducts.length} выбрано)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={percentageIncrease}
              onChange={(e) => setPercentageIncrease(e.target.value)}
              placeholder="Процент повышения"
              className="p-2 border rounded"
              min="0"
              step="0.1"
            />
            <span className="text-gray-600">%</span>
            <button
              onClick={handlePercentageIncrease}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Повысить цены
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-4">Автоматическое повышение цен</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAutoIncreaseEnabled}
              onChange={(e) => setIsAutoIncreaseEnabled(e.target.checked)}
              className="form-checkbox"
            />
            <span>Включить автоповышение</span>
          </label>
          <input
            type="number"
            value={autoIncreasePercentage}
            onChange={(e) => setAutoIncreasePercentage(e.target.value)}
            placeholder="Процент повышения"
            className="p-2 border rounded"
            min="0"
            step="0.1"
          />
          <span className="text-gray-600">% в час</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === filteredProducts.length}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Текущая цена</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">Штрих-код: {product.barcode}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {categories.find(c => c.id === product.category_id)?.name}
                </td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">{product.price} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}