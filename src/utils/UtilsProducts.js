const products = [
    // 🧥 WOMEN'S CLOTHES
    
    {
        id: "mw3",
        title: "Elegant Black Blazer",
        description: "Tailored blazer with satin lapels, perfect for office or evening events.",
        price: 45.99,
        images: ["/mw3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw4",
        title: "Floral Maxi Dress",
        description: "Flowing maxi dress with delicate floral print and adjustable straps.",
        price: 38.50,
        images: ["/mw4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw5",
        title: "Denim High-Waist Jeans",
        description: "Classic blue jeans with high waist and slight stretch for comfort.",
        price: 29.99,
        images: ["/mw5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw6",
        title: "Cashmere Blend Sweater",
        description: "Soft cashmere blend pullover in cream with ribbed details.",
        price: 52.00,
        images: ["/mw6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw7",
        title: "Silk Blouse with Bow",
        description: "Elegant silk blouse with neck tie detail, available in ivory.",
        price: 41.75,
        images: ["/mw7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw8",
        title: "Pleated Midi Skirt",
        description: "Flowing pleated skirt in navy blue, ideal for any season.",
        price: 34.25,
        images: ["/mw8.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw9",
        title: "Leather Biker Jacket",
        description: "Edgy black leather jacket with asymmetric zipper and silver hardware.",
        price: 89.99,
        images: ["/mw9.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw10",
        title: "Striped Breton Top",
        description: "Classic navy and white striped cotton top with boat neck.",
        price: 22.50,
        images: ["/mw10.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw11",
        title: "Wool Trench Coat",
        description: "Double-breasted trench coat in camel with belt detail.",
        price: 95.00,
        images: ["/mw11.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw12",
        title: "Linen Summer Jumpsuit",
        description: "Breezy linen jumpsuit with wide legs and tie waist in terracotta.",
        price: 44.99,
        images: ["/mw12.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw13",
        title: "Velvet Evening Dress",
        description: "Luxurious emerald green velvet dress with V-neck and midi length.",
        price: 67.50,
        images: ["/mw13.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw14",
        title: "Cropped Cardigan",
        description: "Soft knit cardigan in blush pink with pearl button closure.",
        price: 28.00,
        images: ["/mw14.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw15",
        title: "Wide-Leg Palazzo Pants",
        description: "Elegant wide-leg pants in black with high waist and side zipper.",
        price: 36.75,
        images: ["/mw15.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw16",
        title: "Bohemian Tunic Dress",
        description: "Embroidered tunic dress with bell sleeves in white cotton.",
        price: 39.99,
        images: ["/mw16.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw17",
        title: "Quilted Puffer Vest",
        description: "Lightweight puffer vest in burgundy with gold zipper detail.",
        price: 42.50,
        images: ["/mw17.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw18",
        title: "Wrap Mini Dress",
        description: "Flirty wrap dress with floral pattern and ruffle hem.",
        price: 35.00,
        images: ["/mw18.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw19",
        title: "Turtleneck Knit Dress",
        description: "Cozy midi knit dress in charcoal gray with ribbed texture.",
        price: 48.25,
        images: ["/mw19.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw20",
        title: "Satin Slip Skirt",
        description: "Elegant bias-cut satin skirt in champagne with elastic waist.",
        price: 31.99,
        images: ["/mw20.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw21",
        title: "Oversized Denim Jacket",
        description: "Vintage-wash oversized denim jacket with distressed details.",
        price: 54.00,
        images: ["/mw21.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw22",
        title: "Printed Palazzo Romper",
        description: "Elegant wide-leg romper with tropical print and keyhole back.",
        price: 43.50,
        images: ["/mw22.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },

    // 👔 MEN'S CLOTHING 
    
    {
        id: "mh2",
        title: "Casual Hooded Jacket",
        description: "Color-block design, perfect for autumn.",
        price: 19.91,
        images: ["/mh2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh3",
        title: "Plaid Flannel Shirt",
        description: "Soft cotton flannel shirt in red and black plaid with button-down collar.",
        price: 32.50,
        images: ["/mh3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh4",
        title: "Slim Fit Chinos",
        description: "Versatile khaki chinos with modern slim fit and stretch fabric.",
        price: 38.99,
        images: ["/mh4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh5",
        title: "Quilted Vest",
        description: "Lightweight navy quilted vest with zip closure and side pockets.",
        price: 45.75,
        images: ["/mh5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh6",
        title: "Crew Neck T-Shirt",
        description: "Premium cotton t-shirt in charcoal grey with comfortable fit.",
        price: 18.50,
        images: ["/mh6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh7",
        title: "Denim Jeans",
        description: "Classic straight-leg jeans in medium wash with five-pocket design.",
        price: 42.00,
        images: ["/mh7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },

    // 🧒 CHILDREN'S CLOTHING 
    {
        id: "mi1",
        title: "Boys Dinosaur Tracksuit",
        description: "Sweatshirt and jogging pants with dinosaur print.",
        price: 5.66,
        images: ["/mi1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg", "/free.png"],
        category: "children",
        filter: "Clothing",
        freeCode: "FREE123"
    },
    {
        id: "mi2",
        title: "Yellow Embroidered Dress",
        description: "Summer dress with floral embroidery for girls.",
        price: 5.12,
        images: ["/mi2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi3",
        title: "Striped Long-Sleeve Shirt",
        description: "Comfortable cotton shirt with colorful horizontal stripes.",
        price: 12.50,
        images: ["/mi3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi4",
        title: "Denim Overalls",
        description: "Classic denim overalls with adjustable straps and front pocket.",
        price: 24.99,
        images: ["/mi4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi5",
        title: "Hooded Raincoat",
        description: "Waterproof yellow raincoat with hood and snap closure.",
        price: 19.75,
        images: ["/mi5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi6",
        title: "Graphic Print T-Shirt",
        description: "Fun t-shirt with space rocket design and glow-in-the-dark details.",
        price: 9.99,
        images: ["/mi6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi7",
        title: "Tutu Skirt",
        description: "Pink layered tulle skirt with elastic waistband, perfect for dress-up.",
        price: 14.50,
        images: ["/mi7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi8",
        title: "Fleece Hoodie",
        description: "Soft fleece hoodie in navy blue with kangaroo pocket.",
        price: 18.25,
        images: ["/mi8.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi9",
        title: "Cargo Shorts",
        description: "Comfortable khaki cargo shorts with multiple pockets.",
        price: 16.99,
        images: ["/mi9.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi10",
        title: "Puffer Jacket",
        description: "Warm insulated jacket in bright red with zip and snap closure.",
        price: 34.50,
        images: ["/mi10.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi11",
        title: "Leggings Set",
        description: "Cotton leggings in rainbow colors, pack of three.",
        price: 15.75,
        images: ["/mi11.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi12",
        title: "Checkered Button-Up Shirt",
        description: "Long-sleeve shirt in blue and white gingham check.",
        price: 17.50,
        images: ["/mi12.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },

    // 👜 WOMEN'S ACCESSORIES
    {
        id: "aw1",
        title: "Leather Handbag with Chain Strap",
        description: "Elegant shoulder bag made of soft leather with gold chain details.",
        price: 24.50,
        images: ["/aw1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw3",
        title: "Silk Scarf with Paisley Print",
        description: "Luxurious silk scarf in vibrant colors with classic paisley pattern.",
        price: 34.99,
        images: ["/aw3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw4",
        title: "Wide-Brim Straw Hat",
        description: "Summer straw hat with black ribbon detail, perfect for sun protection.",
        price: 27.50,
        images: ["/aw4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw5",
        title: "Leather Crossbody Bag",
        description: "Compact cognac leather crossbody with adjustable strap and multiple compartments.",
        price: 42.75,
        images: ["/aw5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw6",
        title: "Pearl Drop Earrings",
        description: "Elegant gold-tone earrings with freshwater pearl drops.",
        price: 19.99,
        images: ["/aw6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw7",
        title: "Cashmere Wrap Shawl",
        description: "Soft cashmere blend shawl in dove gray, perfect for layering.",
        price: 56.00,
        images: ["/aw7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },


    // 👠 WOMEN'S FOOTWEAR 
    {
        id: "aw2",
        title: "Classic Heeled Sandals",
        description: "Beige open-toe sandals with adjustable strap and medium heel.",
        price: 28.75,
        images: ["/aw2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },
    {
        id: "aw8",
        title: "Ankle Boots",
        description: "Black leather ankle boots with low heel and inside zipper closure.",
        price: 65.00,
        images: ["/aw8.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },
    {
        id: "aw9",
        title: "Ballet Flats",
        description: "Comfortable nude ballet flats with bow detail and cushioned insole.",
        price: 34.99,
        images: ["/aw9.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },
    {
        id: "aw10",
        title: "White Canvas Sneakers",
        description: "Classic low-top sneakers with lace-up design and rubber sole.",
        price: 42.50,
        images: ["/aw10.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },
    {
        id: "aw11",
        title: "Platform Sandals",
        description: "Summer platform sandals with cork heel and leather straps.",
        price: 48.75,
        images: ["/aw11.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },
    {
        id: "aw12",
        title: "Knee-High Boots",
        description: "Brown suede boots with block heel and inside zipper.",
        price: 89.00,
        images: ["/aw12.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },

    // 👞 MEN'S FOOTWEAR
    {
        id: "am2",
        title: "Casual Sneakers",
        description: "Comfortable men's sneakers with breathable mesh design.",
        price: 22.35,
        images: ["/am2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am3",
        title: "Oxford Leather Shoes",
        description: "Classic black leather Oxford shoes with lace-up closure, perfect for formal occasions.",
        price: 65.99,
        images: ["/am3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am4",
        title: "Suede Chelsea Boots",
        description: "Brown suede Chelsea boots with elastic side panels and rubber sole.",
        price: 78.50,
        images: ["/am4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am5",
        title: "Running Trainers",
        description: "Lightweight running shoes with cushioned sole and breathable mesh upper.",
        price: 54.99,
        images: ["/am5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am6",
        title: "Canvas Slip-On Shoes",
        description: "Casual navy canvas slip-ons with padded collar and flexible sole.",
        price: 32.00,
        images: ["/am6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am7",
        title: "Hiking Boots",
        description: "Waterproof hiking boots with ankle support and rugged tread pattern.",
        price: 89.75,
        images: ["/am7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am8",
        title: "Loafers with Tassels",
        description: "Elegant burgundy leather loafers with decorative tassel detail.",
        price: 71.25,
        images: ["/am8.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am9",
        title: "High-Top Basketball Sneakers",
        description: "Retro-style basketball sneakers with padded ankle support and rubber sole.",
        price: 67.99,
        images: ["/am9.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am10",
        title: "Desert Boots",
        description: "Tan suede desert boots with crepe sole and two-eyelet lacing.",
        price: 58.50,
        images: ["/am10.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am11",
        title: "Leather Boat Shoes",
        description: "Classic brown leather boat shoes with non-marking sole and rawhide laces.",
        price: 52.00,
        images: ["/am11.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am12",
        title: "Work Boots with Steel Toe",
        description: "Heavy-duty work boots with steel toe cap and oil-resistant sole.",
        price: 95.99,
        images: ["/am12.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am13",
        title: "Minimalist White Sneakers",
        description: "Clean white leather sneakers with subtle branding and comfortable fit.",
        price: 49.75,
        images: ["/am13.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am14",
        title: "Monk Strap Dress Shoes",
        description: "Sophisticated black leather shoes with double monk strap closure.",
        price: 82.50,
        images: ["/am14.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am15",
        title: "Trail Running Shoes",
        description: "All-terrain trail runners with aggressive tread and quick-dry mesh.",
        price: 72.99,
        images: ["/am15.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am16",
        title: "Brogue Wingtip Shoes",
        description: "Tan leather brogues with traditional wingtip design and perforated details.",
        price: 76.00,
        images: ["/am16.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am17",
        title: "Slide Sandals",
        description: "Comfortable black slide sandals with cushioned footbed and adjustable strap.",
        price: 28.50,
        images: ["/am17.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am18",
        title: "Chukka Boots",
        description: "Versatile gray suede chukka boots with two-eyelet design.",
        price: 64.75,
        images: ["/am18.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am19",
        title: "Cross-Training Shoes",
        description: "Multi-purpose training shoes with lateral support and flexible forefoot.",
        price: 61.99,
        images: ["/am19.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am20",
        title: "Espadrilles",
        description: "Summer canvas espadrilles with jute rope sole in navy blue.",
        price: 36.25,
        images: ["/am20.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am21",
        title: "Combat Boots",
        description: "Military-inspired black leather boots with lace-up front and side zipper.",
        price: 87.50,
        images: ["/am21.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    {
        id: "am22",
        title: "Driving Moccasins",
        description: "Soft leather driving shoes with rubber pebble sole and comfort fit.",
        price: 55.00,
        images: ["/am22.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },
    

    // 🎩 MEN'S ACCESSORIES
    {
        id: "am1",
        title: "Brown Leather Belt",
        description: "Classic genuine leather belt with metal buckle.",
        price: 12.90,
        images: ["/am1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am23",
        title: "Leather Wallet with RFID",
        description: "Bi-fold leather wallet with RFID protection and multiple card slots.",
        price: 29.99,
        images: ["/am23.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am24",
        title: "Wool Flat Cap",
        description: "Classic tweed flat cap in herringbone pattern with satin lining.",
        price: 24.50,
        images: ["/am24.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am25",
        title: "Silk Necktie Set",
        description: "Set of three silk ties in coordinating colors with matching pocket squares.",
        price: 38.75,
        images: ["/am25.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am26",
        title: "Leather Messenger Bag",
        description: "Professional brown leather messenger bag with laptop compartment.",
        price: 89.99,
        images: ["/am26.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am27",
        title: "Sunglasses with Polarized Lenses",
        description: "Classic aviator sunglasses with UV protection and polarized lenses.",
        price: 45.00,
        images: ["/am27.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },

    // 🎒 CHILDREN'S ACCESSORIES
    {
        id: "ac1",
        title: "Kids Dinosaur Cap",
        description: "Fun green cap with 3D dinosaur spikes and adjustable strap.",
        price: 6.25,
        images: ["/ac1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac3",
        title: "Unicorn Backpack",
        description: "Sparkly pink backpack with 3D unicorn horn and rainbow details.",
        price: 18.99,
        images: ["/ac3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac4",
        title: "Character Lunch Box",
        description: "Insulated lunch box featuring favorite cartoon characters with handle.",
        price: 12.50,
        images: ["/ac4.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac5",
        title: "Knit Beanie with Pom-Pom",
        description: "Warm winter beanie in bright colors with oversized pom-pom.",
        price: 9.75,
        images: ["/ac5.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac6",
        title: "Kids Sunglasses",
        description: "Durable rubber-frame sunglasses with UV protection in fun colors.",
        price: 11.99,
        images: ["/ac6.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac7",
        title: "Patterned Hair Bows Set",
        description: "Set of five colorful hair bows with alligator clips.",
        price: 8.50,
        images: ["/ac7.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    

    // 👟 CHILDREN'S FOOTWEAR
    {
        id: "ac2",
        title: "Light-Up Sneakers",
        description: "Pink LED sneakers with glitter details and velcro closure.",
        price: 14.80,
        images: ["/ac2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },
    {
        id: "ac8",
        title: "Character Rain Boots",
        description: "Waterproof rubber boots with colorful animal print and easy pull-on handles.",
        price: 16.50,
        images: ["/ac8.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },
    {
        id: "ac9",
        title: "Canvas High-Tops",
        description: "Kids' high-top sneakers in bright red with lace-up design.",
        price: 22.99,
        images: ["/ac9.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },
    {
        id: "ac10",
        title: "Mary Jane Shoes",
        description: "Classic black patent leather shoes with strap and bow detail.",
        price: 24.50,
        images: ["/ac10.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },
    {
        id: "ac11",
        title: "Sport Sandals",
        description: "Adjustable water-friendly sandals with cushioned footbed.",
        price: 18.75,
        images: ["/ac11.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },
    {
        id: "ac12",
        title: "Winter Snow Boots",
        description: "Insulated boots with faux fur lining and non-slip sole.",
        price: 32.00,
        images: ["/ac12.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    }, 
    

    // 🏋️ SPORTS CLOTHING 
    {
        id: "md1",
        title: "Women's Gym Jacket",
        description: "Sports jacket with high collar and zipper closure.",
        price: 11.57,
        images: ["/md1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg", "/free.png"],
        category: "sports",
        filter: "Clothing",
        freeCode: "FREE123"
    },
    {
        id: "md2",
        title: "Red Sports Set",
        description: "Jacket and jeggings with letter print design.",
        price: 13.12,
        images: ["/md2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "sports",
        filter: "Clothing"
    },

    // ****** INTERRUPTION FREE COAT ******
    {
        id: "mw1",
        title: "Green Coat",
        description: "Long winter coat with fleece lining and classic style.",
        price: 19.03,
        images: ["/mw1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg", "/free.png"],
        category: "women",
        filter: "Clothing",
        freeCode: "FREE123"
    },
    {
        id: "mw2",
        title: "Pink Summer Dress",
        description: "Sleeveless pink dress, perfect for the beach.",
        price: 32.99,
        images: ["/mw2.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mh1",
        title: "Green Bomber Jacket",
        description: "Lightweight jacket with high collar and embroidery.",
        price: 11.06,
        images: ["/mh1.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg", "/free.png"],
        category: "men",
        filter: "Clothing",
        freeCode: "FREE123"
    },
    // ************************************

    {
        id: "md3",
        title: "Compression Leggings",
        description: "High-performance leggings with moisture-wicking fabric and mesh panels.",
        price: 32.50,
        images: ["/md3.jpg", "/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "sports",
        filter: "Clothing"
    },

    // 🏠 Home (no products available)
];


export const getProducts = () => {
    return products;
}

export const getProduct = (id) => {
    return products.find(product => product.id === id);
}

