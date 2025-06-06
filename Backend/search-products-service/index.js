const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2');

const app = express()
app.use(cors())
app.use(express.json())



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'imtdb',
})

connection.connect(err => {
    if (err) {
        return console.error('Erro ao conectar:', err.message)
    }
    console.log('Conectado ao MySQL com sucesso')

    // TESTE: SELECT simples
    connection.query('SELECT * FROM products_db.products_tb', (err, results) => {
        if (err) {
            return console.error('Erro ao fazer SELECT:', err.message)
        }
        console.log('Resultado do SELECT:', results)
    })
})


app.post('/search', (req, res) => {
    const { filters } = req.body;

    const layoutSizes = filters.layoutSizes || [];
    const connectivities = filters.connectivities || [];
    const productTypes = filters.productTypes || [];
    const keycapsTypes = filters.keycapsTypes || [];

    connection.query('SELECT * FROM products_db.products_tb', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        let filteredResults = results;

        if (layoutSizes.length > 0) {
            filteredResults = filteredResults.filter(p => layoutSizes.includes(p.layout_size));
        }

        if (connectivities.length > 0) {
            filteredResults = filteredResults.filter(p => connectivities.includes(p.connectivity));
        }

        if (productTypes.length > 0) {
            filteredResults = filteredResults.filter(p => productTypes.includes(p.product_type));
        }

        if (keycapsTypes.length > 0) {
            filteredResults = filteredResults.filter(p => keycapsTypes.includes(p.keycaps_type));
        }
        if (req.body.searchTerm) {
            const searchTerm = req.body.searchTerm.toLowerCase();
            filteredResults = filteredResults.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        res.json(filteredResults);
    });

});
app.get('/product/:title', (req, res) => {
    const productTitle = req.params.title;

    const query = 'SELECT * FROM products_db.products_tb WHERE name = ?'

    connection.query(query, [productTitle], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno do servidor.' })
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' })
        }

        res.json(results[0])
    });
});

const port = 5240
app.listen(port, () => {
    console.clear()
    console.log('----------------------------------------------------')
    console.log(`'search products service' running at port ${port}.`)
    console.log('----------------------------------------------------')
})