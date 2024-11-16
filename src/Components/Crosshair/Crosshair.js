import React from "react";
import styles from "./Crosshair.module.scss";

class Crosshair extends React.Component {
    handleDoubleClick = (event) => {
        this.props.clickedPoint(
            this.props.x + this.props.boxWidth / 2,
            this.props.y + this.props.boxHeight / 2,
            this.props.point,
            "double"
        );
    };

    handleClick = (event) => {
        this.props.clickedPoint(
            this.props.x + this.props.boxWidth / 2,
            this.props.y + this.props.boxHeight / 2,
            this.props.point,
            "single"
        );
    };

    render() {
        const crosshairSize = 10;
        const sitePoints = this.props.site[this.props.currentPhoto]["points"];
        return (
            <div
                className={`${styles.crosshairBox} ${this.props.current ? styles.selected : ""} ${
                    sitePoints[this.props.point]["species"] ? styles.confirmed : ""
                }`}
                style={{
                    position: "absolute",
                    width: `${this.props.boxWidth}px`,
                    height: `${this.props.boxHeight}px`,
                    top: `${this.props.y}px`,
                    left: `${this.props.x}px`,
                    backgroundColor: "transparent",
                }}
                data-point={this.props.point}
                onDoubleClick={this.handleDoubleClick}
                onClick={this.handleClick}
            >
                <div
                    className={styles.crosshairLine}
                    style={{
                        position: "absolute",
                        width: "1px",
                        height: `${crosshairSize}px`,
                        top: `${this.props.boxHeight / 2 - (crosshairSize + 1)}px`,
                        left: `${this.props.boxWidth / 2}px`,
                        transform: "translateX(-50%)",
                    }}
                ></div>
                <div
                    className={styles.crosshairLine}
                    style={{
                        position: "absolute",
                        width: "1px",
                        height: `${crosshairSize}px`,
                        top: `${this.props.boxHeight / 2 + 1}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                ></div>
                <div
                    className={styles.crosshairLine}
                    style={{
                        position: "absolute",
                        width: `${crosshairSize}px`,
                        height: "1px",
                        top: "50%",
                        left: `${this.props.boxWidth / 2 + 1}px`,
                        transform: "translateY(-50%)",
                    }}
                ></div>
                <div
                    className={styles.crosshairLine}
                    style={{
                        position: "absolute",
                        width: `${crosshairSize}px`,
                        height: "1px",
                        top: "50%",
                        left: `${this.props.boxWidth / 2 - (crosshairSize + 1)}px`,
                        transform: "translateY(-50%)",
                    }}
                ></div>
            </div>
        );
    }
}

export default Crosshair;
