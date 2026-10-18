import React from "react";
import Typical from "react-typical";
import "./Profiles.css";

export default function Profiles() {
  return (
    <div className="profile-container">
      <div className="profile-parent">
        <div className="profile-details">
          <div className="col">
            <div className="col-icon">
              <a href="mailto:deep.upu9@gmail.com?Subject=Some%20subject">
                <i className="fa fa-envelope fa-2x"></i>
              </a>
              <a href="https://www.instagram.com/shlok_.upadhyay/">
                <i className="fa fa-instagram fa-2x"></i>
              </a>
              <a href="https://github.com/oops-shlok">
                <i className="fa fa-github fa-2x"></i>
              </a>
              <a href="https://www.linkedin.com/in/shlok-upadhyay-521065104/">
                <i className="fa fa-linkedin fa-2x"></i>
              </a>
            </div>
          </div>
          <div className="profile-details-name">
            <span className="primary-text">
              {" "}
              Bonjour! I am <span className="highlighted-text">Shlok</span>
            </span>
          </div>
          <div className="profile-details-role">
            <span className="primary-text">
              {" "}
              <h1>
                <Typical
                  loop={Infinity}
                  steps={[
                    "NIT Trichy '24 🏛",
                    1000,
                    "App Developer 📲",
                    1000,
                    "Tech Enthusiast 🖥",
                    1000,
                    "Learner 🧠",
                    1000,
                  ]}
                  wrapper="p"
                />
              </h1>
              <span className="profile-role-tagline">
                Ambitious | Dedicated | Ethical | Visionary
              </span>
            </span>
          </div>
          <a
            href="Shlok Upadhyay's Resume.pdf"
            download="Shlok Upadhyay's Resume.pdf"
          >
            <button className="btn primary-btn">My Resume</button>
          </a>
        </div>
        <div className="profile-picture">
          <div className="profile-picture-background"></div>
        </div>
      </div>
    </div>
  );
}
