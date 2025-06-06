import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const layoutOptions = ['-', '40%', '60%', '65%', '70%', '75%', '100%'];
const connectivityOptions = ['-', 'USB', 'Bluetooth'];
const productTypeOptions = ['-', 'Keyboard', 'Switch', 'Keycap'];
const keycapsTypeOptions = ['-', 'ABS', 'PBT'];

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  layout_size: layoutOptions[0],
  connectivity: connectivityOptions[0],
  product_type: productTypeOptions[0],
  keycaps_type: keycapsTypeOptions[0],
};

export default function ProductTable() {
  const [products, setProducts] = useState([{ ...emptyProduct }]);

  // Preenche a tabela com os valores do banco de dados
  const loadProducts = (json) => {
    setProducts(json);
  };

  useEffect(() => {}, []);

  // Atualiza o campo do produto na linha específica
  const handleInputChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  // Adiciona linha vazia
  const addProduct = () => {
    setProducts([...products, { ...emptyProduct }]);
  };

  // Remove linha ou limpa se for a última
  const removeProduct = (index) => {
    if (products.length === 1) {
      // limpa a linha
      setProducts([{ ...emptyProduct }]);
    }
    else {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
    }
  };

  const saveProducts = async () => {
    console.log('Produtos:', JSON.stringify(products, null, 2));
  };

  return (
    <div className="p-4">
      {/* Cabeçalho com título e botão de adicionar */}
      <div className="flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Tabela de Produtos </h3>
        <Button label="Adicionar Produto" icon="pi pi-plus" onClick={addProduct} />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Nome </th>
            <th className="border border-gray-300 p-2">Descrição </th>
            <th className="border border-gray-300 p-2">Preço </th>
            <th className="border border-gray-300 p-2">URL Imagem </th>
            <th className="border border-gray-300 p-2">Layout </th>
            <th className="border border-gray-300 p-2">Conectividade </th>
            <th className="border border-gray-300 p-2">Tipo Produto </th>
            <th className="border border-gray-300 p-2">Tipo Keycaps </th>
            <th className="border border-gray-300 p-2">Ações </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={product.image_url}
                  onChange={(e) => handleInputChange(idx, 'image_url', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={product.layout_size}
                  onChange={(e) => handleInputChange(idx, 'layout_size', e.target.value)}
                  className="w-full p-1 border rounded" >
                  {layoutOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={product.connectivity}
                  onChange={(e) => handleInputChange(idx, 'connectivity', e.target.value)}
                  className="w-full p-1 border rounded" >
                  {connectivityOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={product.product_type}
                  onChange={(e) => handleInputChange(idx, 'product_type', e.target.value)}
                  className="w-full p-1 border rounded" >
                  {productTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={product.keycaps_type}
                  onChange={(e) => handleInputChange(idx, 'keycaps_type', e.target.value)}
                  className="w-full p-1 border rounded" >
                  {keycapsTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-sm"
                  onClick={() => removeProduct(idx)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-content-end">
        <Button
          label="Salvar"
          icon="pi pi-save"
          severity="success"
          className="mt-3"
          onClick={saveProducts}
        />
      </div>
    </div>
  );
}
