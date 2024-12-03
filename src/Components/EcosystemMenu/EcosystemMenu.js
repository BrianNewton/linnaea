import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import Search from "../Search/Search";
import styles from "./EcosystemMenu.module.scss";
import EcosystemSelector from "../EcosystemSelector/EcosystemSelector";

import defaultEcosystem from "../../biome/defaultEcosystem.json";
import high from "../../biome/high.json";
import medium from "../../biome/medium.json";
import low from "../../biome/low.json";
import other from "../../biome/other.json";

class EcosystemMenu extends React.Component {
    constructor(props) {
        super(props);
        // this.biome = {
        //     high: high,
        //     medium: medium,
        //     low: low,
        //     other: other,
        //     defaultEcosystem: defaultEcosystem,
        // };
        this.biome = {};
        this.biome[high["name"]] = high;
        this.biome[medium["name"]] = medium;
        this.biome[low["name"]] = low;
        this.biome[other["name"]] = other;
        this.biome[defaultEcosystem["name"]] = defaultEcosystem;
    }

    state = {
        searchSpecies: "",
        ecosystemSelectorOpen: 0,
        selectedEcosystem: "",
    };

    toggleEcosystemSelector = () => {
        this.setState({
            ecosystemSelectorOpen: 1 - this.state.ecosystemSelectorOpen,
        });
    };

    // This should clear the current selection and warn the user
    changeEcosystem = (ecosystem) => {
        if (this.props.currentPhoto && ecosystem !== this.state.selectedEcosystem) {
            if (
                !this.state.selectedEcosystem ||
                window.confirm("Changing ecosystems will clear all point classifications. Are you sure?")
            ) {
                for (let i = 1; i <= 100; i++) {
                    this.props.site[this.props.currentPhoto]["points"][i] = {
                        comments: "",
                        community: "",
                        species: "",
                    };
                }

                this.props.changeEcosystem(ecosystem);
                this.setState({ selectedEcosystem: ecosystem });
            }
        }
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
        this.setState({ searchSpecies: "" });
        this.props.confirmSelection();
    };

    handleOther = (event) => {
        event.preventDefault();
        if (this.props.currentPhoto) {
            this.setState({ searchSpecies: "" });
            // this.props.changeSelection({ community: "other", species: "other", comments: document.getElementById("comments").value });
            this.props.confirmSelection(true, document.getElementById("comments").value);
        }
    };

    componentDidMount() {
        window.addEventListener("click", (event) => {
            if (this.state.ecosystemSelectorOpen && event.target.id !== "ecosystemSelector") {
                this.setState({ ecosystemSelectorOpen: 0 });
            }
        });
    }

    // new image selected
    componentDidUpdate() {
        // new image loaded
        if (this.props.currentPhoto && this.props.imageLoaded) {
            // if new image doesn't have an ecosystem selected
            if (!this.props.site[this.props.currentPhoto]["ecosystem"] && !this.state.ecosystemSelectorOpen) {
                this.setState({
                    ecosystemSelectorOpen: 1,
                    selectedEcosystem: "",
                });

                // new image does have an ecosystem selected and it's not curent
            } else if (
                this.props.site[this.props.currentPhoto]["ecosystem"] &&
                this.state.selectedEcosystem !== this.props.site[this.props.currentPhoto]["ecosystem"]
            ) {
                this.setState({
                    selectedEcosystem: this.props.site[this.props.currentPhoto]["ecosystem"],
                    ecosystemSelectorOpen: 0,
                });
            }
        } else if (!this.props.currentPhoto && this.state.selectedEcosystem) {
            this.setState({ selectedEcosystem: "" });
        }
    }

    handleCommentKeyPress = (event) => {
        if (this.props.currentPhoto && event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            this.setState({ searchSpecies: "" });
            this.props.confirmSelection();
        }
    };

    handleCommentChange = (event) => {
        const comment = event.currentTarget.value;
        const currentSelection = { ...this.props.currentSelection };
        currentSelection["comments"] = comment;
        this.props.changeSelection(currentSelection);
    };

    render() {
        return (
            <div className={`${styles.ecosystemContainer} ${this.state.ecosystemSelectorOpen ? styles.open : ""}`}>
                <EcosystemSelector
                    ecosystemSelectorOpen={this.state.ecosystemSelectorOpen}
                    toggleEcosystemSelector={this.toggleEcosystemSelector}
                    changeEcosystem={this.changeEcosystem}
                    selectedEcosystem={this.state.selectedEcosystem}
                    biome={this.biome}
                    id="ecosystemSelector"
                ></EcosystemSelector>

                <form onSubmit={this.confirmSelection} className={styles.ecosystemForm}>
                    <div>
                        {this.state.selectedEcosystem ? (
                            <div>
                                {this.biome[this.state.selectedEcosystem]["name"] !== "Other" ? (
                                    <Search
                                        ecosystem={this.biome[this.state.selectedEcosystem]}
                                        setSelection={this.setSelection}
                                        searchSpecies={this.state.searchSpecies}
                                        changeSearchSpecies={this.changeSearchSpecies}
                                    ></Search>
                                ) : (
                                    ""
                                )}
                                {Object.keys(this.biome[this.state.selectedEcosystem]).map((key) =>
                                    Array.isArray(this.biome[this.state.selectedEcosystem][key]) ? (
                                        <Dropdown
                                            key={key}
                                            community={this.biome[this.state.selectedEcosystem][key]}
                                            communityName={key}
                                            setSelection={this.setSelection}
                                            currentSelection={this.props.currentSelection}
                                            changeSearchSpecies={this.changeSearchSpecies}
                                        ></Dropdown>
                                    ) : (
                                        ""
                                    )
                                )}
                            </div>
                        ) : (
                            ""
                        )}
                        <textarea
                            className={styles.comments}
                            placeholder="Comments..."
                            id="comments"
                            onKeyDown={this.handleCommentKeyPress}
                            onChange={this.handleCommentChange}
                            value={this.props.currentSelection["comments"]}
                        ></textarea>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <button
                            className={`${styles.otherSpecies} ${this.props.currentSelection["species"] === "other" ? styles.other : ""}`}
                            type="button"
                            onClick={this.handleOther}
                            disabled={!this.props.currentPhoto}
                        >
                            Other{" "}
                        </button>
                        <button
                            className={styles.confirmSpecies}
                            type="submit"
                            disabled={
                                !(
                                    this.props.currentPhoto &&
                                    (this.props.currentSelection["comments"] || this.props.currentSelection["species"])
                                )
                            }
                        >
                            Confirm{" "}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default EcosystemMenu;
