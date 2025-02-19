import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { supabase } from '../lib/supabase';

export function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [buyerFilter, setBuyerFilter] = useState('all');

  useEffect(() => {
    fetchSalesData();
  }, [dateRange, categoryFilter, buyerFilter]);

  const fetchSalesData = async () => {
    let query = supabase
      .from('sales')
      .select(`
        *,
        products (
          name,
          category_id,
          categories (name)
        ),
        buyers (name)
      `);

    if (dateRange === 'week') {
      query = query.gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    } else if (dateRange === 'month') {
      query = query.gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    }

    const { data, error } = await query;
    if (error) console.error('Ошибка при получении данных о продажах:', error);
    else setSalesData(data || []);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Аналитика продаж</h2>
      
      <div className="mb-6 flex gap-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="week">Последняя неделя</option>
          <option value="month">Последний месяц</option>
          <option value="all">Все время</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Все категории</option>
          {/* Добавить категории динамически */}
        </select>

        <select
          value={buyerFilter}
          onChange={(e) => setBuyerFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Все покупатели</option>
          {/* Добавить покупателей динамически */}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Продажи по времени</h3>
          <LineChart width={500} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_price" name="Сумма продаж" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Продажи по категориям</h3>
          <BarChart width={500} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="products.categories.name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_price" name="Сумма продаж" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-bold p-4 border-b">История продаж</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Покупатель</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((sale: any) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.buyers?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.products?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.total_price} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}