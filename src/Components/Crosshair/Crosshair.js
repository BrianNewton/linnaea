import React from "react";
import styles from "./Crosshair.module.scss";

class Crosshair extends React.Component {
    // zoom in to point on double click
    handleDoubleClick = (event) => {
        const shiftKey = event.shiftKey;
        this.props.clickedPoint(
            this.props.x + this.props.boxWidth / 2,
            this.props.y + this.props.boxHeight / 2,
            this.props.point,
            "double",
            shiftKey
        );
    };

    // select new point on single click
    handleClick = (event) => {
        const shiftKey = event.shiftKey;
        const ctrlKey = event.metaKey || event.ctrlKey;
        this.props.clickedPoint(
            this.props.x + this.props.boxWidth / 2,
            this.props.y + this.props.boxHeight / 2,
            this.props.point,
            "single",
            shiftKey,
            ctrlKey
        );
    };

    render() {
        const crosshairSize = 10;
        const sitePoints = this.props.site[this.props.currentPhoto]["points"];
        return (
            // builds the crosshair, style changes depending on whether theres a classification
            // for that point or whether it's the current point
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
