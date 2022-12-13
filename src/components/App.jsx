import React, { Component } from 'react';

import { PixabayApiGallery } from '../API/Pixabay.api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { ErrorViewMessage } from './Services/ErrorViewMessage';

const pixabayApiGallery = new PixabayApiGallery();
const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    searchName: '',
    imageGallery: [],
    page: 1,
    perPage: 12,
    totalImages: 0,
    error: null,
    status: Status.IDLE,
    largeImg: '',
    largeImgAlt: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchName, imageGallery, page, perPage } = this.state;

    if (prevState.searchName !== searchName || prevState.page !== page) {
      this.setState({ status: Status.PENDING });

      try {
        const response = await pixabayApiGallery.getResponse(
          searchName,
          page,
          perPage
        );

        const { total, hits } = response.data;

        if (total === 0) {
          this.setState({ status: Status.IDLE });
          alert(
            `There are nothing for "${searchName}". Try again with another name`
          );
          return;
        }

        if (!imageGallery.length) {
          this.setState({
            imageGallery: hits,
            status: Status.RESOLVED,
            totalImages: total,
          });
          return;
        }

        if (imageGallery.length) {
          this.setState({
            imageGallery: [...prevState.imageGallery, ...hits],
            status: Status.RESOLVED,
            totalImages: total,
          });
          return;
        }
      } catch (error) {
        this.setState({ error, status: Status.REJECTED });
        return;
      }
    }
  }

  loadMorePage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  onSubmitForm = searchName => {
    this.setState({ searchName, imageGallery: [], page: 1 });
  };

  openModal = e => {
    const largeImg = e.target.dataset.url;
    const largeImgAlt = e.target.alt;
    this.setState({ largeImg, largeImgAlt });
  };

  closeModal = () => {
    this.setState({ largeImg: null });
  };

  render() {
    const {
      searchName,
      imageGallery,
      status,
      page,
      perPage,
      totalImages,
      largeImg,
      largeImgAlt,
      error,
    } = this.state;

    const visibleButton = totalImages > page * perPage && status === 'resolved';

    return (
      <>
        <Searchbar onSubmit={this.onSubmitForm} prevSearchName={searchName} />
        <ImageGallery>
          {imageGallery && (
            <ImageGalleryItem
              imageGallery={imageGallery}
              onClick={this.openModal}
            />
          )}
        </ImageGallery>

        {status === 'pending' && <Loader />}

        {visibleButton && <Button onClick={this.loadMorePage} />}

        {largeImg && (
          <Modal
            url={largeImg}
            alt={largeImgAlt}
            onCloseModal={this.closeModal}
          />
        )}

        {status === 'rejected' && <ErrorViewMessage onError={error} />}
      </>
    );
  }
}
