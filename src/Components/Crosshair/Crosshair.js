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
            <svg
                className={`${styles.crosshairLine} ${this.props.current ? styles.selected : ""} ${
                    sitePoints[this.props.point]["species"] ? styles.confirmed : ""
                }`}
                style={{
                    position: "absolute",
                    left: `${this.props.x + this.props.boxWidth / 2 - 36}px`,
                    top: `${this.props.y + this.props.boxHeight / 2 - 36}px`,
                }}
                data-point={this.props.point}
                onDoubleClick={this.handleDoubleClick}
                onClick={this.handleClick}
                width="32"
                height="32"
                viewBox="0 0 93 93"
                fill="#FE0000"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M45 46.5L0 51.2631L4.16407e-07 41.7369L45 46.5Z" />
                <path d="M48 46.5L93 41.7369V51.2632L48 46.5Z" />
                <path d="M46.5 48L51.2631 93H41.7369L46.5 48Z" />
                <path d="M46.5 45L41.7369 0L51.2631 8.32814e-07L46.5 45Z" />
            </svg>
        );
    }
}

export default Crosshair;
