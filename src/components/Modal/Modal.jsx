import React from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

export class Modal extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.closeOnEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeOnEsc);
  }

  closeOnEsc = e => {
    if (e.code === 'Escape') {
      this.props.onCloseModal();
    }
  };

  closeBackdrop = e => {
    if (e.currentTarget === e.target) {
      this.props.onCloseModal();
    }
  };

  render() {
    const { url, alt } = this.props;

    return (
      <div className={css.overlay} onClick={this.closeBackdrop}>
        <div className={css.modal}>
          <img src={url} alt={alt} />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
