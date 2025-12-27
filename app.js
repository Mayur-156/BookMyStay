const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride =require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/bookMyStay"

main()
    .then( () => {
        console.log("Connected to DB");                              
    })
    .catch((err) => { 
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
    
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("hi , I am Root");
});


//index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}); 

//New Listing
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
});

//Show Route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});``
}); 

//Create Route
app.post("/listings", async (req , res) => {
    //first we get form data so first thing we do ===> let {title, description, image, price, country,location} = req.body;
    //secode thing we do create object in new.ejs
    // on the place of this we write some thing short let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await  newListing.save();
    res.redirect("/listings");
});

//Editr route
app.get("/listings/:id/edit",async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//update route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

});

//DELETE Route

app.delete("/listing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// app.delete("/listings/:id", async(req , res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// });

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         decompression: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successful testing");
// });

app.listen(8080, () => {
    console.log("server is run on 8080 port");
});