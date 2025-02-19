import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AddProduct } from './components/AddProduct';
import { SalesPoint } from './components/SalesPoint';
import { Analytics } from './components/Analytics';
import { PriceManagement } from './components/PriceManagement';
import { Inventory } from './components/Inventory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div className="flex items-center py-4">
                  <span className="font-semibold text-gray-500 text-lg">Управление магазином</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Link to="/" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Добавить товары
                  </Link>
                  <Link to="/sales" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Продажи
                  </Link>
                  <Link to="/inventory" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Склад
                  </Link>
                  <Link to="/analytics" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Аналитика
                  </Link>
                  <Link to="/prices" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
                    Управление ценами
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<AddProduct />} />
            <Route path="/sales" element={<SalesPoint />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/prices" element={<PriceManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;