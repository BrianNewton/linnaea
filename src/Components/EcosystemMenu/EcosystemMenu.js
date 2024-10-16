import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import Search from "../Search/Search";
import styles from "./EcosystemMenu.module.scss";

class EcosystemMenu extends React.Component {
    render() {
        return (
            <div>
                <form className={styles.ecosystemMenu}>
                    <Search
                        ecosystem={this.props.ecosystem}
                        searchSpecies={this.props.searchSpecies}
                        selected={this.props.selected}
                        changeSearchSpecies={this.props.changeSearchSpecies}
                        changeSelection={this.props.changeSelection}
                    ></Search>
                    {Object.keys(this.props.ecosystem).map((key) => (
                        <Dropdown
                            key={key}
                            community={this.props.ecosystem[key]}
                            communityName={key}
                            selected={this.props.selected}
                            changeSearchSpecies={this.props.changeSearchSpecies}
                            changeSelection={this.props.changeSelection}
                        ></Dropdown>
                    ))}
                    <div>
                        <textarea
                            className={styles.comments}
                            placeholder="Comments..."
                        ></textarea>
                    </div>
                    <button
                        className={styles.confirmSpecies}
                        type="submit"
                        disabled={!this.props.selectedSpecies}
                    >
                        Confirm{" "}
                    </button>
                </form>
            </div>
        );
    }
}

export default EcosystemMenu;
