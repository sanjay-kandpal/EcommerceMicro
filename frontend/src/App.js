// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/RailwayList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/RailwayForm';
import UpdateRailway from './components/UpdateRailway';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} />
          <Route path="/update/:id" element={<UpdateRailway />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
