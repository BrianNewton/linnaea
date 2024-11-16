import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu/EcosystemMenu";
import defaultEcosystem from "./biome/defaultEcosystem.json";
import PhotoInterface from "./Components/PhotoInterface/PhotoInterface";

// Don't save images, save image paths and save site info

class App extends React.Component {
    // make current point a per photo attribute

    state = {
        site: {},
        files: {},
        images: {},
        saveFile: "",
        currentSelection: { community: "", species: "", comments: "" },
        currentPhoto: 0,
        imageLoaded: 0,
    };

    setImageLoaded = (imageLoaded) => {
        this.setState({ imageLoaded });
    };

    componentDidMount() {
        this.setState({ ecosystem: defaultEcosystem });
        window.menuAPI.saveAs((event) => {
            const site_data = {
                site: this.state.site,
                files: this.state.files,
            };
            window.api.saveAs(site_data);
        });

        window.menuAPI.open((event, siteData) => {});
    }

    componentWillUnmount() {
        // ipcRenderer.removeListener("Save", alert("Uhhh"));
        // window.electronAPI.removeListner("do-something", this.handleAction);
    }

    handleAction = () => {
        alert("Is this on?");
    };

    newSite() {}

    openSite() {}

    openEcosystem() {}

    changeSelection = (currentSelection) => {
        this.setState({ currentSelection });
    };

    // Handles new photo upload
    newPhoto = (newImages) => {
        const site = { ...this.state.site };
        const files = { ...this.state.files };
        const images = { ...this.state.images };

        Object.keys(newImages).map((image) => {
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

        const currentPhoto = Object.keys(site)[Object.keys(site).length - 1];
        this.setState({ site, currentPhoto, files, images });
    };

    changeEcosystem = (ecosystem) => {
        const site = { ...this.state.site };
        site[this.state.currentPhoto]["ecosystem"] = ecosystem;
        this.setState({ site });
    };

    removePhoto = (image) => {
        const site = { ...this.state.site };
        const files = { ...this.state.files };
        const images = { ...this.state.images };

        if (this.state.currentPhoto === image) {
            const index = Object.keys(site).indexOf(image);
            const size = Object.keys(site).length;
            let currentPhoto = "";
            if (index === 0 && size === 1) {
                currentPhoto = "";
                console.log("here");
            } else if (index === 0 && size != 1) {
                currentPhoto = Object.keys(site)[index + 1];
            } else {
                currentPhoto = Object.keys(site)[index - 1];
            }
            this.setState({ currentPhoto });
        }

        delete site[image];
        delete files[image];
        delete images[image];

        this.setState({ site, files, images });
    };

    setCurrentPoint = (point) => {
        if (this.state.currentPhoto) {
            if (this.state.site[this.state.currentPhoto]["points"][point]["species"]) {
                this.setState({
                    currentSelection: this.state.site[this.state.currentPhoto]["points"][point],
                });
            } else {
                this.setState({
                    currentSelection: {
                        community: "",
                        species: "",
                        comments: "",
                    },
                });
            }
            const site = { ...this.state.site };
            site[this.state.currentPhoto]["currentPoint"] = point;
            this.setState({ site });
        }
    };

    confirmSelection = () => {
        const site = { ...this.state.site };
        const currentPoint = site[this.state.currentPhoto]["currentPoint"];
        Object.assign(site[this.state.currentPhoto]["points"][currentPoint], this.state.currentSelection);

        if (!site[this.state.currentPhoto]["points"][currentPoint]["species"]) {
            site[this.state.currentPhoto]["points"][currentPoint]["species"] = "None";
        }
        if (!site[this.state.currentPhoto]["points"][currentPoint]["community"]) {
            site[this.state.currentPhoto]["points"][currentPoint]["community"] = "None";
        }

        const currentSelection = { community: "", species: "", comments: "" };
        if (currentPoint < 100) {
            site[this.state.currentPhoto]["currentPoint"]++;
        }

        this.setState({ site, currentSelection });
    };

    changePhoto = (newPhoto) => {
        this.setState({ currentPhoto: newPhoto });
    };

    render() {
        return (
            <div className="linnaea">
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
        );
    }
}

export default App;
