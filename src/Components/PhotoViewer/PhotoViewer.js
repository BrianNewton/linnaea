import React, { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Crosshair from "../Crosshair/Crosshair";
import styles from "./PhotoViewer.module.scss";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.gridSize = 10; // 10x10 grid = 100 points\
        this.transformWrapperRef = React.createRef();
        this.fileInputRef = React.createRef();
        this.image = "";
        this.currentPhoto = this.props.currentPhoto;
    }

    state = {
        scale: 1,
        focusPoint: 1,
    };

    // Transform to point with specified scale
    transformToPoint(x, y, scale) {
        const { imageWidth, imageHeight } = this.props;
        let xTransform = imageWidth / 2 - (x + imageWidth / (this.gridSize * 2)) * scale;
        let yTransform = imageHeight / 2 - (y + imageHeight / (this.gridSize * 2)) * scale;

        if (xTransform > 0) {
            xTransform = 0;
        } else if (xTransform < -1 * imageWidth * (scale - 1)) {
            xTransform = -1 * imageWidth * (scale - 1);
        }

        if (yTransform > 0) {
            yTransform = 0;
        } else if (yTransform < -1 * imageHeight * (scale - 1)) {
            yTransform = -1 * imageHeight * (scale - 1);
        }
        if (this.transformWrapperRef.current) {
            this.transformWrapperRef.current.setTransform(xTransform, yTransform, scale);
        }
    }

    // Zoom into clicked point, unless already focused, then reset view
    clickedPoint = (x, y, point, click, shiftKey, ctrlKey) => {
        const { imageWidth, imageHeight } = this.props;

        if (this.transformWrapperRef.current) {
            if (click === "double") {
                const scale = 15;
                if (point === this.focusPoint) {
                    this.transformWrapperRef.current.setTransform(0, 0, 1);
                    this.focusPoint = 0;
                    this.setState({ scale: 1 });
                    this.props.setScale(1);
                } else {
                    this.transformWrapperRef.current.setTransform(imageWidth / 2 - x * scale, imageHeight / 2 - y * scale, scale);
                    this.focusPoint = point;
                    this.props.setCurrentPoints([point]);
                    this.setState({ scale: 9 });
                    this.props.setScale(9);
                }
            } else {
                const points = [];

                if (shiftKey && ctrlKey) {
                    // if shift and control, select all points in the square bound by the two points as vertices
                    const row1 = Math.floor((point - 1) / 10);
                    const col1 = (point - 1) % 10;

                    const row2 = Math.floor((this.props.lastPoint - 1) / 10);
                    const col2 = (this.props.lastPoint - 1) % 10;

                    const minRow = Math.min(row1, row2);
                    const maxRow = Math.max(row1, row2);
                    const minCol = Math.min(col1, col2);
                    const maxCol = Math.max(col1, col2);

                    for (let row = minRow; row <= maxRow; row++) {
                        for (let col = minCol; col <= maxCol; col++) {
                            points.push(row * 10 + col + 1);
                        }
                    }
                    this.props.setCurrentPoints(points);
                } else if (shiftKey) {
                    // if shift, select all points between teh two points
                    const step = this.props.lastPoint < point ? 1 : -1;
                    for (let i = this.props.lastPoint; step > 0 ? i <= point : i >= point; i += step) {
                        points.push(i);
                    }
                    this.props.setCurrentPoints(points);
                } else if (ctrlKey) {
                    // if control, add selected point to selection
                    console.log("here");
                    const pointsAppend = this.props.currentPoints;
                    pointsAppend.push(point);
                    this.props.setCurrentPoints(pointsAppend);
                } else {
                    // if nothing just select point
                    points.push(point);
                    this.props.setCurrentPoints(points);
                }
                this.props.setLastPoint(point);
            }
        }
    };

    // Function to calculate point positions
    getPointPosition(index) {
        const { imageWidth, imageHeight } = this.props;

        // Calculate the row and column position for the point
        const row = Math.floor(index / this.gridSize);
        const col = index % this.gridSize;

        // Calculate the x and y position based on evenly distributed points across the image
        const x = (imageWidth / this.gridSize) * col; // +0.5 centers the point in its cell
        const y = (imageHeight / this.gridSize) * row; // +0.5 centers the point in its cell

        return { x, y };
    }

    // Upload image when clicking on empty canvas
    handleNewImage = () => {
        window.rendererAPI.imageUpload(Object.keys(this.props.site)).then((response) => {
            this.props.newPhoto(response);
        });
    };

    // Buffer image and show loading animation until finished
    componentDidUpdate() {
        // load new photo with buffer animation
        if (this.props.currentPhoto && this.props.currentPhoto !== this.currentPhoto) {
            this.setState({ scale: 1 });
            this.props.setScale(1);
            const { x, y } = this.getPointPosition(this.props.lastPoint - 1);
            this.transformToPoint(x, y, 1);
            this.props.setImageLoaded(0);
            // const image = Object.keys(this.props.site)[this.props.currentPhoto - 1];

            const img = new Image();
            img.src = this.props.images[this.props.currentPhoto];
            img.onload = () => this.props.setImageLoaded(1);
            this.currentPhoto = this.props.currentPhoto;
            this.image = img.src;
        }

        // new current point
        if (this.props.currentPhoto && this.state.focusPoint !== this.props.lastPoint) {
            const { x, y } = this.getPointPosition(this.props.lastPoint - 1);
            this.transformToPoint(x, y, this.state.scale);
            this.setState({ focusPoint: this.props.lastPoint });
        }

        // confirmed selection
        if (this.props.currentPhoto && this.props.currentPoints.length === 1 && !this.props.currentPoints.includes(this.props.lastPoint)) {
            const { x, y } = this.getPointPosition(this.props.currentPoints[0] - 1);
            this.transformToPoint(x, y, this.state.scale);
            this.setState({ focusPoint: this.props.currentPoints[0] });
            this.props.setLastPoint(this.props.currentPoints[0]);
        }

        // change zoom
        if (this.props.currentPhoto && this.state.scale !== this.props.scale) {
            const { x, y } = this.getPointPosition(this.props.lastPoint - 1);
            this.transformToPoint(x, y, this.props.scale);
            this.setState({ scale: this.props.scale });
        }
    }

    zoomChange = (event) => {
        setTimeout(() => {
            this.props.setScale(event.state.scale);
            this.setState({ scale: event.state.scale });
        }, 150);
    };

    render() {
        const { imageWidth, imageHeight } = this.props;
        const points = Array.from({ length: this.gridSize * this.gridSize }, (_, i) => i); // 100 points

        return (
            // Overall viewport
            <div className={styles.viewPort}>
                {this.props.currentPhoto ? (
                    // If there's a photo loaded, display in the viewport
                    <TransformWrapper
                        ref={this.transformWrapperRef}
                        onZoomStop={this.zoomChange}
                        panning={{ allowLeftClickPan: false, wheelPanning: true }}
                    >
                        <TransformComponent>
                            {this.props.imageLoaded ? (
                                <div className={styles.photoViewer}>
                                    {/* The Image */}
                                    <img
                                        src={this.props.currentPhoto && this.image}
                                        alt="Zoomable"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                        }}
                                    />
                                    {/* Overlay Points */}
                                    {points.map((point, index) => {
                                        const { x, y } = this.getPointPosition(index);
                                        return (
                                            <Crosshair
                                                key={index}
                                                site={this.props.site}
                                                currentPhoto={this.props.currentPhoto}
                                                x={x}
                                                y={y}
                                                boxHeight={imageHeight / this.gridSize}
                                                boxWidth={imageWidth / this.gridSize}
                                                point={index + 1}
                                                current={this.props.currentPoints.includes(index + 1) ? 1 : 0}
                                                clickedPoint={this.clickedPoint}
                                            ></Crosshair>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="loader"></div>
                            )}
                        </TransformComponent>
                    </TransformWrapper>
                ) : (
                    // If there's no image loaded, show upload button
                    <div className={styles.emptyPhoto} onClick={this.handleNewImage}>
                        <div
                            style={{
                                position: "absolute",
                                top: "53%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontStyle: "italic",
                                color: "#0e5c2e",
                                opacity: "50%",
                            }}
                        >
                            Upload an image
                        </div>
                        {""}
                    </div>
                )}
            </div>
        );
    }
}

export default PhotoViewer;
