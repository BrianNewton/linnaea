import React from "react";
import styles from "./EcosystemSelector.module.scss";

class EcosystemSelector extends React.Component {
    state = {
        open: 0,
    };

    handleSelectBoxClick = () => {
        const open = this.state.open;
        this.setState({ open: 1 - open });
    };

    render() {
        return (
            // <select className={styles.ecosystemSelector}>
            //     <option>test1</option>
            //     <option>test2</option>
            //     <option>test3</option>
            // </select>
            <div
                className={`${styles.ecosystemSelect} ${
                    this.state.open ? styles.open : ""
                }`}
                onClick={this.handleSelectBoxClick}
            >
                <div className={styles.selectBox}>
                    <span className={styles.selected}>Choose an option</span>
                    <div className={styles.optionsContainer}>
                        <div className={styles.option}>option 1</div>
                        <div className={styles.option}>option 2</div>
                        <div className={styles.option}>option 3</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EcosystemSelector;
