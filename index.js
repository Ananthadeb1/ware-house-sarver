const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3c5i0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const spiceCollection = client.db('pure-spices').collection('spice');
        // const orderCollection = client.db('pure-spices').collection('order');

        app.get('/spices', async (req, res) => {
            const query = {};
            const cursor = spiceCollection.find(query);
            const spices = await cursor.toArray();
            res.send(spices);
        })

        app.get('/spice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const spice = await spiceCollection.findOne(query);
            res.send(spice);

        })
        app.post('/spices', async (req, res) => {
            const newSpice = req.body;
            const result = await spiceCollection.insertOne(newSpice);
            res.send(result);
        })
        // app.post('/orders', async (req, res) => {
        //     const stockData = req.body;
        //     const result = await orderCollection.insertOne(stockData);
        //     res.send(result);
        // })

        app.put('/spice/:id', async (req, res) => {
            const id = req.params.id;
            const Quantity = req.body;
            console.log(Quantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: Quantity.newQuantity,
                }
            };
            const result = await spiceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/spice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await spiceCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Pure spices Running successfully')
})
app.listen(port, () => {
    console.log('listening to port ', port)
})