import React from "react";

class Crosshair extends React.Component {
    handleClick = (event) => {
        this.props.clickedPoint(
            this.props.x + this.props.boxWidth / 2,
            this.props.y + this.props.boxHeight / 2
        );
        console.log("Clicked!");
    };

    render() {
        const crosshairSize = 10;
        return (
            <div
                className="crosshairBox"
                style={{
                    position: "absolute",
                    width: `${this.props.boxWidth}px`,
                    height: `${this.props.boxHeight}px`,
                    top: `${this.props.y}px`,
                    left: `${this.props.x}px`,
                    backgroundColor: "transparent",
                }}
                onClick={this.handleClick}
            >
                <div
                    className="crosshairLine"
                    style={{
                        position: "absolute",
                        width: "2px",
                        height: `${crosshairSize}px`,
                        top: `${
                            this.props.boxHeight / 2 - (crosshairSize + 3)
                        }px`,
                        left: `${this.props.boxWidth / 2}px`,
                        transform: "translateX(-50%)",
                    }}
                ></div>
                <div
                    className="crosshairLine"
                    style={{
                        position: "absolute",
                        width: "2px",
                        height: `${crosshairSize}px`,
                        top: `${this.props.boxHeight / 2 + 3}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                ></div>
                <div
                    className="crosshairLine"
                    style={{
                        position: "absolute",
                        width: `${crosshairSize}px`,
                        height: "2px",
                        top: "50%",
                        left: `${this.props.boxWidth / 2 + 3}px`,
                        transform: "translateY(-50%)",
                    }}
                ></div>
                <div
                    className="crosshairLine"
                    style={{
                        position: "absolute",
                        width: `${crosshairSize}px`,
                        height: "2px",
                        top: "50%",
                        left: `${
                            this.props.boxWidth / 2 - (crosshairSize + 3)
                        }px`,
                        transform: "translateY(-50%)",
                    }}
                ></div>
            </div>
        );
    }
}

export default Crosshair;
