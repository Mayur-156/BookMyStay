const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema } = require("./Schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bookMyStay";

// DB Connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// App Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am Root");
});

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(" ,"); 
    throw new  ExpressError(400, errMsg);
  }else{
    next();
  }
};

// INDEX Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// NEW Route
app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }
  res.render("listings/show.ejs", { listing });
}));

// CREATE Route
app.post("/listings", validateListing, wrapAsync(async (req, res , next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// EDIT Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// DELETE Route  FIXED
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// 404 Handler (ALWAYS LAST ROUTE)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  //res.status(statusCode).send(message);
  res.render("error.ejs", {message});
});


// Server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
