import React from "react";
import styles from "./Search.module.scss";

class Search extends React.Component {
    handleChange = (event) => {
        const inputValue = event.currentTarget.value;

        const matchingOption = Array.from(
            document.querySelectorAll("#all option")
        ).find((option) => option.value === inputValue);

        if (matchingOption) {
            this.props.changeSelection(
                event.currentTarget.value,
                matchingOption.dataset.community
            );
        }

        this.props.changeSearchSpecies(inputValue);
    };

    handleFocus = (event) => {
        event.target.select();
    };

    render() {
        return (
            <div>
                <input
                    list="all"
                    placeholder="Search..."
                    type="search"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    value={this.props.searchSpecies}
                ></input>
                <datalist id="all">
                    {Object.keys(this.props.ecosystem)
                        .map((key) =>
                            this.props.ecosystem[key].map((species) => (
                                <option
                                    key={species}
                                    value={species}
                                    data-community={key}
                                >
                                    {key}
                                </option>
                            ))
                        )
                        .flat()}
                </datalist>
            </div>
        );
    }
}

export default Search;
