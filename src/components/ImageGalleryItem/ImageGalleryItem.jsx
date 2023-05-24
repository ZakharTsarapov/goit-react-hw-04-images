import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css'

export default function ImageGalleryItem({
    webformatURL,
    largeImageURL,
    tags,
    onClick,
}) {
    return (
      <li className={css.imageGalleryItem}>
        <img
          className={css.imageGalleryItem__image}
          src={webformatURL}
          alt={tags}
          onClick={() => onClick(largeImageURL)}
        />
      </li>
    );
}

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
