const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vodjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const pdCollection = client.db("emaJohnTwo").collection("products");
    const orderCollection = client.db("emaJohnTwo").collection("orders");
    
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        pdCollection.insertOne(product)
        .then(result => {
            // console.log(result.insertedCount)
            // res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) => {
        pdCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        pdCollection.find({key: req.params.key})
        .toArray((error, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        pdCollection.find({key: { $in: productKeys}})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

  });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = 5000
app.listen(process.env.PORT || port);