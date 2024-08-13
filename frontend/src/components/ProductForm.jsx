// frontend/src/components/ProductForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ProductForm() {
  const [product, setProduct] = useState({ name: '', description: '', price: 0, inStock: true });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`/products/${id}`)
        .then(response => setProduct(response.data))
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.put(`/products/${id}`, product)
        .then(() => navigate(`/products/${id}`))
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5001/products', product)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit' : 'Add'} Product</h1>
      <div>
        <label>Name:</label>
        <input name="name" value={product.name} onChange={handleChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange}></textarea>
      </div>
      <div>
        <label>Price:</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} />
      </div>
      <div>
        <label>
          <input type="checkbox" name="inStock" checked={product.inStock} onChange={handleChange} />
          In Stock
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ProductForm;
