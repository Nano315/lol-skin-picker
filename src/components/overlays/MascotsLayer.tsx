/* eslint-disable @typescript-eslint/no-explicit-any */
import Lulu from "/mascots/LuluHome.png?url";
//import Meep1 from "/mascots/Meep1.png?url";
import Meep3 from "/mascots/Meep3.png?url";
import Poro4 from "/mascots/Poro4.png?url";
import React from "react";

export default function MascotsLayer() {
  return (
    <div className="mascots-layer">
      <div
        className="mascot m1"
        style={
          {
            top: "72%",
            left: "54%",
            ["--aura" as any]: "#a394ddff",
          } as React.CSSProperties
        }
      >
        <img src={Lulu} alt="" draggable="false" />
      </div>
      {/* <div
        className="mascot m2"
        style={
          {
            bottom: "35%",
            left: "90%",
            ["--aura" as any]: "#6dc26c",
          } as React.CSSProperties
        }
      >
        <img src={Meep1} alt="" draggable="false" className="flip-x" />
      </div> */}
      <div
        className="mascot m3"
        style={
          {
            top: "77%",
            right: "88%",
            ["--aura" as any]: "#6dc26c",
          } as React.CSSProperties
        }
      >
        <img src={Meep3} alt="" draggable="false" />
      </div>
      <div
        className="mascot m4"
        style={
          {
            bottom: "88%",
            right: "88%",
            ["--aura" as any]: "#ecececff",
          } as React.CSSProperties
        }
      >
        <img src={Poro4} alt="" draggable="false" />
      </div>
      <div
        className="mascot m5"
        style={
          {
            top: "0%",
            left: "85%",
            ["--aura" as any]: "#ecececff",
          } as React.CSSProperties
        }
      >
        <img src={Poro4} alt="" draggable="false" className="flip-x" />
      </div>
    </div>
  );
}
