import React from "react";
import "./ProjectList.css";

export default function ProjectList() {
  return (
    <div className="project-container">
      <div className="project-header">
        <h1 className="project-title">
          My <span className="highlighted-text">Projects</span>
        </h1>
      </div>
      <div className="project-list-top">
        <div className="project-one">
          <img
            src={require("../../../res/Home/lynx.jpg")}
            alt="no internet connection"
          />
          <h1>LYNX-NITT</h1>
          <a href="https://github.com/oops-shlok/NITT-APP-1">
            <i className="fa fa-github fa-2x"></i>
          </a>

          <a href="https://play.google.com/store/apps/details?id=org.spider.nittapp&hl=en_IN&gl=US">
            <i class="fa fa-google fa-2x"></i>
          </a>
          <a href="https://apps.apple.com/in/app/lynx-nitt/id1624086590">
            <i class="fa fa-apple fa-2x"></i>
          </a>
        </div>
        <div className="project-two">
          <img
            src={require("../../../res/Home/OT21.png")}
            alt="no internet connection"
          />
          <h1> Orientation'21 </h1>
          <a href="https://github.com/oops-shlok/Orientation-App-Frontend">
            <i className="fa fa-github fa-2x"></i>
          </a>
          <a href="https://play.google.com/store/apps/details?id=org.spider.orientation2021&hl=en_IN&gl=US">
            <i class="fa fa-google fa-2x"></i>
          </a>
        </div>
        <div className="project-three">
          <img
            src={require("../../../res/Home/supmult.png")}
            alt="no internet connection"
          />
          <h1> Superhero Multiverse</h1>
          <a href="https://github.com/oops-shlok/Superhero-Multiverse">
            <i className="fa fa-github fa-2x"></i>
          </a>
        </div>
      </div>
      <div className="project-list-top">
        <div className="project-four">
          <img
            src={require("../../../res/Home/GTD.png")}
            alt="no internet connection"
          />
          <h1>Guess The Day</h1>
          <a href="https://github.com/oops-shlok/NITT-APP-1">
            <i className="fa fa-github fa-2x"></i>
          </a>
        </div>
        <div className="project-five">
          <img
            src={require("../../../res/Home/colortiles.png")}
            alt="no internet connection"
          />
          <h1> Color Tiles </h1>
          <a href="https://github.com/oops-shlok/Orientation-App-Frontend">
            <i className="fa fa-github fa-2x"></i>
          </a>
        </div>
        <div className="project-six">
          <img
            src={require("../../../res/Home/pawsome.png")}
            alt="no internet connection"
          />
          <h1> Pawsome </h1>
          <a href="https://github.com/oops-shlok/Superhero-Multiverse">
            <i className="fa fa-github fa-2x"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
