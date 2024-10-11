import React from "react";

class Dropdown extends React.Component {
    handleChange = (event) => {
        console.log("changed");
        this.props.changeSelection(
            event.currentTarget.value,
            this.props.communityName
        );

        this.props.changeSearchSpecies("");
    };

    render() {
        return (
            <div className="communityDropdown">
                <p>{this.props.communityName}</p>
                <select
                    name="species"
                    value={this.props.selected[this.props.communityName]}
                    title={this.props.selected[this.props.communityName]}
                    onChange={this.handleChange}
                >
                    <option value="" disabled>
                        Select one...
                    </option>
                    {this.props.community.map((species) => (
                        <option key={species} value={species} title={species}>
                            {species}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Dropdown;
