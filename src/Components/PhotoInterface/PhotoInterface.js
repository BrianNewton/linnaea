import React from "react";
import styles from "./PhotoInterface.module.scss";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
import Gallery from "../Gallery/Gallery";
import PointNavigator from "../PointNavigator/PointNavigator";

class PhotoInterface extends React.Component {
    state = {
        scale: 1,
        imageWidth: 800,
        imageHeight: 600,
    };

    setScale = (scale) => {
        this.setState({ scale });
    };

    getPointXY = (point) => {};

    zoomToPoint = (point, scale) => {};

    zoomIn = (point, scale) => {};

    zoomOut = (point, scale) => {};

    resetZoom = (point, scale) => {};

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
                    imageWidth={800}
                    imageHeight={600}
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
