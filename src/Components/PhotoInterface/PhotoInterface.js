import React from "react";
import styles from "./PhotoInterface.module.scss";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
import Gallery from "../Gallery/Gallery";
import PointNavigator from "../PointNavigator/PointNavigator";

class PhotoInterface extends React.Component {
    state = {
        scale: 1,
        imageWidth: (window.innerHeight - 178) / 0.75,
        imageHeight: window.innerHeight - 178,

        // calc(100vh - 64px);
    };

    setScale = (scale) => {
        this.setState({ scale });
    };

    handleResize = () => {
        this.setState({
            imageWidth: (window.innerHeight - 178) / 0.75,
            imageHeight: window.innerHeight - 178,
        });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        return (
            <div className={styles.photoInterface}>
                <PointNavigator
                    setScale={this.setScale}
                    scale={this.state.scale}
                    currentPoint={this.props.currentPoint}
                    setCurrentPoint={this.props.setCurrentPoint}
                ></PointNavigator>
                <PhotoViewer
                    imageLoaded={this.props.imageLoaded}
                    setImageLoaded={this.props.setImageLoaded}
                    imageWidth={this.state.imageWidth}
                    imageHeight={this.state.imageHeight}
                    site={this.props.site}
                    currentPhoto={this.props.currentPhoto}
                    currentPoint={this.props.currentPoint}
                    setCurrentPoint={this.props.setCurrentPoint}
                    newPhoto={this.props.newPhoto}
                    setScale={this.setScale}
                    scale={this.state.scale}
                ></PhotoViewer>
                <Gallery
                    site={this.props.site}
                    newPhoto={this.props.newPhoto}
                    currentPhoto={this.props.currentPhoto}
                    changePhoto={this.props.changePhoto}
                    removePhoto={this.props.removePhoto}
                ></Gallery>
            </div>
        );
    }
}

export default PhotoInterface;
