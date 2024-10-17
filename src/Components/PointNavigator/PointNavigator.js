import React from "react";
import styles from "./PointNavigator.module.scss";

class PointNavigator extends React.Component {
    handleHome = (event) => {};

    handleZoom = (event) => {};

    handlePointNav = (event) => {};

    render() {
        return (
            <div className={styles.imageTools}>
                <div className={styles.home} onClick={this.handleHome}>
                    <button className={styles.homeButton}></button>
                </div>
                <div className={styles.pointNavigator}>
                    <div className={styles.subNavigator}>
                        <button className={styles.prevPoint}></button>
                        <span>X:</span>
                        <input className={styles.pointInput}></input>
                        <button className={styles.nextPoint}></button>
                    </div>
                    <div className={styles.subNavigator}>
                        <button className={styles.prevPoint}></button>
                        <span>Y:</span>
                        <input className={styles.pointInput}></input>
                        <button className={styles.nextPoint}></button>
                    </div>
                </div>
                <div className={styles.zooms}>
                    <button
                        className={styles.zoomIn}
                        onClick={this.handleZoom}
                    ></button>
                    <button
                        className={styles.zoomOut}
                        onClick={this.handleZoom}
                    ></button>
                </div>
            </div>
        );
    }
}

export default PointNavigator;
