import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Inventory() {
  const { products, categories, fetchProducts, fetchCategories } = useStore();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryFilter || product.category_id.toString() === categoryFilter;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const totalValue = filteredProducts.reduce((sum, product) => 
    sum + product.price * product.quantity, 0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Склад</h2>

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr 
                key={product.id} 
                className={product.quantity <= 10 ? 'bg-red-50' : ''}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">Штрих-код: {product.barcode}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {categories.find(c => c.id === product.category_id)?.name}
                </td>
                <td className="px-6 py-4">
                  <span className={product.quantity <= 10 ? 'text-red-600 font-bold' : ''}>
                    {product.quantity}
                  </span>
                  {product.quantity <= 10 && (
                    <span className="ml-2 text-red-600 text-sm">Мало на складе!</span>
                  )}
                </td>
                <td className="px-6 py-4">{product.price} ₽</td>
                <td className="px-6 py-4">{(product.price * product.quantity).toFixed(2)} ₽</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right font-bold">
                Общая стоимость:
              </td>
              <td className="px-6 py-4 font-bold">
                {totalValue.toFixed(2)} ₽
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}