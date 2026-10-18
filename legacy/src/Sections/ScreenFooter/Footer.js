import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="Screen-footer-container">
      <div className="Screen-footer-content">
        <div className="Screen-footer-handles">
          <a href="mailto:deep.upu9@gmail.com?Subject=Some%20subject">
            <i className="fa fa-envelope fa-3x"></i>
          </a>
          <a href="https://www.instagram.com/shlok_.upadhyay/">
            <i className="fa fa-instagram fa-3x"></i>
          </a>
          <a href="https://github.com/oops-shlok">
            <i className="fa fa-github fa-3x"></i>
          </a>
          <a href="https://www.linkedin.com/in/shlok-upadhyay-521065104/">
            <i className="fa fa-linkedin fa-3x"></i>
          </a>
        </div>
        <span className="footer-email">
          CopyRights 2022. Shlok Upadhyay. All Rights Reserved.
        </span>
      </div>
    </div>
  );
}
