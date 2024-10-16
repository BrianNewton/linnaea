import React, { useState, useEffect, useRef } from "react";
import styles from "./ImageThumbnail.module.scss";

const ImageThumbnail = ({ imageSrc, maxWidth, maxHeight }) => {
    const [thumbnail, setThumbnail] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadImage = async () => {
            const image = new Image();
            image.src = imageSrc;

            image.onload = () => {
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");

                // Calculate the scaling factor to keep aspect ratio
                let scale = Math.min(
                    maxWidth / image.width,
                    maxHeight / image.height
                );

                // Set canvas dimensions
                canvas.width = image.width * scale;
                canvas.height = image.height * scale;

                // Draw scaled-down image on the canvas
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Get the thumbnail as a base64-encoded string
                const thumbnailDataUrl = canvas.toDataURL("image/jpeg");
                setThumbnail(thumbnailDataUrl); // Set the thumbnail in state
            };
        };

        loadImage();
    }, [imageSrc, maxWidth, maxHeight]);

    return (
        <div
            style={{
                height: "60px",
                alignContent: "center",
            }}
        >
            {/* Canvas to generate the thumbnail, it won't be shown to the user */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Display the thumbnail */}
            {thumbnail ? (
                <img src={thumbnail} alt="Thumbnail" />
            ) : (
                <div className="loader"></div>
            )}
        </div>
    );
};

export default ImageThumbnail;
