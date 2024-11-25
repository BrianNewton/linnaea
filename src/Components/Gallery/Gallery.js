import React, { Component } from "react";
import ImageThumbnail from "../ImageThumbnail/ImageThumbnail";
import styles from "./Gallery.module.scss";

// Fix bulk upload scroll

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.numImages = 0;
    }

    componentDidUpdate() {
        if (this.numImages < Object.keys(this.props.site).length) {
            requestAnimationFrame(() => {
                this.scrollerRef.current.scrollTo({
                    left: this.scrollerRef.current.scrollWidth,
                    behavior: "smooth",
                });
            });
            this.numImages = Object.keys(this.props.site).length;
        }
    }

    // Selecting a image in the gallery
    handleClick = (event) => {
        const index = event.currentTarget.getAttribute("data-index"); // index of selected photo
        const image = event.currentTarget.getAttribute("data-image");

        this.props.changePhoto(image); // change selected photo

        //if selected photo is cut off by the right side of the gallery, scroll right
        if (index * 116 < this.scrollerRef.current.scrollLeft + 50) {
            this.scrollerRef.current.scrollTo({
                left: Math.floor(this.scrollerRef.current.scrollLeft / 116) * 116 - 116,
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

        if (window.confirm(`Remove ${image}?`)) {
            this.props.removePhoto(image);
            // if (Object.keys(this.props.site).indexOf(this.props.currentPhoto) > index) {
            //     this.props.changePhoto(this.props.currentPhoto - 1);
            // }
        }
        this.numImages--;
    };

    // next photo button press
    nextPhoto = (event) => {
        if (this.props.currentPhoto) {
            if (Object.keys(this.props.site).indexOf(this.props.currentPhoto) < Object.keys(this.props.site).length - 1) {
                this.props.changePhoto(Object.keys(this.props.site)[Object.keys(this.props.site).indexOf(this.props.currentPhoto) + 1]);
                const index = Object.keys(this.props.site).indexOf(this.props.currentPhoto) + 3;

                if (index * 116 - this.scrollerRef.current.scrollLeft > 580) {
                    this.scrollerRef.current.scrollTo({
                        left: (index - 5) * 116,
                        behavior: "smooth",
                    });
                }
            } else {
                this.props.changePhoto(Object.keys(this.props.site)[Object.keys(this.props.site).indexOf(this.props.currentPhoto)]);
            }
        }
    };

    // previous photo button press
    prevPhoto = (event) => {
        if (this.props.currentPhoto) {
            if (Object.keys(this.props.site).indexOf(this.props.currentPhoto) > 0) {
                this.props.changePhoto(Object.keys(this.props.site)[Object.keys(this.props.site).indexOf(this.props.currentPhoto) - 1]);
                const index = Object.keys(this.props.site).indexOf(this.props.currentPhoto) - 1;

                if (index * 116 < this.scrollerRef.current.scrollLeft + 50) {
                    this.scrollerRef.current.scrollTo({
                        left: Math.floor(this.scrollerRef.current.scrollLeft / 116) * 116 - 116,
                        behavior: "smooth",
                    });
                }
            } else {
                this.props.changePhoto(Object.keys(this.props.site)[Object.keys(this.props.site).indexOf(this.props.currentPhoto)]);
            }
        }
    };

    handleNewImage = () => {
        window.rendererAPI.imageUpload(Object.keys(this.props.site)).then((response) => {
            this.props.newPhoto(response);

            // Sroll to end of gallery
            requestAnimationFrame(() => {
                this.scrollerRef.current.scrollTo({
                    left: this.scrollerRef.current.scrollWidth,
                    behavior: "smooth",
                });
            });

            this.numImages += response.length;
        });
    };

    render() {
        return (
            // entire gallery
            <div className={styles.gallery}>
                <button className={styles.prevGalleryButton} onClick={this.prevPhoto}></button>
                {/* Gallery container including images and upload button */}
                <div className={styles.galleryContainer}>
                    {/* Scroll window includes images */}
                    <div className={styles.scroller} ref={this.scrollerRef}>
                        {/* Scrolling image content */}
                        <div className={styles.galleryScroll}>
                            {this.props.site &&
                                Object.keys(this.props.site).map((image, index) => (
                                    // Contains image and remove button
                                    <div
                                        className={`${styles.galleryItem} ${image === this.props.currentPhoto ? styles.current : ""}`}
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
                                            data-image={image}
                                            className={`${styles.imageContainer} ${
                                                image === this.props.currentPhoto ? styles.current : ""
                                            }`}
                                            onClick={this.handleClick}
                                        >
                                            <ImageThumbnail
                                                imageSrc={this.props.images[image]}
                                                maxWidth={80}
                                                maxHeight={60}
                                            ></ImageThumbnail>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {/* Upload button */}
                    <button className={styles.newPhotoButton} onClick={this.handleNewImage}></button>
                </div>
                <button className={styles.nextGalleryButton} onClick={this.nextPhoto}></button>
            </div>
        );
    }
}

export default Gallery;
