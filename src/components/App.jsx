import { useState, useEffect } from 'react';

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

export const App = () => {
  const perPage = 12;
  const [searchName, setSearchName] = useState('');
  const [imageGallery, setImageGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [largeImg, setLargeImg] = useState('');
  const [largeImgAlt, setLargeImgAlt] = useState('');

  useEffect(() => {
    if (!searchName) {
      return;
    }
    setStatus(Status.PENDING);
    fetch();
  }, [searchName, page]);

  async function fetch() {
    try {
      const response = await pixabayApiGallery.getResponse(
        searchName,
        page,
        perPage
      );

      const { total, hits } = response.data;

      if (total === 0) {
        setStatus(Status.IDLE);
        alert(
          `There are nothing for "${searchName}". Try again with another name`
        );
        return;
      }

      if (!imageGallery.length) {
        setImageGallery(hits);
        setStatus(Status.RESOLVED);
        setTotalImages(total);
        return;
      }

      if (imageGallery.length) {
        setImageGallery(prevState => [...prevState, ...hits]);
        setStatus(Status.RESOLVED);
        setTotalImages(total);
        return;
      }
    } catch (error) {
      setError(Status.REJECTED);
      return;
    }
  }

  const loadMorePage = () => {
    setPage(prevState => prevState + 1);
  };

  const changePage = () => {
    setPage(1);
  };

  const onSubmitForm = searchName => {
    setSearchName(searchName);
    setImageGallery([]);
  };

  const openModal = e => {
    setLargeImg(e.target.dataset.url);
    setLargeImgAlt(e.target.alt);
  };

  const closeModal = () => {
    setLargeImg(null);
  };

  const visibleButton = totalImages > page * perPage && status === 'resolved';

  return (
    <>
      <Searchbar
        onSubmit={onSubmitForm}
        prevSearchName={searchName}
        changePage={changePage}
      />

      <ImageGallery>
        {imageGallery && (
          <ImageGalleryItem imageGallery={imageGallery} onClick={openModal} />
        )}
      </ImageGallery>

      {status === 'pending' && <Loader />}

      {visibleButton && <Button onClick={loadMorePage} />}

      {largeImg && (
        <Modal url={largeImg} alt={largeImgAlt} closeModal={closeModal} />
      )}

      {status === 'rejected' && <ErrorViewMessage onError={error} />}
    </>
  );
};
