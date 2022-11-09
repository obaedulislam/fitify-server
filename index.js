const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const  ObjectId = require('mongodb').ObjectId;

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

/* =====================
Service Collection Start
========================*/
const servicesCollection = client.db("fitiFy").collection("services");

// Add Service to MongoDb Using Post Method
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

  //Get Services Data From Mongo Db And Send it To the client
  app.get("/services", async (req, res) => {
    try {
      const cursor = servicesCollection.find({});
      const cursorLimit = servicesCollection.find({});
      const services = await cursor.toArray();
      const servicesLimit = await cursorLimit.limit(3).toArray();
  
      res.send({
        success: true,
        message: "Successfully got the data",
        data: services,
        dataLimit: servicesLimit
      });
    } catch (error) {
      console.log(error.name.bgRed, error.message.bold);
      res.send({
        success: false,
        error: error.message,
      });
    }
  });

  //Get Single Service Data From Mongo Db And Send it To the client
  app.get("/service/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const service = await servicesCollection.findOne({ _id: ObjectId(id) });
      res.send({
        success: true,
        data: service
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });
/* =====================
Service Collection End
========================*/

/* =====================
Blog Collection Start
========================*/
const blogCollection = client.db("fitiFy").collection("blog");

  //Get Blog Data From Mongo Db And Send it To the client
  app.get("/blogs", async (req, res) => {
    try {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();
  
      res.send({
        success: true,
        message: "Successfully got the data",
        data: blogs
      });
    } catch (error) {
      console.log(error.name.bgRed, error.message.bold);
      res.send({
        success: false,
        error: error.message,
      });
    }
  });
/* =====================
Blog Collection End
========================*/

app.get('/', (req, res) => {
  res.send('Car Hub server is Running Now');
})

app.listen(port, () => {
    console.log(`FitiFy Server is Running on Port:  ${port}`);
})