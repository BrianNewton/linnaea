import React from "react";
import Menu from "./Components/Menu";
import defaultEcosystem from "./defaultEcosystem.json";
import PhotoViewer from "./Components/PhotoViewer";

class App extends React.Component {
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
                <Menu
                    ecosystem={this.state.ecosystem}
                    changeSelection={this.changeSelection}
                    changeSearchSpecies={this.changeSearchSpecies}
                    searchSpecies={this.state.searchSpecies}
                    selectedSpecies={this.state.selectedSpecies}
                    selected={this.state.selected}
                ></Menu>
                <PhotoViewer
                    imageUrl="sample.jpg"
                    imageWidth={800}
                    imageHeight={600}
                ></PhotoViewer>
            </div>
        );
    }
}

export default App;
