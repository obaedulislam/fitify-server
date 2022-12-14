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
      const cursorLimit = servicesCollection.find({}).sort({_id : -1});
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
Review Collection Start
========================*/
const reviewCollection = client.db("fitiFy").collection("reviews");
app.post("/review", async (req, res) => {
  try {
      const result = await reviewCollection.insertOne(req.body);
      console.log(result);

      if (result.insertedId) {
          res.send({
          success: true,
          message: `Successfully created the ${req.body.review_text} `,
          });
      } else {
          res.send({
          success: false,
          error: "Couldn't Add Review",
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

//Get Review Data From Mongo Db And Send it To the client
  app.get("/review", async (req, res) => {
    try {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
  
      res.send({
        success: true,
        message: "Successfully got the data",
        data: reviews,
      });
    } catch (error) {
      console.log(error.name.bgRed, error.message.bold);
      res.send({
        success: false,
        error: error.message,
      });
    }
  });

  //Get Single Service Review Data Using Query(Email) Mongo Db And Send it To the client
  //   app.get('/singleservicereview', async (req, res) => {
  //     let query = {};
  //     if(req.query.serviceId){
  //       query ={
  //         serviceId: req.query.serviceId
  //       }
  //     }
  //     const cursor = reviewCollection.find(query);
  //     const singleservicereview = await cursor.toArray();
  //     console.log(singleservicereview);
  //     res.send(singleservicereview);
  // });


//get the reviews for particular service from the database
  app.get('/reviews', async (req, res) => {
    try {
        let query = {};
        if (req.query.serviceId) {
            query = {
                serviceId: req.query.serviceId
            }
        }
        const cursor = reviewCollection.find(query).sort({ _id: -1 });
        const reviews = await cursor.toArray();
        res.send({
            status: true,
            reviews: reviews,
        })

    } catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            status: false,
            error: error.message
        })
    }
  })


  //Get My Review Data Using Query(Email) Mongo Db And Send it To the client
  app.get('/myreview', async (req, res) => {
      let query = {};
      if(req.query.email){
        query ={
          email: req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const myreviews = await cursor.toArray();
      console.log(myreviews);
      res.send(myreviews);
  });

  //Delete User Specific Review Mongo Db And Send it To the client
  app.delete("/myreview/:id", async (req, res) => {
    const id= req.params.id;
  
    try {
      const myreview = await reviewCollection.findOne({ _id: ObjectId(id) });
  
      if (!myreview?._id) {
        res.send({
          success: false,
          error: "Review doesn't exist",
        });
        return;
      }
  
      const result = await reviewCollection.deleteOne({ _id: ObjectId(id) });
  
      if (result.deletedCount) {
        res.send({
          success: true,
          message: `Successfully deleted the ${myreview.review_text}`,
        });
      } else {
      }
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });

//Get User Specific Review Data  Mongo Db And Send it To the client
app.get('/review/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const review = await reviewCollection.findOne({ _id: ObjectId(id) });
      res.send({
          status: true,
          review: review
      })

  } catch (error) {
      console.log(error.name.bgRed, error, message.bold);
      res.send({
          status: false,
          error: error.message
      })
  }
})

//Create the API with patch
app.patch('/review/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });
      console.log(result);
      if (result.matchedCount) {
          res.send({
              status: true,
              message: `Successfully updated your review for ${req.body.serviceName}`
          })
      } else {
          res.send({
              status: false,
              error: "Couldn't update the product"
          })
      }
  } catch (error) {
      console.log(error.name.bgRed, error.message.bold);
      res.send({
          status: false,
          error: error.message
      })
  }
})



/* =====================
Review Collection End
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