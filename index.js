const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://perfumehouse1:2tkIVwWEJAxm8muk@cluster0.emv2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3c5i0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('db connected');
        const perfumeCollection = client.db('Perfumehouse').collection('perfume');
        const orderCollection = client.db('Perfumehouse').collection('order');

        app.get('/perfumes', async (req, res) => {
            const query = {};
            const cursor = perfumeCollection.find(query);
            const perfumes = await cursor.toArray();
            console.log('db con');
            res.send(perfumes);
        })

        app.get('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const perfume = await perfumeCollection.findOne(query);
            res.send(perfume);

        })
        app.post('/perfumes', async (req, res) => {
            const newSpice = req.body;
            const result = await perfumeCollection.insertOne(newSpice);
            res.send(result);
        })
        app.post('/orders', async (req, res) => {
            const stockData = req.body;
            const result = await orderCollection.insertOne(stockData);
            res.send(result);
        })
        

        app.put('/perfume/:id', async (req, res) => {
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
            const result = await perfumeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumeCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Pure spices Running successfully');
})
app.listen(port, () => {
    console.log('listening to port ', port);
})