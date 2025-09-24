// src/pages/Gallery.jsx
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Gallery() {
  const images = [
    "/assets/img/gallery-1.jpg","/assets/img/gallery-2.jpg","/assets/img/gallery-3.jpg",
    "/assets/img/gallery-4.jpg","/assets/img/gallery-5.jpg","/assets/img/gallery-6.jpg",
  ];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="container-fluid gallery py-5">
      <div className="container">
        <div className="text-center">
          <h1 className="font-dancing-script text-primary">Gallery</h1>
          <h1 className="mb-5">Explore Our Gallery</h1>
        </div>

        <div className="row g-0">
          {images.map((src, i) => (
            <div className={`col-md-${i === 0 || i === 5 ? "6" : "3"}`} key={src}>
              <div className="gallery-item h-100" role="button" onClick={() => { setIndex(i); setOpen(true); }}>
                <img src={src} className="img-fluid w-100 h-100" alt={`g-${i}`} />
                <div className="gallery-icon">
                  <span className="btn btn-primary btn-lg-square"><i className="fa fa-eye"></i></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map(src => ({ src }))}
        />
      </div>
    </div>
  );
}
