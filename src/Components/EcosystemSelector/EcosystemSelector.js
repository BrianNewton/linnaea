import React from "react";
import styles from "./EcosystemSelector.module.scss";

class EcosystemSelector extends React.Component {
    handleSelectBoxClick = () => {
        this.props.toggleEcosystemSelector();
    };

    //add click listener to close menu

    handleClick = (event) => {
        this.props.changeEcosystem(
            event.currentTarget.getAttribute("data-ecosystem")
        );
    };

    render() {
        return (
            <div
                className={`${styles.ecosystemSelect} ${
                    this.props.ecosystemSelectorOpen ? styles.open : ""
                }`}
                onClick={this.handleSelectBoxClick}
            >
                <div className={styles.selectBox} id="ecosystemSelector">
                    {this.props.selectedEcosystem
                        ? this.props.biome[this.props.selectedEcosystem]["name"]
                        : "Choose an Ecosystem"}

                    <div className={styles.optionsContainer}>
                        {Object.keys(this.props.biome).map((key) => (
                            <div
                                key={key}
                                data-ecosystem={key}
                                className={styles.option}
                                onClick={this.handleClick}
                            >
                                {this.props.biome[key]["name"]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default EcosystemSelector;
