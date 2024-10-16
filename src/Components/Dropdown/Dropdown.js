import React from "react";
import styles from "./Dropdown.module.scss";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: "", // Initial value is empty
        };
    }

    handleChange = (event) => {
        console.log("changed");
        this.props.changeSelection(
            event.currentTarget.value,
            this.props.communityName
        );
        this.setState({ selectedValue: event.target.value });

        this.props.changeSearchSpecies("");
    };

    render() {
        const { selectedValue } = this.state;

        return (
            <div className={styles.communityDropdown}>
                <div>{this.props.communityName}</div>
                <select
                    name="species"
                    value={this.props.selected[this.props.communityName]}
                    title={this.props.selected[this.props.communityName]}
                    onChange={this.handleChange}
                    className={`${styles.dropdown} ${
                        selectedValue === "" ? styles.placeholderSelected : ""
                    }`}
                >
                    <option value="" disabled className={styles.placeholder}>
                        Select one...
                    </option>
                    {this.props.community.map((species) => (
                        <option
                            key={species}
                            value={species}
                            title={species}
                            className={styles.option}
                        >
                            {species}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Dropdown;
