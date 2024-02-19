import React, { FC } from 'react';
import PropTypes from 'prop-types';

interface ILogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const Logo: FC<ILogoProps> = ({ src, alt, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width !== undefined ? width : 2155}
      height={height !== undefined ? height : 854}
    />
  );
};

Logo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Logo;
