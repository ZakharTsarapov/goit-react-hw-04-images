import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css'

export default function ImageGallery({ images, onClick, scrollRef }) {
  return (
    <ul className={css.imageGallery} ref={scrollRef}>
      {images.map(({ id, ...props }) => (
        <ImageGalleryItem key={id} {...props} onClick={onClick} />
      ))}
    </ul>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  scrollRef: PropTypes.func.isRequired,
};
