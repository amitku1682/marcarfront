import React from 'react';
import Footer from '../../../layout/Footer/Footer';
import classNames from 'classnames';
import useDarkMode from '../../../hooks/useDarkMode';

const DefaultFooter = () => {
  const { darkModeStatus } = useDarkMode();

  return (
    <Footer className="bg-dark text-white">
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            <span className='fw-light'>Copyright © 2024-MARSCARCARE</span>
          </div>
          <div className='col-auto'>
            <a
              href='/pages'
              className={classNames('text-decoration-none', {
                'link-dark': !darkModeStatus,
                'link-light': darkModeStatus,
              })}
            >
              <small className='fw-bold'>Marscarcare</small>
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default DefaultFooter;
