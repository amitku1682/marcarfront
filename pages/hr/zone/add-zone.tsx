import React, { useState } from 'react';
import useZone from '../../../core/mutations/addZone';
import { ZoneForm } from '../../../core/form.interfaces';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';

const AddZone: React.FC = () => {
  const [zone, setZone] = useState('');

  const zoneMutation = useZone();
  const handleZone = async () => {
    try {
      // Get the authToken from sessionStorage
      const authToken = sessionStorage.getItem('authToken');
  
      // Make the API request with zone and authToken
      const response = await fetch('https://marsworld.co.in/api/hr/zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: zone,
        }),
      });
  
      if (response.ok) {
        // Handle success
        console.log('Zone added successfully');
  
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Zone added successfully!',
        });
  
        // You may want to update your UI or perform other actions on success
      } else {
        // Handle error
        console.error('Failed to add zone:', response.statusText);
  
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add zone. Please try again.',
        });
  
        // You may want to show an error message or perform other actions on error
      }
    } catch (error) {
      console.error('Zone error:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input Value:', e.target.value);
    setZone(e.target.value);
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Add Zone</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60  my-10 d-flex align-items-center justify-content-center'>
          <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="zone">Enter Zone:</label>
            <br />
            <input
              type="text"
              id="zone"
              value={zone}
              onChange={handleChange}
              className='form-control mb-3'
            />
            <Button type="button" onClick={handleZone} className='btn btn-primary w-100'>
              Add Location
            </Button>
          </form>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default AddZone;
