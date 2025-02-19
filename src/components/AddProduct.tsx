import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function AddProduct() {
  const { categories, products, addProduct, addCategory, fetchCategories } = useStore();
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryId) {
      setError('Пожалуйста, выберите категорию');
      return;
    }
    
    const existingProduct = products.find(p => p.barcode === barcode);
    if (existingProduct) {
      if (confirm('Товар уже существует. Обновить количество?')) {
        await useStore.getState().updateProduct(existingProduct.id, {
          quantity: existingProduct.quantity + Number(quantity)
        });
      }
      return;
    }

    try {
      await addProduct({
        barcode,
        name,
        category_id: Number(categoryId),
        quantity: Number(quantity),
        price: Number(price)
      });

      // Clear form after successful addition
      setBarcode('');
      setName('');
      setCategoryId('');
      setQuantity('');
      setPrice('');
      setError('');
    } catch (err) {
      setError('Ошибка при добавлении товара. Проверьте все поля.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newCategory) {
      try {
        await addCategory(newCategory);
        setNewCategory('');
      } catch (err) {
        setError('Ошибка при добавлении категории');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Добавление товара</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Добавить новую категорию</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Название новой категории"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Добавить категорию
          </button>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Штрих-код</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Отсканируйте штрих-код..."
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Название товара</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Название товара"
            required
            list="product-suggestions"
          />
          <datalist id="product-suggestions">
            {products.map((product) => (
              <option key={product.id} value={product.name} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Количество</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Цена</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Добавить товар
        </button>
      </form>
    </div>
  );
}