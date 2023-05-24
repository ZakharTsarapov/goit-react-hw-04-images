import { useState, useEffect, useRef } from 'react';
import usePrevious from 'hooks/usePrevious';
import ImageGallery from './ImageGallery/ImageGallery';
import css from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { fetchImages } from 'Api/pixabayApi';
import Modal from './Modal/Modal';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FrontNotification from './FrontNotification/FrontNotification';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);


   const prevSearchQuery = usePrevious(searchQuery);
   const galleryElem = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    fetchImages(searchQuery, page)
      .then(({ hits, totalHits }) => {
        if (totalHits === 0) {
          rejectedStatusHandler();
          showIncorrectQuery(searchQuery);
          return;
        }

        if (page === 1) {
          setImages(hits);
          setTotalImages(totalHits);
          setStatus(Status.RESOLVED);
          showSearchResult(totalHits);
        }
        else {
          setImages(prevImages => [...prevImages, ...hits]);
          setStatus(Status.RESOLVED);
          makeSmoothScroll();
        }
      })
      .catch(error => {
        // rejectedStatusHandler();
        showQueryError(error);
        return
      });
  }, [searchQuery, page]);

  const rejectedStatusHandler = () => {
    setStatus(Status.REJECTED);
    setTimeout(() => {
      setStatus(Status.IDLE);
    }, 2500);
  };

  const showSearchResult = totalImages => {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  };

  const showIncorrectQuery = searchQuery => {
    Notify.error(
      `Sorry, there are no images matching your query: "${searchQuery}". Please try to search something else.`
    );
  };

  const showQueryError = error => {
    Notify.error(`You caught the following error: ${error.message}.`);
  };

  const galleryReset = () => {
    setImages([]);
    setPage(1);
  };

  const onFormSubmit = searchQuery => {
    if (prevSearchQuery === searchQuery) {
      return;
    };

    setSearchQuery(searchQuery);
    galleryReset();
    setStatus(Status.PENDING);
  }


  const makeSmoothScroll = () => {
    const cardHeight = galleryElem.firstElementChild.clientHeight;
    window.scrollBy({ top: cardHeight * 1.97, behavior: 'smooth' });
  };

 const onLoadBtnClick = () => {
   
     setPage(prevPage => prevPage + 1);
   
 };

  const toggleModal = largeImageURL => {
    setShowModal(showModal => !showModal);
    setLargeImageURL(largeImageURL);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={onFormSubmit} />
      {status === Status.IDLE && (
        <FrontNotification text="Type your image request in searchbar and get an awesome collection of pictures." />
      )}
      {status === Status.PENDING && <Loader />}
      {status === Status.RESOLVED && (
        <>
          <ImageGallery
            images={images}
            onClick={toggleModal}
            scrollRef={galleryElem}/>

         {totalImages > images.length && <Button onClick={onLoadBtnClick} />}

          {showModal && (
            <Modal
              largeImageURL={largeImageURL}
              alt={searchQuery}
              onClose={toggleModal}
            />
          )}
        </>
      )}
      {status === Status.REJECTED && (
        <FrontNotification text="Oops! Something went wrong." />
      )}
    </div>
  );
}
