import React from "react";
import "./ScreenHeader.css";
import Link from "react-scroll/modules/components/Link";

export default function ScreenHeader() {
  return (
    <div className="header-container">
      <div className="header-left">
        <div className="header-name">Shlok Upadhyay</div>
      </div>
      <div className="header-right">
        <div className="header-right-list">
          <ul style={{ listStyleType: "none" }}>
            <Link spy={true} to="Home" smooth={true}>
              <li>Home</li>
            </Link>
            <Link spy={true} to="AboutMe" smooth={true}>
              <li>About Me</li>
            </Link>
            <Link spy={true} to="Projects" smooth={true}>
              <li>Projects</li>
            </Link>
            <li>Contact Me</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
