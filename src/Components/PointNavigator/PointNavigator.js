import React from "react";
import styles from "./PointNavigator.module.scss";

class PointNavigator extends React.Component {
    home = (event) => {
        if (this.props.currentPhoto) {
            this.props.setScale(1);
        }
    };

    zoomIn = (event) => {
        if (this.props.currentPhoto) {
            if (this.props.scale < 50) {
                this.props.setScale(this.props.scale + this.props.scale * 0.5);
            }
        }
    };

    zoomOut = (event) => {
        if (this.props.currentPhoto) {
            const newScale = this.props.scale - this.props.scale * 0.5;
            if (newScale < 1) {
                this.props.setScale(1);
            } else {
                this.props.setScale(newScale);
            }
        }
    };

    getPointFromXY = (x, y) => {
        return y + (x - 1) * 10;
    };

    getXYFromPoint = (point) => {
        const x = Math.floor((point - 1) / 10) + 1;
        const y = ((point - 1) % 10) + 1;
        return { x, y };
    };

    downX = (event) => {
        if (this.props.currentPhoto) {
            let newXY = this.getXYFromPoint(this.props.lastPoint);
            if (newXY.x > 1) {
                newXY.x--;
            } else {
                newXY.x = 10;
                newXY.y--;
            }
            console.log(newXY);
            const newPoint = this.getPointFromXY(newXY.x, newXY.y);
            console.log(newPoint);
            this.props.setLastPoint(newPoint);
            this.props.setCurrentPoints([newPoint]);
        }
    };

    upX = (event) => {
        if (this.props.currentPhoto) {
            let newXY = this.getXYFromPoint(this.props.lastPoint);
            if (newXY.x < 10) {
                newXY.x++;
            } else {
                newXY.x = 1;
                newXY.y++;
            }
            console.log(newXY);
            const newPoint = this.getPointFromXY(newXY.x, newXY.y);
            console.log(newPoint);
            this.props.setLastPoint(newPoint);
            this.props.setCurrentPoints([newPoint]);
        }
    };

    downY = (event) => {
        if (this.props.currentPhoto) {
            let newXY = this.getXYFromPoint(this.props.lastPoint);
            if (newXY.y > 1) {
                newXY.y--;
            } else {
                newXY.y = 10;
                newXY.x--;
            }
            console.log(newXY);
            const newPoint = this.getPointFromXY(newXY.x, newXY.y);
            console.log(newPoint);
            this.props.setLastPoint(newPoint);
            this.props.setCurrentPoints([newPoint]);
        }
    };

    upY = (event) => {
        if (this.props.currentPhoto) {
            let newXY = this.getXYFromPoint(this.props.lastPoint);
            if (newXY.y < 10) {
                newXY.y++;
            } else {
                newXY.y = 1;
                newXY.x++;
            }
            console.log(newXY);
            const newPoint = this.getPointFromXY(newXY.x, newXY.y);
            console.log(newPoint);
            this.props.setLastPoint(newPoint);
            this.props.setCurrentPoints([newPoint]);
        }
    };

    render() {
        return (
            <div className={styles.imageTools}>
                <div className={styles.home}>
                    <button className={styles.homeButton} onClick={this.home}></button>
                    <span style={{ alignContent: "center" }}>Point: {this.props.lastPoint}</span>
                </div>
                <div className={styles.pointNavigator}>
                    <div className={styles.subNavigator}>
                        <button className={styles.prevPoint} onClick={this.downX}></button>
                        <span style={{ marginRight: "6px" }}>X:</span>
                        <input
                            className={styles.pointInput}
                            value={`${this.props.currentPhoto ? this.getXYFromPoint(this.props.lastPoint).x : 0}`}
                        ></input>
                        <button className={styles.nextPoint} onClick={this.upX}></button>
                    </div>
                    <div className={styles.subNavigator}>
                        <button className={styles.upPoint} onClick={this.upY}></button>
                        <span style={{ marginRight: "6px" }}>Y:</span>
                        <input
                            className={styles.pointInput}
                            value={`${this.props.currentPhoto ? this.getXYFromPoint(this.props.lastPoint).y : 0}`}
                        ></input>
                        <button className={styles.downPoint} onClick={this.downY}></button>
                    </div>
                </div>
                <div className={styles.zooms}>
                    <button className={styles.zoomIn} onClick={this.zoomIn}></button>
                    <button className={styles.zoomOut} onClick={this.zoomOut}></button>
                </div>
            </div>
        );
    }
}

export default PointNavigator;
