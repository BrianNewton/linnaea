import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu/EcosystemMenu";
import defaultEcosystem from "./biome/defaultEcosystem.json";
import high from "./biome/high.json";
import medium from "./biome/medium.json";
import low from "./biome/low.json";
import PhotoViewer from "./Components/PhotoViewer/PhotoViewer";
import PointNavigator from "./Components/PointNavigator/PointNavigator";
import Gallery from "./Components/Gallery/Gallery";

class App extends React.Component {
    // make current point a per photo attribute

    /*
	state = {
		biome: { "ecosystem1": {
			community1: [species1, species2, ...],
			community2: [species1, species2,...]
		    }, { "ecosystem2": {
			community1: [species1, species2, ...],
			community2: [species1, species2,...]
		    },...}
		site: {
			"photo1.jpg": {
				1: [community, species],
				2: [community, species],
				...
			},
			"photo2.jpg" : {
				1: [community, species],
				2: [community, species],
				...
			},
			...
		},
        currentSelection: [community, species, comments]
		currentPhoto: "photo.jpg"
		currentPoint: 1
	}
	*/

    state = {
        ecosystem: {},
        site: {},
        currentSelection: { community: "", species: "", comments: "" },
        currentPhoto: 0,
        currentPoint: 0,
        imageLoaded: 0,
    };

    setImageLoaded = (imageLoaded) => {
        this.setState({ imageLoaded });
    };

    componentDidMount() {
        this.setState({ ecosystem: defaultEcosystem });
    }

    newSite() {}

    openSite() {}

    openEcosystem() {}

    changeSelection = (currentSelection) => {
        this.setState({ currentSelection });
    };

    newPhoto = (files) => {
        const site = { ...this.state.site };

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (site && file.name in site) {
                alert(`${file.name} is already uploaded!`);
            } else {
                const imageURL = URL.createObjectURL(file);
                site[file.name] = { file: imageURL, points: [] };
                site[file.name]["ecosystem"] = "";
                for (let i = 1; i <= 100; i++) {
                    site[file.name]["points"][i] = {
                        community: "",
                        species: "",
                        comments: "",
                    };
                }
            }
        }
        const currentPhoto = Object.keys(site).length;
        const currentPoint = 1;
        this.setState({ site, currentPhoto, currentPoint });
    };

    changeEcosystem = (ecosystem) => {
        const currentPhoto = Object.keys(this.state.site)[
            this.state.currentPhoto - 1
        ];
        const site = { ...this.state.site };
        site[currentPhoto]["ecosystem"] = ecosystem;
        this.setState({ site });
    };

    removePhoto = (image) => {
        const site = { ...this.state.site };
        const images = Object.keys(this.state.site);
        const deletedPhoto = images.indexOf(image);
        if (this.state.currentPhoto - 1 === deletedPhoto) {
            this.setState({ currentPhoto: deletedPhoto });
        }
        delete site[image];
        this.setState({ site });
    };

    setCurrentPoint = (point) => {
        const currentPhoto = Object.keys(this.state.site)[
            this.state.currentPhoto - 1
        ];
        if (this.state.site[currentPhoto]["points"][point]["species"]) {
            this.setState({
                currentSelection:
                    this.state.site[currentPhoto]["points"][point],
            });
        } else {
            this.setState({
                currentSelection: { community: "", species: "", comments: "" },
            });
        }
        this.setState({ currentPoint: point });
    };

    confirmSelection = () => {
        const site = { ...this.state.site };
        const currentPhoto = Object.keys(site)[this.state.currentPhoto - 1];
        Object.assign(
            site[currentPhoto]["points"][this.state.currentPoint],
            this.state.currentSelection
        );

        if (!site[currentPhoto]["points"][this.state.currentPoint]["species"]) {
            site[currentPhoto]["points"][this.state.currentPoint]["species"] =
                "None";
        }
        if (
            !site[currentPhoto]["points"][this.state.currentPoint]["community"]
        ) {
            site[currentPhoto]["points"][this.state.currentPoint]["community"] =
                "None";
        }

        const currentSelection = { community: "", species: "", comments: "" };
        const currentPoint = this.state.currentPoint + 1;

        this.setState({ site, currentSelection, currentPoint });
    };

    changePhoto = (newPhoto) => {
        this.setState({ currentPhoto: newPhoto });
    };

    render() {
        return (
            <div className="linnaea">
                <div>
                    <EcosystemMenu
                        changeSelection={this.changeSelection}
                        currentSelection={this.state.currentSelection}
                        currentPoint={this.state.currentPoint}
                        currentPhoto={this.state.currentPhoto}
                        confirmSelection={this.confirmSelection}
                        changeEcosystem={this.changeEcosystem}
                        site={this.state.site}
                        imageLoaded={this.state.imageLoaded}
                    ></EcosystemMenu>
                </div>
                <div className="photoInterface">
                    <PointNavigator></PointNavigator>
                    <PhotoViewer
                        imageUrl="sample.jpg"
                        imageLoaded={this.state.imageLoaded}
                        setImageLoaded={this.setImageLoaded}
                        imageWidth={800}
                        imageHeight={600}
                        site={this.state.site}
                        currentPhoto={this.state.currentPhoto}
                        currentPoint={this.state.currentPoint}
                        setCurrentPoint={this.setCurrentPoint}
                        newPhoto={this.newPhoto}
                    ></PhotoViewer>
                    <Gallery
                        site={this.state.site}
                        newPhoto={this.newPhoto}
                        currentPhoto={this.state.currentPhoto}
                        changePhoto={this.changePhoto}
                        removePhoto={this.removePhoto}
                    ></Gallery>
                </div>
            </div>
        );
    }
}

export default App;
