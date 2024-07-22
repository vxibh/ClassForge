import React from "react";
import './Headers.css'
const Header = ({ userName }) => {
    return (
      <header id="welcome-section">
        {/* <div className="forest" /> */}
        <div className="silhouette" />
        <div className="welcome-message">
            Welcome, {userName || 'User'}
        </div>
        {/* <div className="moon" /> */}
        <div className="container">
          <h1>
            <span className="line"><span className="color">Seamless</span> </span>
            <span className="line">Submission</span>
            <span className="line">Smart<span className="color">Evaluation</span></span>
          </h1>
          <div className="buttons">
            <a href="#projects">my Profile</a>
            <a href="#contact" className="cta">Check Stats</a>
          </div>
        </div>
      </header>
    );
  };
export default Header