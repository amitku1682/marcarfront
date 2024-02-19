import React, { useEffect, useState } from 'react';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddUser: React.FC = () => {
  const router = useRouter();
  const userid = router.query;
  const entries = Object.entries(userid);
  const [user, setUser] = useState({
    // "asmId": entries,
    "name": "",
    "role": "",
    "email": "",
    "mobileNo": "",
    "password": ""
  });

  // const getbyid = async () => {
  //   try {
  //     const authToken = sessionStorage.getItem('authToken');
  //     const { data } = await axios.get(`https://marsworld.co.in/api/hr/asm/${entries}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${authToken}`,
  //       },
  //     });
  //     setUser(data.payload.data[0]);
  //   } catch (error) {
  //     console.error('Error fetching user details:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (entries) {
  //     getbyid();
  //   }
  // }, []);

  const handleASM = async () => {
    console.log(user)
    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await axios.post('https://marsworld.co.in/api/hr/users', user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully!',
        });
        router.push('/hr/user');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Mobile Number or Email is already registered.',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Mobile Number or Email is already registered.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Add User</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60 my-10 d-flex align-items-center justify-content-center'>
          <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="name">Name:</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              value={user.name || ''}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            <label htmlFor="mobileNo">Mobile Number:</label>
            <br />
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              value={user.mobileNo || ''}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            <label htmlFor="email">Email Id:</label>
            <br />
            <input
              type="text"
              id="email"
              name="email"
              value={user.email || ''}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            <label htmlFor="role">Role:</label>
            <br />
            <select
              id="role"
              name="role"
              value={user.role || ''}
              onChange={handleChange}
              className='form-control mb-3'
              required
            >
              <option value="">Select</option>
              <option value="2">Admin</option>
            
            </select>

            <label htmlFor="password">Password:</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={user.password || ''}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            <Button type="button" onClick={handleASM} className='btn btn-primary w-100'>
              Add ASM
            </Button>
          </form>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default AddUser;
