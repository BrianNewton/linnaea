import React from "react";
import EcosystemMenu from "./Components/EcosystemMenu";
import defaultEcosystem from "./defaultEcosystem.json";
import PhotoViewer from "./Components/PhotoViewer";
import PointNavigator from "./Components/PointNavigator";

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

    render() {
        return (
            <div className="linnaea">
                <div>
                    <div>
                        <button className="menuButton">Menu</button>
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
                <div>
                    <PointNavigator></PointNavigator>
                    <PhotoViewer
                        imageUrl="sample.jpg"
                        imageWidth={840}
                        imageHeight={630}
                    ></PhotoViewer>
                </div>
            </div>
        );
    }
}

export default App;
