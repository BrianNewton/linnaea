import React, { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Crosshair from "./Crosshair";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.gridSize = 10; // 10x10 grid = 100 points\
    }

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
            <TransformWrapper>
                <TransformComponent>
                    <div
                        style={{
                            position: "relative",
                            width: `${imageWidth}px`,
                            height: `${imageHeight}px`,
                            border: "1px solid black",
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
