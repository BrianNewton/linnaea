import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu/EcosystemMenu";
import defaultEcosystem from "./biome/defaultEcosystem.json";
import PhotoInterface from "./Components/PhotoInterface/PhotoInterface";

// Don't save images, save image paths and save site info

class App extends React.Component {
    constructor(props) {
        super(props);
        this.siteNameRef = React.createRef();
    }
    // make current point a per photo attribute

    state = {
        site: {}, // all site data, keyed by image name
        files: {}, // image file URLs
        images: {}, // image raw data
        saveFile: "", // Save file location, does this need to be here?
        currentSelection: { community: "", species: "", comments: "" }, // current ID selection, not yet confirmed
        currentPhoto: 0, // The name of the currently selected photo
        imageLoaded: 0, // whether the image data has fully loaded for the photo viewer
        unsavedWork: 0, // whether the user has unsaved classifications
        siteNameBox: 0,
    };

    setImageLoaded = (imageLoaded) => {
        this.setState({ imageLoaded });
    };

    componentDidMount() {
        this.setState({ ecosystem: defaultEcosystem });

        // need to fix this
        window.addEventListener("beforeunload", () => {
            const currentState = this.state;
            window.rendererAPI.sendState(currentState);
        });

        // Retrieve state when window is reopened
        window.mainAPI.restoreState((event, savedState) => {
            this.setState(savedState);
        });

        window.mainAPI.exportData((event) => {
            if (this.state.site) {
                this.setState({ siteNameBox: 1 });
            }
        });

        // new site
        window.mainAPI.new((event) => {
            const site = {};
            const files = {};
            const images = {};
            const saveFile = "";
            const currentSelection = { community: "", species: "", comments: "" };
            const currentPhoto = 0;
            const imageLoaded = 0;

            this.setState({ site, files, images, saveFile, currentSelection, currentPhoto, imageLoaded });
        });

        // save site as
        window.mainAPI.saveAs((event) => {
            const site_data = {
                site: this.state.site,
                files: this.state.files,
            };

            // sends site data to main process and receives the save file name
            window.rendererAPI.saveAs(site_data).then((saveFile) => {
                if (saveFile) {
                    this.setState({ saveFile: saveFile, unsavedWork: 0 });
                }
            });
            window.rendererAPI.unsavedWork(0); // no unsaved work after save
        });

        // save site data to current save file
        window.mainAPI.save((event) => {
            const site_data = {
                site: this.state.site,
                files: this.state.files,
            };
            window.rendererAPI.save(site_data);
            this.setState({ unsavedWork: 0 });
            window.rendererAPI.unsavedWork(0); // no unsaved work after save
        });

        // open site file, receives site data, and raw image binary data from main process
        window.mainAPI.open((event, siteData, newImages, saveFile) => {
            const site = siteData["site"]; // site data
            const files = siteData["files"]; // file locations
            const images = {}; // raw image binary data
            let currentSelection = {}; // is there a current selection?

            // populate image data
            Object.keys(newImages).map((image) => (images[image] = newImages[image]["data"]));

            // set last photo to current photo and update current selection (if there is one)
            const currentPhoto = Object.keys(site)[Object.keys(site).length - 1];
            if (
                site[currentPhoto]["points"][site[currentPhoto]["currentPoint"]]["comments"] ||
                site[currentPhoto]["points"][site[currentPhoto]["currentPoint"]]["species"]
            ) {
                currentSelection = site[currentPhoto]["points"][site[currentPhoto]["currentPoint"]];
            } else {
                currentSelection = { community: "", species: "", comments: "" };
            }

            this.setState({
                site: site,
                files: files,
                images: images,
                saveFile: saveFile,
                currentSelection: currentSelection,
                currentPhoto: currentPhoto,
                imageLoaded: 0,
                unsavedWork: 0,
            });
            window.rendererAPI.unsavedWork(0);
        });
    }

    cancelExport = (event) => {
        this.setState({ siteNameBox: 0 });
    };

    exportData = (event) => {
        event.preventDefault();
        const siteName = this.siteNameRef.current.value;
        console.log(siteName);
        this.setState({ siteNameBox: 0 });
        let csvData = [["Site", "Photo", "Angle", "Point", "Species", "Community", "Comments"]];
        Object.keys(this.state.site).forEach((image) => {
            for (let i = 1; i <= 100; i++) {
                csvData.push([
                    siteName,
                    image,
                    this.state.site[image]["ecosystem"],
                    i,
                    this.state.site[image]["points"][i]["species"],
                    this.state.site[image]["points"][i]["community"],
                    this.state.site[image]["points"][i]["comments"],
                ]);
            }
        });
        console.log(csvData);
        window.rendererAPI.sendExportData(csvData);
    };

    // selected something new
    changeSelection = (currentSelection) => {
        this.setState({ currentSelection });
    };

    // Handles new photo upload
    newPhoto = (newImages) => {
        const site = { ...this.state.site };
        const files = { ...this.state.files };
        const images = { ...this.state.images };

        // receives new image data from main process adds each to state
        Object.keys(newImages).forEach((image) => {
            files[image] = newImages[image]["path"];
            images[image] = newImages[image]["data"];
            site[image] = { points: [] };
            site[image]["currentPoint"] = 1;
            site[image]["ecosystem"] = "";
            for (let i = 1; i <= 100; i++) {
                site[image]["points"][i] = {
                    community: "",
                    species: "",
                    comments: "",
                };
            }
        });

        // sets last uploaded photo to new current photo
        const currentPhoto = Object.keys(site)[Object.keys(site).length - 1];
        this.setState({ site, currentPhoto, files, images });
        window.rendererAPI.unsavedWork(1);
    };

    changeEcosystem = (ecosystem) => {
        const site = { ...this.state.site };
        site[this.state.currentPhoto]["ecosystem"] = ecosystem;
        this.setState({ site });
    };

    // remove uploaded image
    removePhoto = (image) => {
        const site = { ...this.state.site };
        const files = { ...this.state.files };
        const images = { ...this.state.images };

        // If the user is removing the current photo
        // (almost always going to be the case)
        if (this.state.currentPhoto === image) {
            const index = Object.keys(site).indexOf(image);
            const size = Object.keys(site).length;
            let currentPhoto = "";
            if (index === 0 && size === 1) {
                currentPhoto = "";
            } else if (index === 0 && size !== 1) {
                currentPhoto = Object.keys(site)[index + 1];
            } else {
                currentPhoto = Object.keys(site)[index - 1];
            }
            this.setState({ currentPhoto });
        }

        // remove removed image from state
        delete site[image];
        delete files[image];
        delete images[image];

        this.setState({ site, files, images });
    };

    // user selected new point
    setCurrentPoint = (point) => {
        if (this.state.currentPhoto) {
            if (this.state.site[this.state.currentPhoto]["points"][point]["species"]) {
                // update current selection if the user picks an already classified point
                this.setState({
                    currentSelection: this.state.site[this.state.currentPhoto]["points"][point],
                });
            } else {
                // otherwise blank current selection
                this.setState({
                    currentSelection: {
                        community: "",
                        species: "",
                        comments: "",
                    },
                });
            }
            // update state
            const site = { ...this.state.site };
            site[this.state.currentPhoto]["currentPoint"] = point;
            this.setState({ site });
        }
    };

    // User confirms a selection
    confirmSelection = () => {
        const site = { ...this.state.site };
        const currentPoint = site[this.state.currentPhoto]["currentPoint"];
        Object.assign(site[this.state.currentPhoto]["points"][currentPoint], this.state.currentSelection);

        // I forget what this is for but it's probably important
        if (!site[this.state.currentPhoto]["points"][currentPoint]["species"]) {
            site[this.state.currentPhoto]["points"][currentPoint]["species"] = "None";
        }
        if (!site[this.state.currentPhoto]["points"][currentPoint]["community"]) {
            site[this.state.currentPhoto]["points"][currentPoint]["community"] = "None";
        }

        // clear current selection and move on to the next point
        const currentSelection = { community: "", species: "", comments: "" };
        if (currentPoint < 100) {
            site[this.state.currentPhoto]["currentPoint"]++;
        }

        this.setState({ site, currentSelection, unsavedWork: 1 });

        // now there is unsaved work
        window.rendererAPI.unsavedWork(1);
    };

    // choose a new photo
    // either through gallery item or through navigation buttons
    changePhoto = (newPhoto) => {
        // update new current selection if there is one
        let currentSelection = {};
        if (
            this.state.site[newPhoto]["points"][this.state.site[newPhoto]["currentPoint"]]["comments"] ||
            this.state.site[newPhoto]["points"][this.state.site[newPhoto]["currentPoint"]]["species"]
        ) {
            currentSelection = this.state.site[newPhoto]["points"][this.state.site[newPhoto]["currentPoint"]];
        } else {
            currentSelection = { community: "", species: "", comments: "" };
        }

        this.setState({ currentPhoto: newPhoto, currentSelection: currentSelection });
    };

    render() {
        return (
            <div>
                <div className="linnaea">
                    {this.state.siteNameBox ? (
                        <div className="siteNameBox">
                            {" "}
                            <span>Please enter the site name:</span>
                            <form onSubmit={this.exportData}>
                                <input className="siteInput" ref={this.siteNameRef}></input>
                                <button className="siteConfirmButton" type="submit">
                                    Confirm
                                </button>
                                <button className="siteCancelButton" type="button" onClick={this.cancelExport}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    ) : (
                        ""
                    )}
                    {this.state.siteNameBox ? (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backdropFilter: "blur(3px)", // Blur effect
                                animation: "fadeIn 0.3s ease", // Fade-in animation
                                zIndex: 999,
                            }}
                        ></div>
                    ) : (
                        ""
                    )}
                    <EcosystemMenu
                        changeSelection={this.changeSelection}
                        currentSelection={this.state.currentSelection}
                        currentPhoto={this.state.currentPhoto}
                        confirmSelection={this.confirmSelection}
                        changeEcosystem={this.changeEcosystem}
                        site={this.state.site}
                        imageLoaded={this.state.imageLoaded}
                    ></EcosystemMenu>
                    <PhotoInterface
                        imageLoaded={this.state.imageLoaded}
                        setImageLoaded={this.setImageLoaded}
                        imageWidth={800}
                        imageHeight={600}
                        site={this.state.site}
                        images={this.state.images}
                        currentPhoto={this.state.currentPhoto}
                        setCurrentPoint={this.setCurrentPoint}
                        newPhoto={this.newPhoto}
                        changePhoto={this.changePhoto}
                        removePhoto={this.removePhoto}
                    ></PhotoInterface>
                </div>
                <div className="metaBox">
                    <span className="meta">Linnaea v1.0.1</span>
                </div>
            </div>
        );
    }
}

export default App;
