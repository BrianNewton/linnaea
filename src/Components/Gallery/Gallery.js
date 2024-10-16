import React, { Component } from "react";
import ImageThumbnail from "../ImageThumbnail/ImageThumbnail";
import styles from "./Gallery.module.scss";

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.scrollerRef = React.createRef();
    }

    // Handles upload of one or more images
    handleImageUpload = (event) => {
        const files = event.target.files;

        this.props.newPhoto(files);

        // Sroll to end of gallery
        requestAnimationFrame(() => {
            this.scrollerRef.current.scrollTo({
                left: this.scrollerRef.current.scrollWidth,
                behavior: "smooth",
            });
        });

        event.target.value = null;
    };

    // Selecting a image in the gallery
    handleClick = (event) => {
        const index = event.currentTarget.getAttribute("data-index"); // index of selected photo

        this.props.changePhoto(Number(index) + 1); // change selected photo

        //if selected photo is cut off by the right side of the gallery, scroll right
        if (index * 116 < this.scrollerRef.current.scrollLeft + 50) {
            this.scrollerRef.current.scrollTo({
                left:
                    Math.floor(this.scrollerRef.current.scrollLeft / 116) *
                        116 -
                    116,
                behavior: "smooth",
            });
        } else if (
            // if selected image is cut off on the left, scroll left
            index * 116 - this.scrollerRef.current.scrollLeft >
            432
        ) {
            this.scrollerRef.current.scrollTo({
                left: (index - 4) * 116,
                behavior: "smooth",
            });
        }
    };

    // handles removal of a photo
    handleRemovePhoto = (event) => {
        const image = event.currentTarget.getAttribute("data-image");
        const index = event.currentTarget.getAttribute("data-index");

        if (window.confirm(`Remove ${image}?`)) {
            this.props.removePhoto(image);
            if (this.props.currentPhoto - 1 > index) {
                this.props.changePhoto(this.props.currentPhoto - 1);
            }
        }
    };

    // next photo button press
    nextPhoto = (event) => {
        if (this.props.currentPhoto < Object.keys(this.props.site).length) {
            this.props.changePhoto(this.props.currentPhoto + 1);
            const index = this.props.currentPhoto + 1;

            if (index * 116 - this.scrollerRef.current.scrollLeft > 580) {
                this.scrollerRef.current.scrollTo({
                    left: (index - 5) * 116,
                    behavior: "smooth",
                });
            }
        } else {
            this.props.changePhoto(this.props.currentPhoto);
        }
    };

    // previous photo button press
    prevPhoto = (event) => {
        if (this.props.currentPhoto > 1) {
            this.props.changePhoto(this.props.currentPhoto - 1);
            const index = this.props.currentPhoto - 2;

            if (index * 116 < this.scrollerRef.current.scrollLeft + 50) {
                this.scrollerRef.current.scrollTo({
                    left:
                        Math.floor(this.scrollerRef.current.scrollLeft / 116) *
                            116 -
                        116,
                    behavior: "smooth",
                });
            }
        } else {
            this.props.changePhoto(this.props.currentPhoto);
        }
    };

    render() {
        return (
            // entire gallery
            <div className={styles.gallery}>
                <button
                    className={styles.prevGalleryButton}
                    onClick={this.prevPhoto}
                ></button>
                {/* Gallery container including images and upload button */}
                <div className={styles.galleryContainer}>
                    {/* Scroll window includes images */}
                    <div className={styles.scroller} ref={this.scrollerRef}>
                        {/* Scrolling image content */}
                        <div className={styles.galleryScroll}>
                            {this.props.site &&
                                Object.keys(this.props.site).map(
                                    (image, index) => (
                                        // Contains image and remove button
                                        <div
                                            className={`${styles.galleryItem} ${
                                                index + 1 ===
                                                this.props.currentPhoto
                                                    ? styles.current
                                                    : ""
                                            }`}
                                            key={`imageContainer_${index}`}
                                            title={`${image}`}
                                        >
                                            {/* Remove image button, only visible on hover */}
                                            <button
                                                className={styles.removePhoto}
                                                key={`removePhoto_${index}`}
                                                data-image={image}
                                                data-index={index}
                                                onClick={this.handleRemovePhoto}
                                            ></button>
                                            {/* Contains the image */}
                                            <div
                                                key={`galleryItem-${index}`}
                                                data-index={index}
                                                className={`${
                                                    styles.imageContainer
                                                } ${
                                                    index + 1 ===
                                                    this.props.currentPhoto
                                                        ? styles.current
                                                        : ""
                                                }`}
                                                onClick={this.handleClick}
                                            >
                                                <ImageThumbnail
                                                    imageSrc={
                                                        this.props.site[image][
                                                            "file"
                                                        ]
                                                    }
                                                    maxWidth={80}
                                                    maxHeight={60}
                                                ></ImageThumbnail>
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                    {/* Upload button */}
                    <button
                        className={styles.newPhotoButton}
                        onClick={() => this.fileInputRef.current.click()}
                    ></button>
                </div>
                <button
                    className={styles.nextGalleryButton}
                    onClick={this.nextPhoto}
                ></button>
                {/* Hidden file input */}
                <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    ref={this.fileInputRef}
                    multiple
                    onChange={this.handleImageUpload}
                ></input>
            </div>
        );
    }
}

export default Gallery;
