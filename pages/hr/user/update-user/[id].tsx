import React, { useEffect, useState } from 'react';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';
import { GetServerSideProps } from 'next';

const UpdateUser: React.FC = ({ id }) => {
  const router = useRouter();
  const [user, setUser] = useState({
    "userId": id,
    "name": "",
    // "role": "",
    "email": "",
    "mobileNo": "",
    "password": ""
  });
// console.log("id" +id)
  const getbyid = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      //console.log(data, id)
      // Update the user state with the fetched data
      setUser(data.payload.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getbyid();
    }
  }, [id]);

  const handleASM = async () => {
    try {
    
console.log(user)
      const authToken = sessionStorage.getItem('authToken');
      const data={
  
        password : user.password,
        userId: user.userId,
        name: user.name,
        email:user.email,
        mobileNo: user.mobileNo,
    }
console.log(data)
console.log('user'+ user)

      const response = await axios.put(`https://marsworld.co.in/api/hr/users`, user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully!',
        });
        router.push('/hr/user');
      } else {
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Mobile Number or Email is already registered.',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Show SweetAlert error message
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

  const isFormValid = () => {
    return (
      user.name.trim() !== '' &&
      user.mobileNo.trim() !== '' &&
      user.email.trim() !== '' &&
    
      user.password.trim() !== ''
    );
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Update User</span>
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
              value={user.name}
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
              value={user.mobileNo}
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
              value={user.email}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            
            <label htmlFor="password">Password:</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className='form-control mb-3'
              required
            />

            <Button type="button" onClick={handleASM} className='btn btn-primary w-100'>
              Update User
            </Button>
          </form>
        </div>
      </Page>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id
    }
  };
};

export default UpdateUser;
