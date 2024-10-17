import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu/EcosystemMenu";
import defaultEcosystem from "./biome/defaultEcosystem.json";
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
    };

    componentDidMount() {
        const selected = Object.fromEntries(
            Object.keys(defaultEcosystem).map((key) => [key, ""]) // or null, '', or any default value
        );
        this.setState({ ecosystem: defaultEcosystem, selected: selected });
    }

    newSite() {}

    openSite() {}

    openEcosystem() {}

    changeSelection = (currentSelection) => {
        this.setState({ currentSelection });
    };

    changeSearchSpecies = (searchSpecies) => {
        this.setState({ searchSpecies: searchSpecies });
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
        console.log("1");
        const currentSelection = { community: "", species: "", comments: "" };
        console.log("2");
        const currentPoint = this.state.currentPoint + 1;
        console.log("3");

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
                        ecosystem={this.state.ecosystem}
                        changeSelection={this.changeSelection}
                        changeSearchSpecies={this.changeSearchSpecies}
                        searchSpecies={this.state.searchSpecies}
                        currentSelection={this.state.currentSelection}
                        currentPoint={this.state.currentPoint}
                        confirmSelection={this.confirmSelection}
                    ></EcosystemMenu>
                </div>
                <div className="photoInterface">
                    <PointNavigator></PointNavigator>
                    <PhotoViewer
                        imageUrl="sample.jpg"
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
