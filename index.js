const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.czlkgnu.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const toys_collection = client.db("girls-toys").collection("toys");

    const indexKey = { name: 1 }
    const indexOption = { name: "toy_name" }
    await toys_collection.createIndex(indexKey, indexOption);

    app.get("/toys", async (req, res) => {
        const toys = toys_collection.find().limit(20)
        const result = await toys.toArray()
        res.send(result)
    })

    app.get("/toy/:id", async (req, res) => {
        const id = req.params.id;
        const toy = await toys_collection.findOne({ _id: new ObjectId(id) })
        res.send(toy)
    })

    app.get('/seller', async (req, res) => {
        console.log(req.query.email);
        let query = {};
        if (req.query?.email) {
            query = { seller_email: req.query.email }
        }
        const result = await toys_collection.find(query).toArray();
        res.send(result);
    })

    app.get('/tabs', async (req, res) => {
        let query = {};
        if (req.query?.sub_category) {
            query = { sub_category: req.query.sub_category }
        }
        const result = await toys_collection.find(query).toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server side is Running ....')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})