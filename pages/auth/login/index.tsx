import React, { useState } from 'react';
import { NextPage } from 'next';
import useLogin from '../../../core/mutations/auth/useLogin';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import Page from '@/layout/Page/Page';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { auto } from '@popperjs/core';

interface ILoginProps {
  isSignUp?: boolean;
}

const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const loginMutation = useLogin();
  const [successMessage, setSuccessMessage] = useState('');
  const handleLogin = async () => {
    try {
      const response = await loginMutation.mutateAsync({ username, password });

      if (response) {
        setSuccessMessage('Login successful!');
      } else {
        // Set an error message for invalid username/password
        setErrorMessage('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Set a generic error message
      setErrorMessage('Invalid Credentials. Please try again.');

    }
  };
  return (
    <PageWrapper isProtected={false} className='p-0'>
      <div
        className='background-container'
        style={{
          backgroundImage: `url('/home_detailing_slider_bg-1.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Page>
          <div className='row h-100 align-items-center justify-content-center'>
            <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container p-4  text-center rounded border' style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Logo
                src={'/mars-logo.png'}
                alt="Logo Image"
                height={60}
                width={auto}
               
              />
              <h2 className=' mb-3 mt-2' style={{ color: 'white', fontSize: '2rem' }}>Login | HR</h2>
              <form>
                <div className='mb-3 my-8'>
                  <label htmlFor='username' className='form-label' style={{ color: 'white' }}>
                    Username/Employee code:
                  </label>
                  <input
                    type='text'
                    id='username'
                    className='form-control'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label' style={{ color: 'white' }}>
                    Password:
                  </label>
                  <input
                    type='password'
                    id='password'
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type='button' className='btn btn-primary w-100' onClick={handleLogin}>
                  Log In
                </button>
                {errorMessage && (
          <div className="alert alert-danger mt-2" role="alert">
            {errorMessage}
          </div>
        )}
                <div className="text-center mt-2">
                  or <br />
                  <Link href={'/employee/attendance'} style={{ color: 'white' }}>
                    Employee Attendance
                  </Link>  <Link href='#' style={{ color: 'white' }}>
                    Forgot password?
                  </Link>
                </div>            
              </form>
            </div>
          </div>
          {/* <div className='mt-4 d-flex flex-wrap justify-content-center' style={{ color: 'white', padding: '20px',display:'flex' }}>
            <div className='flex-column text-center px-3 mb-4'>
              <Logo
                src={'http://localhost:3002/mars-logo.png'}
                alt="Logo Image"
                height={50}
                width={auto}
              />
              <p>Human Resource Management Portal.</p>
              <p>Site Map.</p>
            </div>
            <div className='flex-column text-center px-3 mb-4'>
              <p>About Us.</p>
              <p>
                Mars Car Care Services Is A Young Company Of Professionals That Has Rapidly Expanded Across North India. We Are In Car Detailing Services And Our Partnership With The Global Leader Mars Car Care Shows Our Approach Of Professionalism And Quality Assurance.
              </p>
            </div>
            <div className='flex-column text-center px-3 mb-4'>
              <p>Address.</p>
              <p>IInd Floor, Rana Complex Panchsheel Park, Rajender Nagar G.T.Road Sahibabad , Ghaziabad-201005.</p>
            </div>
          </div> */}
        </Page>
      </div>
    </PageWrapper>
  );
};

export default Login;
