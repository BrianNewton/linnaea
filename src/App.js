import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu";
import defaultEcosystem from "./defaultEcosystem.json";
import PhotoViewer from "./Components/PhotoViewer";
import PointNavigator from "./Components/PointNavigator";
import Gallery from "./Components/Gallery";

class App extends React.Component {
    /*
	state = {
		ecosystem: {
			community1: [species1, species2, ...],
			community2: [species1, species2,...]
		},
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
		currentPhoto: "photo.jpg"
		currentPoint: 1
	}
	*/

    state = {
        ecosystem: {},
        selected: {},
        selectedSpecies: "",
        searchSpecies: "",
        site: {},
        currentPhoto: 0,
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

    changeSelection = (species, communityName) => {
        const selected = Object.fromEntries(
            Object.keys(this.state.ecosystem).map((key) => [key, ""]) // or null, '', or any default value
        );
        selected[communityName] = species;
        this.setState({ selected: selected, selectedSpecies: species });
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
                    site[file.name]["points"][i] = [];
                }
            }
        }
        const currentPhoto = Object.keys(site).length;
        this.setState({ site, currentPhoto });
    };

    removePhoto = (image) => {
        const site = { ...this.state.site };
        delete site[image];
        this.setState({ site });
    };

    changePhoto = (newPhoto) => {
        this.setState({ currentPhoto: newPhoto });
    };

    render() {
        const images = {
            "/SampleSite/DSCF0323.JPG": {},
            "/SampleSite/DSCF0324.JPG": {},
        };

        return (
            <div className="linnaea">
                <div>
                    <div>
                        <button className="menuButton"></button>
                    </div>
                    <EcosystemMenu
                        ecosystem={this.state.ecosystem}
                        changeSelection={this.changeSelection}
                        changeSearchSpecies={this.changeSearchSpecies}
                        searchSpecies={this.state.searchSpecies}
                        selectedSpecies={this.state.selectedSpecies}
                        selected={this.state.selected}
                    ></EcosystemMenu>
                </div>
                <div className="photoInterface">
                    <PointNavigator></PointNavigator>
                    <PhotoViewer
                        imageUrl="sample.jpg"
                        imageWidth={800}
                        imageHeight={600}
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
