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
        lastPoint: 1,

        // calc(100vh - 64px);
    };

    setLastPoint = (point) => {
        this.setState({ lastPoint: point });
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
                    setLastPoint={this.setLastPoint}
                    lastPoint={this.state.lastPoint}
                    scale={this.state.scale}
                    site={this.props.site}
                    currentPhoto={this.props.currentPhoto}
                    setCurrentPoints={this.props.setCurrentPoints}
                ></PointNavigator>
                <PhotoViewer
                    imageLoaded={this.props.imageLoaded}
                    setImageLoaded={this.props.setImageLoaded}
                    lastPoint={this.state.lastPoint}
                    setLastPoint={this.setLastPoint}
                    imageWidth={this.state.imageWidth}
                    imageHeight={this.state.imageHeight}
                    site={this.props.site}
                    currentPhoto={this.props.currentPhoto}
                    currentPoints={this.props.currentPoints}
                    setCurrentPoints={this.props.setCurrentPoints}
                    setCurrentPoint={this.props.setCurrentPoint}
                    newPhoto={this.props.newPhoto}
                    setScale={this.setScale}
                    images={this.props.images}
                    scale={this.state.scale}
                ></PhotoViewer>
                <Gallery
                    site={this.props.site}
                    images={this.props.images}
                    newPhoto={this.props.newPhoto}
                    setScale={this.setScale}
                    currentPhoto={this.props.currentPhoto}
                    changePhoto={this.props.changePhoto}
                    removePhoto={this.props.removePhoto}
                ></Gallery>
            </div>
        );
    }
}

export default PhotoInterface;
