require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const services = {
    userLoginService: { port: process.env.USER_LOGIN_SERVICE_PORT },
    cartService: { port: process.env.CART_SERVICE_PORT },
    orderGenerationService: { port: process.env.ORDER_GENERATION_SERVICE_PORT },
    searchProductsService: { port: process.env.SEARCH_PRODUCTS_SERVICE_PORT },
    adminProductManager: { port: process.env.ADMIN_PRODUCTS_MANAGER_PORT }
};

const eventRoutes = {
    // Registrar os servicos que ouvem os eventos

    UserRegistered: [],
    UserLogged: [],

    CartCheckoutInitiated: [{ service: 'orderGenerationService' }],
    OrderCreated: [],

    ProductSearched: [{ service: 'searchProductsService' }],

    ProductCreated: [{ service: 'searchProductsService' }],
    ProductDeleted: [{ service: 'searchProductsService' }],
    ProductsFetched: [],
};

app.post('/event', async (req, res) => {
    const event = req.body;
    const eventType = event.type;

    if (eventRoutes[eventType]) {
        console.log(`Microsserviços ouvindo o evento '${eventType}':`, eventRoutes[eventType]);
        try {
            const promises = eventRoutes[eventType].map(({ service }) => {
                const { port } = services[service];
                const url = `http://localhost:${port}/event`;
                // console.log(`Enviando evento '${eventType}' para o microsserviço: ${service} na rota: ${url}`);
                return axios.post(url, event);
            });

            await Promise.all(promises);

            console.log(`Evento '${eventType}' enviado com sucesso para os microsserviços ouvintes.`);
        }
        catch (err) {
            console.error(`Erro ao enviar evento '${eventType}':`, err.message);

        }
    }
    else {
        console.log(`Nenhum microsserviço ouvindo o evento '${eventType}'`);
    }
    res.status(200).send({ status: 'Evento processado com sucesso.' });
});

const port = process.env.BUS_PORT
app.listen(port, () => {
    console.clear();
    console.log('----------------------------------------------------')
    console.log(`'Event Bus' running at port ${port}`)
    console.log('----------------------------------------------------')

})