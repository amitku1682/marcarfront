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

const UpdateLocation: React.FC = ({ id }) => {
  const router = useRouter();
  const [location, setlocation] = useState({
    "locationId": id,
    "name" : ""
   
  });
// console.log("id" +id)
  const getbyid = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/location/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      console.log(data, id)
      // Update the user state with the fetched data
      setlocation(data.payload.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getbyid();
    }
  }, [id]);
 // console.log('user'+ location)
 const handleASM = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      
      const response = await axios.put('https://marsworld.co.in/api/hr/location', {
        locationId: location.locationId,
        name: location.name,
      }, {
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
          text: 'Location updated successfully!',
        });
        router.push('/hr/location');
      } else {
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update location.',
        });
      }
    } catch (error) {
      console.error('Error updating location:', error);
      // Show SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update location.',
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setlocation((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };


  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Update Location</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60 my-10 d-flex align-items-center justify-content-center'>
        <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="zone">Enter Location:</label>
            <br />
            <input
  type="text"
  id="name"
  name="name" 
  value={location.name}
  onChange={handleChange}
  className='form-control mb-3'
/>


            <Button type="button" onClick={handleASM} className='btn btn-primary w-100'>
              Update Location
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

export default UpdateLocation;
