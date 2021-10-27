const express = require('express');
const app = express();
const port = 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

// geniusMechanic
// 4a6Gvv6Y6cPGVYxf

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6jam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.json(result);
        })
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

console.log('connected to database');
app.get('/', (req, res) => {
    res.send('Running Genius Car Mechanic Server')
})

app.listen(port, () => {
    console.log('listening to port: ', port);
})