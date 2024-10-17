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
        this.biome = {
            high: high,
            medium: medium,
            low: low,
            other: other,
            defaultEcosystem: defaultEcosystem,
        };
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
        if (
            this.props.currentPhoto &&
            ecosystem !== this.state.selectedEcosystem
        ) {
            if (
                !this.state.selectedEcosystem ||
                window.confirm(
                    "Changing ecosystems will clear all point classifications. Are you sure?"
                )
            ) {
                const currentPhoto = Object.keys(this.props.site)[
                    this.props.currentPhoto - 1
                ];

                for (let i = 1; i <= 100; i++) {
                    this.props.site[currentPhoto]["points"][i] = {
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

    componentDidMount() {
        window.addEventListener("click", (event) => {
            if (
                this.state.ecosystemSelectorOpen &&
                event.target.id !== "ecosystemSelector"
            ) {
                this.setState({ ecosystemSelectorOpen: 0 });
            }
        });
    }

    // new image selected
    componentDidUpdate() {
        const currentPhoto = Object.keys(this.props.site)[
            this.props.currentPhoto - 1
        ];
        // new image loaded
        if (currentPhoto && this.props.imageLoaded) {
            // if new image doesn't have an ecosystem selected
            if (
                !this.props.site[currentPhoto]["ecosystem"] &&
                !this.state.ecosystemSelectorOpen
            ) {
                this.setState({
                    ecosystemSelectorOpen: 1,
                    selectedEcosystem: "",
                });

                // new image does have an ecosystem selected and it's not curent
            } else if (
                this.props.site[currentPhoto]["ecosystem"] &&
                this.state.selectedEcosystem !==
                    this.props.site[currentPhoto]["ecosystem"]
            ) {
                this.setState({
                    selectedEcosystem:
                        this.props.site[currentPhoto]["ecosystem"],
                    ecosystemSelectorOpen: 0,
                });
            }
        } else if (!currentPhoto && this.state.selectedEcosystem) {
            this.setState({ selectedEcosystem: "" });
        }
    }

    handleCommentKeyPress = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            this.props.currentPoint
        ) {
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
            <div
                className={`${styles.ecosystemContainer} ${
                    this.state.ecosystemSelectorOpen ? styles.open : ""
                }`}
            >
                <EcosystemSelector
                    ecosystemSelectorOpen={this.state.ecosystemSelectorOpen}
                    toggleEcosystemSelector={this.toggleEcosystemSelector}
                    changeEcosystem={this.changeEcosystem}
                    selectedEcosystem={this.state.selectedEcosystem}
                    biome={this.biome}
                    id="ecosystemSelector"
                ></EcosystemSelector>

                <form
                    onSubmit={this.confirmSelection}
                    className={styles.ecosystemForm}
                >
                    <div>
                        {this.state.selectedEcosystem ? (
                            <div>
                                {this.biome[this.state.selectedEcosystem][
                                    "name"
                                ] !== "Other" ? (
                                    <Search
                                        ecosystem={
                                            this.biome[
                                                this.state.selectedEcosystem
                                            ]
                                        }
                                        setSelection={this.setSelection}
                                        searchSpecies={this.state.searchSpecies}
                                        changeSearchSpecies={
                                            this.changeSearchSpecies
                                        }
                                    ></Search>
                                ) : (
                                    ""
                                )}
                                {Object.keys(
                                    this.biome[this.state.selectedEcosystem]
                                ).map((key) =>
                                    Array.isArray(
                                        this.biome[
                                            this.state.selectedEcosystem
                                        ][key]
                                    ) ? (
                                        <Dropdown
                                            key={key}
                                            community={
                                                this.biome[
                                                    this.state.selectedEcosystem
                                                ][key]
                                            }
                                            communityName={key}
                                            setSelection={this.setSelection}
                                            currentSelection={
                                                this.props.currentSelection
                                            }
                                            changeSearchSpecies={
                                                this.changeSearchSpecies
                                            }
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
                    <button
                        className={styles.confirmSpecies}
                        type="submit"
                        disabled={
                            !(
                                (this.props.currentSelection["comments"] ||
                                    this.props.currentSelection["species"]) &&
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
