const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://craft-ease.web.app"],
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 500;

// craftease
// 221457ahshakib
// mangoDB connection
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.mmdewqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const itemCollection = client.db("craft&artDB").collection("craft and art");

    // for giving data access to the client side
    app.get("/addItem", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    // for data stored in database

    app.post("/addItem", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    });

    // data update

    app.put("/addItem/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = req.body;
      const craft = {
        $set: {
          imageURl: updateCraft.imageURl,
          item_name: updateCraft.item_name,
          price: updateCraft.price,
          rating: updateCraft.rating,
          customize: updateCraft.customize,
          processingTime: updateCraft.processingTime,
          stock: updateCraft.stock,
          category: updateCraft.category,
          description: updateCraft.description,
        },
      };
      const result = await itemCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    // for data delating

    app.delete("/addItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is server");
});

app.listen(port, () => {
  console.log("Server is running");
});
