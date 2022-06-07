import React from "react";
import Profiles from "./Profile/Profiles";
import Footer from "./Footer/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <Profiles />
      <Footer />
    </div>
  );
}
