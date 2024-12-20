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
        const index = Object.keys(this.props.site).indexOf(this.props.currentPhoto) + 3;

        if (index * 116 - this.scrollerRef.current.scrollLeft > this.scrollerRef.current.getBoundingClientRect().width) {
            this.scrollerRef.current.scrollTo({
                left: (index - 5) * 116,
                behavior: "smooth",
            });
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
                left: (index - 3) * 116,
                behavior: "smooth",
            });
        }
        this.props.setScale(1);
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
            this.props.setScale(1);
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
            this.props.setScale(1);
        }
    };

    handleNewImage = () => {
        window.rendererAPI.imageUpload(Object.keys(this.props.site)).then((response) => {
            this.props.newPhoto(response);

            // Sroll to end of gallery
            requestAnimationFrame(() => {
                this.scrollerRef.current.scrollTo({
                    left: 0,
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
                    {/* Upload button */}
                    <button className={styles.newPhotoButton} onClick={this.handleNewImage}></button>
                    {/* Scroll window includes images */}
                    <div className={styles.scroller} ref={this.scrollerRef}>
                        {/* Scrolling image content */}
                        <div className={styles.galleryScroll}>
                            {this.props.site &&
                                Object.keys(this.props.site).map((image, index) => (
                                    // Contains image and remove button
                                    <div
                                        className={`${styles.galleryItem} ${image === this.props.currentPhoto ? styles.current : ""} ${
                                            this.props.site[image]["completed"] ? styles.completed : ""
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
                                            data-image={image}
                                            className={`${styles.imageContainer} ${
                                                image === this.props.currentPhoto ? styles.current : ""
                                            } `}
                                            onClick={this.handleClick}
                                        >
                                            <ImageThumbnail
                                                imageSrc={this.props.images[image]}
                                                maxWidth={80}
                                                maxHeight={60}
                                            ></ImageThumbnail>
                                        </div>
                                        {/* Checkmark overlay if the photo is completed*/}
                                        <svg
                                            className={`${this.props.site[image]["completed"] ? styles.completed : styles.uncompleted}`}
                                            fill="#00f900"
                                            viewBox="0 0 1024 1024"
                                            width="64px"
                                            height="64px"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="#00f900"
                                        >
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke="#CCCCCC"
                                                stroke-width="2.048"
                                            ></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M351.605 663.268l481.761-481.761c28.677-28.677 75.171-28.677 103.847 0s28.677 75.171 0 103.847L455.452 767.115l.539.539-58.592 58.592c-24.994 24.994-65.516 24.994-90.51 0L85.507 604.864c-28.677-28.677-28.677-75.171 0-103.847s75.171-28.677 103.847 0l162.25 162.25z"></path>
                                            </g>
                                        </svg>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <button className={styles.nextGalleryButton} onClick={this.nextPhoto}></button>
            </div>
        );
    }
}

export default Gallery;
