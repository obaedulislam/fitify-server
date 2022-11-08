const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

//MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ypkp6ia.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
      await client.connect();
      console.log("Database connected");
    } catch (error) {
      console.log(error.name, error.message);
    }
  }
dbConnect();


const servicesCollection = client.db("fitiFy").collection("services");

// endpoint
app.post("/add-service", async (req, res) => {
    try {
        const result = await servicesCollection.insertOne(req.body);
            console.log(result);

        if (result.insertedId) {
            res.send({
            success: true,
            message: `Successfully created the ${req.body.name} Service`,
            });
        } else {
            res.send({
            success: false,
            error: "Couldn't Add Services",
            });
        }
        } catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
        }
  });

app.get('/', (req, res) => {
    res.send("FitiFy Server is Running");
})
app.listen(port, () => {
    console.log(`FitiFy Server is Running on Port:  ${port}`);
})