import React, { Component } from 'react';
import ImageGallery from './ImageGallery/ImageGallery';
import css from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { fetchImages } from 'Api/pixabayApi';
import { Modal } from './Modal/Modal';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FrontNotification from './FrontNotification/FrontNotification';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};
export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    totalImages: 0,
    largeImageURL: '',
    showModal: false,
    status: Status.IDLE,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQuery = this.state.searchQuery;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevQuery !== nextQuery || prevPage !== nextPage) {
      fetchImages(nextQuery, nextPage)
        .then(({ hits, totalHits }) => {
          if (totalHits === 0) {
            this.rejectedStatusHandler();
            this.showIncorrectQuery(nextQuery);
            return;
          }

          if (nextPage === 1) {
            this.setState({
              images: hits,
              totalImages: totalHits,
              status: Status.RESOLVED,
            });
            this.showSearchResult(totalHits);
          } else {
            this.setState(prevState => ({
              images: [...prevState.images, ...hits],
              status: Status.RESOLVED,
            }));
            this.makeSmoothScroll();
          }
        })
        .catch(error => {
          console.log(error);
          this.rejectedStatusHandler();
          return this.showQueryError(error);
        });
    }
  }

  rejectedStatusHandler = () => {
    this.setState({ status: Status.REJECTED });
    setTimeout(() => {
      this.setState({ status: Status.IDLE });
    }, 2500);
  };

  showSearchResult = totalImages => {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  };

  showIncorrectQuery = searchQuery => {
    Notify.error(
      `Sorry, there are no images matching your query: "${searchQuery}". Please try to search something else.`
    );
  };

  showQueryError = error => {
    Notify.error(`You caught the following error: ${error.message}.`);
  };

  onFormSubmit = searchQuery => {
    this.setState({
      searchQuery,
      images: [],
      page: 1,
      status: Status.PENDING,
    });
  };

  makeSmoothScroll = () => {
    const cardHeight = this.galleryElem.firstElementChild.clientHeight;
    window.scrollBy({ top: cardHeight * 1.97, behavior: 'smooth' });
  };

  onLoadBtnClick = () => {
    const { totalImages, images } = this.state;

    if (totalImages > images.length) {
      this.setState(prevState => ({ page: prevState.page + 1 }));
    }
  };

  toggleModal = largeImageURL => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      largeImageURL,
    }));
  };

  render() {
    const {
      searchQuery,
      images,
      totalImages,
      largeImageURL,
      showModal,
      status,
    } = this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.onFormSubmit} />
        {status === Status.IDLE && (
          <FrontNotification text="Type your image request in searchbar and get an awesome collection of pictures." />
        )}
        {status === Status.PENDING && <Loader />}
        {status === Status.RESOLVED && (
          <>
            <ImageGallery
              images={images}
              onClick={this.toggleModal}
              scrollRef={galleryList => {
                this.galleryElem = galleryList;
              }}
            />

            {totalImages > images.length && (
              <Button onClick={this.onLoadBtnClick} />
            )}

            {showModal && (
              <Modal
                largeImageURL={largeImageURL}
                alt={searchQuery}
                onClose={this.toggleModal}
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
}

