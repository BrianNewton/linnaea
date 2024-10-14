import React from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";

class EcosystemMenu extends React.Component {
    render() {
        return (
            <div>
                <form className="ecosystemMenu">
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
                            className="comments"
                            placeholder="Comments..."
                        ></textarea>
                    </div>
                    <button
                        className="confirmSpecies"
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
