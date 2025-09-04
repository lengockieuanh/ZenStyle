import React, { useState } from "react";
import styles from "./css/App.module.css"; 

  const hotels = [
  { 
    id: 1, 
    name: "Wink Hotel Saigon Centre", 
    rooms: 237, 
    location: "HCMC", 
    description: "Wink Hotel Saigon Centre shares the neighborhood...", 
    image: "/assets/img/shampoo.jpg" 
  },
  { 
    id: 2, 
    name: "Wink Hotel Danang Centre", 
    rooms: 244, 
    location: "DaNang", 
    description: "A neighborhood hub designed for innovation...", 
    image: "/assets/img/wax.jpg" 
  },
  { 
    id: 3, 
    name: "Wink Icon Danang", 
    rooms: 322, 
    location: "HaNoi", 
    description: "Stay at the iconic Wink Icon Danang...", 
    image: "/assets/img/massage.jpg" 
  },
  { 
    id: 4, 
    name: "Wink Hotel Can Tho Riverside", 
    rooms: 180, 
    location: "CanTho", 
    description: "Relax by the Mekong river with a vibrant city view...", 
    image: "/assets/img/tinhdau.jpg" 
  },
  { 
    id: 5, 
    name: "Wink Hotel Tuy Hoa Beach", 
    rooms: 150, 
    location: "TuyHoa", 
    description: "Enjoy sunny beaches and fresh seafood in Tuy Hoa...", 
    image: "/assets/img/nuochoa.jpg" 
  },
  { 
    id: 6, 
    name: "Wink Hotel Hai Phong Central", 
    rooms: 210, 
    location: "HaiPhong", 
    description: "A modern hub in the bustling Hai Phong city center...", 
    image: "/assets/img/daugoidau.jpg" 
  }
];



function ProductList() {
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filteredHotels = selectedLocation === "All"
    ? hotels
    : hotels.filter((hotel) => hotel.location === selectedLocation);

  return (
    <div>
      {/* Thanh filter */}
      <div className={styles.filterBar}>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="All">ALL LOCATION</option>
          <option value="HCMC">HCMC</option>
          <option value="DaNang">DANANG</option>
          <option value="HaNoi">HANOI</option>
        </select>
      </div>

      {/* Danh sách hotel */}
      <div className={styles.hotelList}>
        {filteredHotels.map((hotel) => (
          <div className={styles.hotelCard} key={hotel.id}>
            <img src={hotel.image} alt={hotel.name} />
            <div className={styles.hotelInfo}>
              <h2>{hotel.name}</h2>
              <p className={styles.meta}>
                🏨 {hotel.rooms} ROOMS • 📍 {hotel.location}
              </p>
              <p className={styles.desc}>{hotel.description}</p>
              <button className={styles.btn}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
