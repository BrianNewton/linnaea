import React from "react";
import styles from "./PointNavigator.module.scss";

class PointNavigator extends React.Component {
    render() {
        return (
            <div className={styles.pointNavigator}>
                <button className={styles.prevPoint}></button>
                <span>X:</span>
                <input className={styles.pointInput}></input>
                <span style={{ marginLeft: "30px" }}>Y:</span>
                <input className={styles.pointInput}></input>
                <button className={styles.nextPoint}></button>
            </div>
        );
    }
}

export default PointNavigator;
