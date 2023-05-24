import PropTypes from 'prop-types';

export default function FrontNotification({ text }) {
  return <p>{text}</p>;
}

FrontNotification.propTypes = {
  text: PropTypes.string.isRequired,
};
