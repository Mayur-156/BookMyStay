const cities = ["Goa", "Mumbai", "Manali", "Udaipur", "Kerala", "Jaipur", "Rishikesh", "Shimla", "Puducherry", "Darjeeling"];
const stays = ["Villa", "Cottage", "Apartment", "Resort", "HomeStay", "Cabin", "Penthouse", "Studio", "Bungalow", "Heritage Suite"];

// A list of verified, real Unsplash image IDs for vacation rentals
const realImages = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
];

const sampleData = [];

for (let i = 1; i <= 100; i++) {
    const city = cities[i % cities.length];
    const stayType = stays[i % stays.length];
    
    // Picks one of the real images and adds formatting parameters
    const baseImg = realImages[i % realImages.length];
    const finalImg = `${baseImg}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60`;

    sampleData.push({
        title: `${city} ${stayType} ${i}`,
        description: `Experience the beauty of ${city} in this amazing ${stayType}. Perfect for a relaxing vacation.`,
        image: finalImg,
        price: 1200 + (i * 40), 
        location: city,
        country: "India"
    });
}

module.exports = { data: sampleData };