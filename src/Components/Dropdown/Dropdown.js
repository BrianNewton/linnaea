import React from "react";
import styles from "./Dropdown.module.scss";

class Dropdown extends React.Component {
    handleChange = (event) => {
        this.props.setSelection(event.currentTarget.value, this.props.communityName);
        this.props.changeSearchSpecies("");
    };

    render() {
        return (
            <div className={styles.communityDropdown}>
                <div>{this.props.communityName}</div>
                <select
                    name="species"
                    value={
                        this.props.currentSelection["community"] === this.props.communityName ? this.props.currentSelection["species"] : ""
                    }
                    title={
                        this.props.currentSelection["community"] === this.props.communityName ? this.props.currentSelection["species"] : ""
                    }
                    onChange={this.handleChange}
                    className={`${styles.dropdown} ${
                        this.props.currentSelection["community"] === this.props.communityName ? "" : styles.placeholderSelected
                    }`}
                >
                    <option value="" disabled>
                        Select one...
                    </option>
                    {this.props.community.map((species) => (
                        <option key={`${this.props.communityName} ${species}`} value={species} title={species} className={styles.option}>
                            {species}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Dropdown;
