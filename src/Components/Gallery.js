import React, { Component } from "react";
import ImageThumbnail from "./ImageThumbnail";

/* TODO
    - Remove an image
    - Thumbnail loading animation
    - Load multiple files at once
    - Duplicate files not allowed
    - Change site object to local file ref
*/

class Gallery extends Component {
    constructor(props) {
        super(props);
        // Create a reference for the hidden file input
        this.fileInputRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.state = {
            uploading: false, // State to track if an image is being uploaded
            scrollPosition: 5,
        };
    }

    handleImageUpload = (event) => {
        const file = event.target.files[0];
        const image = URL.createObjectURL(file);
        this.imageSource = image; // Update the image source
        this.props.newPhoto(image);

        if (Object.keys(this.props.site).length >= this.state.scrollPosition) {
            const scrollPosition = this.state.scrollPosition + 1;
            console.log(scrollPosition);
            this.setState({ scrollPosition });

            requestAnimationFrame(() => {
                //ITS BECAUSE OF THE THUMBNAIL
                this.scrollerRef.current.scrollTo({
                    left: this.scrollerRef.current.scrollWidth,
                    behavior: "smooth", // Smooth scrolling
                });
            });
        }

        // Simulate a delay for the upload animation (if needed)
    };

    handleClick = (event) => {
        const index = event.currentTarget.getAttribute("data-index");
        console.log(index);
        if (index) {
            this.props.changePhoto(Number(index) + 1);
            console.log(this.scrollerRef.current.scrollLeft);
            console.log(index * 108);
            if (index * 108 < this.scrollerRef.current.scrollLeft + 108) {
                this.scrollerRef.current.scrollTo({
                    left:
                        Math.floor(this.scrollerRef.current.scrollLeft / 108) *
                            108 -
                        108,
                    behavior: "smooth",
                });
            } else if (
                index * 108 - this.scrollerRef.current.scrollLeft >
                432
            ) {
                this.scrollerRef.current.scrollTo({
                    left: (index - 4) * 108,
                    behavior: "smooth",
                });
            }
        } else {
            alert("How have you arrived here?");
        }
    };

    nextPhoto = (event) => {
        if (this.props.currentPhoto < Object.keys(this.props.site).length) {
            this.props.changePhoto(this.props.currentPhoto + 1);
            const index = this.props.currentPhoto + 1;
            if (index) {
                console.log(this.scrollerRef.current.scrollLeft);
                console.log(index * 108);
                if (index * 108 < this.scrollerRef.current.scrollLeft + 108) {
                    this.scrollerRef.current.scrollTo({
                        left:
                            Math.floor(
                                this.scrollerRef.current.scrollLeft / 108
                            ) *
                                108 -
                            108,
                        behavior: "smooth",
                    });
                } else if (
                    index * 108 - this.scrollerRef.current.scrollLeft >
                    432
                ) {
                    this.scrollerRef.current.scrollTo({
                        left: (index - 4) * 108,
                        behavior: "smooth",
                    });
                }
            } else {
                alert("How have you arrived here?");
            }
        } else {
            this.props.changePhoto(this.props.currentPhoto);
        }
    };

    prevPhoto = (event) => {
        if (this.props.currentPhoto > 1) {
            this.props.changePhoto(this.props.currentPhoto - 1);
            const index = this.props.currentPhoto - 1;
            if (index) {
                console.log(this.scrollerRef.current.scrollLeft);
                console.log(index * 108);
                if (index * 108 < this.scrollerRef.current.scrollLeft + 108) {
                    this.scrollerRef.current.scrollTo({
                        left:
                            Math.floor(
                                this.scrollerRef.current.scrollLeft / 108
                            ) *
                                108 -
                            108,
                        behavior: "smooth",
                    });
                } else if (
                    index * 108 - this.scrollerRef.current.scrollLeft >
                    432
                ) {
                    this.scrollerRef.current.scrollTo({
                        left: (index - 4) * 108,
                        behavior: "smooth",
                    });
                }
            } else {
                alert("How have you arrived here?");
            }
        } else {
            this.props.changePhoto(this.props.currentPhoto);
        }
    };

    render() {
        return (
            <div className="gallery">
                <button
                    className="prevGalleryButton"
                    onClick={this.prevPhoto}
                ></button>
                <div className="galleryContainer">
                    <div className="scroller" ref={this.scrollerRef}>
                        <div className="galleryScroll">
                            {this.props.site &&
                                Object.keys(this.props.site).map(
                                    (image, index) => (
                                        <div
                                            key={index}
                                            data-index={index}
                                            className={`gallery-item ${
                                                index + 1 ===
                                                this.props.currentPhoto
                                                    ? "current"
                                                    : ""
                                            }`}
                                            onClick={this.handleClick}
                                        >
                                            <ImageThumbnail
                                                imageSrc={image}
                                                maxWidth={100}
                                                maxHeight={75}
                                            ></ImageThumbnail>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                    <div className="gallery-item new-photo-button">
                        <button
                            className={`newPhotoButton ${
                                this.state.uploading ? "uploading" : ""
                            }`}
                            onClick={() => this.fileInputRef.current.click()}
                        ></button>
                    </div>
                </div>
                <button
                    className="nextGalleryButton"
                    onClick={this.nextPhoto}
                ></button>
                <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    ref={this.fileInputRef}
                    onChange={this.handleImageUpload}
                ></input>
            </div>
        );
    }
}

export default Gallery;
