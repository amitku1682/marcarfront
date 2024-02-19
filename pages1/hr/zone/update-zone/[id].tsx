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

const UpdateZone: React.FC = ({ id }) => {
  const router = useRouter();
  const [zone, setzone] = useState({
    "storeId": id,
    "name" : ""
   
  });
// console.log("id" +id)
  const getbyid = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/zone/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      console.log(data, id)
      // Update the user state with the fetched data
      setzone(data.payload.data[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getbyid();
    }
  }, [id]);
 // console.log('user'+ zone)
 const handleASM = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      
      const response = await axios.put('https://marsworld.co.in/api/hr/zone', {
        storeId: id,
        name: zone.name,
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
          text: 'zone updated successfully!',
        });
        router.push('/hr/zone');
      } else {
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update zone.',
        });
      }
    } catch (error) {
      console.error('Error updating zone:', error);
      // Show SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update zone.',
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setzone((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };


  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Update Zone</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60 my-10 d-flex align-items-center justify-content-center'>
        <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="zone">Enter Zone:</label>
            <br />
            <input
  type="text"
  id="name"
  name="name" 
  value={zone.name}
  onChange={handleChange}
  className='form-control mb-3'
/>


            <Button type="button" onClick={handleASM} className='btn btn-primary w-100'>
              Update zone
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

export default UpdateZone;
