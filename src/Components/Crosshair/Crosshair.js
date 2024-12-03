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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                data-point={this.props.point}
                onDoubleClick={this.handleDoubleClick}
                onClick={this.handleClick}
            >
                <svg
                    className={styles.crosshairLine}
                    width="25"
                    height="25"
                    viewBox="0 0 66 66"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <line x1="33" y1="66" x2="33" y2="36" stroke-width="1" vector-effect="non-scaling-stroke" />
                    <line x1="33" y1="30" x2="33" stroke-width="1" vector-effect="non-scaling-stroke" />
                    <line x1="36" y1="33" x2="66" y2="33" stroke-width="1" vector-effect="non-scaling-stroke" />
                    <line y1="33" x2="30" y2="33" stroke-width="1" vector-effect="non-scaling-stroke" />
                </svg>
            </div>
        );
    }
}

export default Crosshair;
