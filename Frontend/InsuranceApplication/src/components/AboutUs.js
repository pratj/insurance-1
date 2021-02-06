import React from "react";

function AboutUs() {
  return (
    <div className="aboutUs" data-test="aboutUs">
      <h1 style={{ textAlign: "center" }}>About Us</h1>
      <h3>Made by</h3>
      <marquee width="60%" direction="left" height="100px">Prateek Param Rashwin</marquee>
    </div>
  );
}

export default AboutUs;
