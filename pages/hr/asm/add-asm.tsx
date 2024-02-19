import React, { useEffect, useState } from 'react';
// import useAsset from '../../../core/mutations/AddAsm'; // Assuming you have a hook for adding asset
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddAsm: React.FC = () => {
  const router = useRouter();
  const assetid = router.query;
  const entries = Object.entries(assetid);
  const [asset, setAsset] = useState({
    "asmId": entries,
    "name": "",
    "email": "",
    "mobileNo": "",
    "password": ""
  });

  const getbyid = async () => {
    const authToken = sessionStorage.getItem('authToken');
  
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/asm/${entries}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
      
      setAsset(data.payload.data[0])
     
    }
  
  
  useEffect(() => {
    if (entries) {
    
    }
  }, [])

  const handleASM = async () => {
    try {
      // Get the authToken from sessionStorage
      const authToken = sessionStorage.getItem('authToken');
      let response;
      if (entries) {
        response = await axios.put('https://marsworld.co.in/api', asset, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        })
      } else {
        // Make the API request with asset and authToken using Axios
        response = await axios.post('https://103.68.23.37/api/hr/asm', asset, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(JSON.stringify(response))
      }

      if (response.status === 200) {
        // Handle success
        console.log('Asset added successfully');
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Asset added successfully!',
        });
        router.push('/hr/asm')

        // You may want to update your UI or perform other actions on success
      } else {
        // Handle error
        console.error('Failed to add asset:', response.statusText);

        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add asset. Please try again.',
        });

        // You may want to show an error message or perform other actions on error
      }
    } catch (error) {
      console.error('Asset error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAsset((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Add ASM</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60  my-10 d-flex align-items-center justify-content-center'>
          <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="asset">Name:</label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              value={asset.name}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <label htmlFor="assetCategory">Mobile Number:</label>
            <br />
            <input
              type="text"
              id="email"
              name="mobileNo"
              value={asset.mobileNo}
              onChange={handleChange}
              className='form-control mb-3'
            />
            <label htmlFor="model">Email Id:</label>
            <br />
            <input
              type="text"
              id="email"
              name="email"
              value={asset.email}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <label htmlFor="make">Password:</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={asset.password}
              onChange={handleChange}
              className='form-control mb-3'
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

export default AddAsm;
