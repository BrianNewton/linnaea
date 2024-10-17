import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import Search from "../Search/Search";
import styles from "./EcosystemMenu.module.scss";
import EcosystemSelector from "../EcosystemSelector/EcosystemSelector";

class EcosystemMenu extends React.Component {
    state = {
        searchSpecies: "",
    };

    changeSearchSpecies = (species) => {
        this.setState({ searchSpecies: species });
    };

    setSelection = (species, community) => {
        const currentSelection = {
            community: community,
            species: species,
            comments: document.getElementById("comments").value,
        };

        this.props.changeSelection(currentSelection);
    };

    confirmSelection = (event) => {
        event.preventDefault();
        this.props.confirmSelection();
    };

    render() {
        return (
            <div className={styles.ecosystemMenu}>
                <EcosystemSelector></EcosystemSelector>
                <form onSubmit={this.confirmSelection}>
                    <Search
                        ecosystem={this.props.ecosystem}
                        setSelection={this.setSelection}
                        searchSpecies={this.state.searchSpecies}
                        changeSearchSpecies={this.changeSearchSpecies}
                    ></Search>
                    {Object.keys(this.props.ecosystem).map((key) => (
                        <Dropdown
                            key={key}
                            community={this.props.ecosystem[key]}
                            communityName={key}
                            setSelection={this.setSelection}
                            currentSelection={this.props.currentSelection}
                            changeSearchSpecies={this.changeSearchSpecies}
                        ></Dropdown>
                    ))}
                    <div>
                        <textarea
                            className={styles.comments}
                            placeholder="Comments..."
                            id="comments"
                        ></textarea>
                    </div>
                    <button
                        className={styles.confirmSpecies}
                        type="submit"
                        disabled={
                            !(
                                this.props.currentSelection["species"] &&
                                this.props.currentPoint
                            )
                        }
                    >
                        Confirm{" "}
                    </button>
                </form>
            </div>
        );
    }
}

export default EcosystemMenu;
