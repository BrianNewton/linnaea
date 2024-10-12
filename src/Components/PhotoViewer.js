import React, { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Crosshair from "./Crosshair";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.gridSize = 10; // 10x10 grid = 100 points\
        this.transformWrapperRef = React.createRef();
    }

    state = {
        focusPoint: 0,
    };

    setFocusPoint = (x, y) => {
        this.setState({ focusPoint: x + y * 10 });
    };

    clickedPoint = (x, y) => {
        const { imageWidth, imageHeight } = this.props;

        // Use the ref to access TransformWrapper's methods
        if (this.transformWrapperRef.current) {
            // Calculate the x and y offsets (center the clicked point in the viewport)
            const scale = 10;

            console.log(x);
            console.log(y);

            // Set new transform with the calculated x and y position, zooming to a level of 2 (or any desired zoom level)
            this.transformWrapperRef.current.setTransform(
                imageWidth / 2 - x * scale,
                imageHeight / 2 - y * scale,
                scale
            );
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

    render() {
        const { imageUrl, imageWidth, imageHeight } = this.props;
        const points = Array.from(
            { length: this.gridSize * this.gridSize },
            (_, i) => i
        ); // 100 points

        return (
            <TransformWrapper ref={this.transformWrapperRef}>
                <TransformComponent>
                    <div
                        style={{
                            position: "relative",
                            width: `${imageWidth}px`,
                            height: `${imageHeight}px`,
                            overflow: "hidden",
                        }}
                    >
                        {/* The Image */}
                        <img
                            src={imageUrl}
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
                                    x={x}
                                    y={y}
                                    boxHeight={imageHeight / this.gridSize}
                                    boxWidth={imageWidth / this.gridSize}
                                    clickedPoint={this.clickedPoint}
                                ></Crosshair>
                            );
                        })}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        );
    }
}

export default PhotoViewer;
