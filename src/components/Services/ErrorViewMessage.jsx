import PropTypes from 'prop-types';

export const ErrorViewMessage = ({ onError }) => {
  return (
    <div>
      <p>Sorry, please try later. Code on error:{onError.code}</p>
    </div>
  );
};

ErrorViewMessage.propTypes = {
  onError: PropTypes.string.isRequired,
};
