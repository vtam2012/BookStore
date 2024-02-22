const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Config
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
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

    // create a collection of documents
    const bookCollection = client.db("BookInventory").collection("books");

    // insert a book into the db using the post method
    app.post('/upload-book', async (req, res) => {
      const newBook = req.body;
      const result = await bookCollection.insertOne(newBook);
      res.send(result)
    });

    // update a book in the db using the patch method
    app.patch('/book/:id', async (req, res) => {
      const id = req.params.id
      const updatedBookData = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
            ...updatedBookData
        },
     }
      const options = { upsert: true }
      // update
      const result = await bookCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // delete a book from the db using the delete method
    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await bookCollection.deleteOne(filter)
      res.send(result)
    })

    // find by category
    app.get('/all-books', async (req, res) => {
        let query= {}
        if(req.query?.category){
            query = { category: req.query.category }
        }
        const result = await bookCollection.find(query).toArray()
        res.send(result)
    })

    // get all books from the db using the get method
    // app.get('/all-books', async (req, res) => {
    //   const books = bookCollection.find()
    //   const result = await books.toArray()
    //   res.send(result)
    // })


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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})