import React, { Component } from "react";
import ImageThumbnail from "./ImageThumbnail";

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
        const files = event.target.files;

        this.props.newPhoto(files);

        requestAnimationFrame(() => {
            if (
                Object.keys(this.props.site).length >= this.state.scrollPosition
            ) {
                const scrollPosition = this.state.scrollPosition + 1;
                this.setState({ scrollPosition });

                //ITS BECAUSE OF THE THUMBNAIL
                this.scrollerRef.current.scrollTo({
                    left: this.scrollerRef.current.scrollWidth,
                    behavior: "smooth", // Smooth scrolling
                });
            }
        });

        event.target.value = null;
        // Simulate a delay for the upload animation (if needed)
    };

    handleClick = (event) => {
        const index = event.currentTarget.getAttribute("data-index");
        if (index) {
            this.props.changePhoto(Number(index) + 1);
            if (index * 116 < this.scrollerRef.current.scrollLeft + 50) {
                this.scrollerRef.current.scrollTo({
                    left:
                        Math.floor(this.scrollerRef.current.scrollLeft / 116) *
                            116 -
                        116,
                    behavior: "smooth",
                });
            } else if (
                index * 116 - this.scrollerRef.current.scrollLeft >
                432
            ) {
                this.scrollerRef.current.scrollTo({
                    left: (index - 4) * 116,
                    behavior: "smooth",
                });
            }
        } else {
            alert("How have you arrived here?");
        }
    };

    handleRemovePhoto = (event) => {
        const image = event.currentTarget.getAttribute("data-image");
        const index = event.currentTarget.getAttribute("data-index");

        console.log(index);
        console.log(this.props.currentPhoto);

        if (window.confirm(`Remove ${image}?`)) {
            this.props.removePhoto(image);
            if (this.props.currentPhoto - 1 > index) {
                this.props.changePhoto(this.props.currentPhoto - 1);
            }
        }
    };

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
                                            className={`imageContainer ${
                                                index + 1 ===
                                                this.props.currentPhoto
                                                    ? "current"
                                                    : ""
                                            }`}
                                            key={`imageContainer_${index}`}
                                            title={`${image}`}
                                        >
                                            <button
                                                className="removePhoto"
                                                key={`removePhoto_${index}`}
                                                data-image={image}
                                                data-index={index}
                                                onClick={this.handleRemovePhoto}
                                            ></button>
                                            <div
                                                key={`galleryItem-${index}`}
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
                    multiple
                    onChange={this.handleImageUpload}
                ></input>
            </div>
        );
    }
}

export default Gallery;
