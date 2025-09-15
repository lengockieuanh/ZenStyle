// import { Link, NavLink } from "react-router-dom";
// import { useState } from "react";

// export default function Nav() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="container-fluid bg-light sticky-top p-0">
//       <nav className="navbar navbar-expand-lg navbar-light p-0">
//         <Link to="/" className="navbar-brand bg-primary py-4 px-5 me-0">
//           <h1 className="mb-0"><i className="bi bi-scissors"></i>ZenStyle</h1>
//         </Link>

//         <div className="navbar-nav mx-auto"></div>

//         <div className="d-flex ms-lg-3 gap-2">
//           <Link to="/login" className="btn btn-outline-primary">Log in</Link>
//           {/* <Link to="/signup" className="btn btn-primary">Sign up</Link> */}
//         </div>

//         <button type="button" className="navbar-toggler me-4" onClick={() => setOpen(!open)}>
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className={`collapse navbar-collapse p-3 ${open ? "show" : ""}`}>
//           <div className="navbar-nav mx-auto">
//             <NavLink to="/" end className="nav-item nav-link">Home</NavLink>
//             <NavLink to="/services" className="nav-item nav-link">Service</NavLink>
//             <NavLink to="/gallery" className="nav-item nav-link">Product</NavLink>
//             <NavLink to="/price" className="nav-item nav-link">Price</NavLink>
//             <NavLink to="/contact" className="nav-item nav-link">Contact</NavLink>
//           </div>
//           <div className="d-flex">
//             <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-facebook-f"></i></a>
//             <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-instagram"></i></a>
//             <a className="btn btn-primary btn-sm-square" href="#"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

import { Link, NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // ⚠️ kiểm tra lại đường dẫn đúng trong project của bạn

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="container-fluid bg-light sticky-top p-0">
      <nav className="navbar navbar-expand-lg navbar-light p-0">
        <Link to="/" className="navbar-brand bg-primary py-4 px-5 me-0">
          <h1 className="mb-0"><i className="bi bi-scissors"></i>ZenStyle</h1>
        </Link>

        <div className="navbar-nav mx-auto"></div>

        <div className="d-flex ms-lg-3 gap-2">
          {!user ? (
            <Link to="/login" className="btn btn-outline-primary">Log in</Link>
          ) : (
            <>
              <Link to="/client/profile" className="btn btn-outline-success">
                {user.name || "Profile"}
              </Link>
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar-toggler me-4"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse p-3 ${open ? "show" : ""}`}>
          <div className="navbar-nav mx-auto">
            <NavLink to="/" end className="nav-item nav-link">Home</NavLink>
            <NavLink to="/services" className="nav-item nav-link">Service</NavLink>
            <NavLink to="/gallery" className="nav-item nav-link">Product</NavLink>
            <NavLink to="/price" className="nav-item nav-link">Price</NavLink>
            <NavLink to="/contact" className="nav-item nav-link">Contact</NavLink>
          </div>
          <div className="d-flex">
            <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="btn btn-primary btn-sm-square me-3" href="#"><i className="fab fa-instagram"></i></a>
            <a className="btn btn-primary btn-sm-square" href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </nav>
    </div>
  );
}