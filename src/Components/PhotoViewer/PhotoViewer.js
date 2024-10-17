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
        this.focusPoint = 0;
        this.scale = 1;
    }

    // Zoom into clicked point, unless already focused, then reset view
    clickedPoint = (x, y, point, click) => {
        const { imageWidth, imageHeight } = this.props;

        if (this.transformWrapperRef.current) {
            if (click === "double") {
                const scale = 10;
                if (point === this.focusPoint) {
                    this.transformWrapperRef.current.setTransform(0, 0, 1);
                    this.focusPoint = 0;
                } else {
                    this.transformWrapperRef.current.setTransform(
                        imageWidth / 2 - x * scale,
                        imageHeight / 2 - y * scale,
                        scale
                    );
                    this.focusPoint = point;
                    this.props.setCurrentPoint(point);
                }
            } else {
                this.props.setCurrentPoint(point);
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
    handleImageUpload = (event) => {
        const files = event.target.files;

        this.props.newPhoto(files);

        event.target.value = null;
        // Simulate a delay for the upload animation (if needed)
    };

    // Buffer image and show loading animation until finished
    componentDidUpdate() {
        if (
            this.props.currentPhoto > 0 &&
            this.props.currentPhoto != this.currentPhoto
        ) {
            this.props.setImageLoaded(0);
            const image =
                this.props.site[
                    Object.keys(this.props.site)[this.props.currentPhoto - 1]
                ]["file"];
            const img = new Image();
            img.src = image;
            img.onload = () => this.props.setImageLoaded(1);
            this.currentPhoto = this.props.currentPhoto;
            this.image = image;
        }

        if (this.focusPoint && this.focusPoint != this.props.currentPoint) {
            const { imageWidth, imageHeight } = this.props;
            const { x, y } = this.getPointPosition(this.props.currentPoint);
            this.focusPoint = this.props.currentPoint;
            this.transformWrapperRef.current.setTransform(
                imageWidth / 2 - (x - imageWidth / (this.gridSize * 2)) * 10,
                imageHeight / 2 - (y + imageHeight / (this.gridSize * 2)) * 10,
                10
            );
        }
    }

    render() {
        const { imageUrl, imageWidth, imageHeight } = this.props;
        const points = Array.from(
            { length: this.gridSize * this.gridSize },
            (_, i) => i
        ); // 100 points

        return (
            // Overall viewport
            <div className={styles.viewPort}>
                {this.props.currentPhoto ? (
                    // If there's a photo loaded, display in the viewport
                    <TransformWrapper ref={this.transformWrapperRef}>
                        <TransformComponent>
                            {this.props.imageLoaded ? (
                                <div className={styles.photoViewer}>
                                    {/* The Image */}
                                    <img
                                        src={
                                            this.props.currentPhoto &&
                                            this.image
                                        }
                                        alt="Zoomable"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                        }}
                                    />
                                    {/* Overlay Points */}
                                    {points.map((point, index) => {
                                        const { x, y } =
                                            this.getPointPosition(index);
                                        return (
                                            <Crosshair
                                                key={index}
                                                site={this.props.site}
                                                currentPhoto={
                                                    this.props.currentPhoto
                                                }
                                                x={x}
                                                y={y}
                                                boxHeight={
                                                    imageHeight / this.gridSize
                                                }
                                                boxWidth={
                                                    imageWidth / this.gridSize
                                                }
                                                point={index + 1}
                                                current={
                                                    index + 1 ===
                                                    this.props.currentPoint
                                                        ? 1
                                                        : 0
                                                }
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
                    <div
                        className={styles.emptyPhoto}
                        onClick={() => this.fileInputRef.current.click()}
                    >
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
                        <input
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            ref={this.fileInputRef}
                            multiple
                            onChange={this.handleImageUpload}
                        ></input>
                    </div>
                )}
            </div>
        );
    }
}

export default PhotoViewer;
