import React from "react";

class PointNavigator extends React.Component {
    render() {
        return (
            <div className="pointNavigator">
                <button className="prevPoint"></button>
                <span>X:</span>
                <input className="pointInput"></input>
                <span style={{ marginLeft: "30px" }}>Y:</span>
                <input className="pointInput"></input>
                <button className="nextPoint"></button>
            </div>
        );
    }
}

export default PointNavigator;
