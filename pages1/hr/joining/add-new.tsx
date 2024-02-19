import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
// import useZone from '../../../core/mutations/addZone';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddPisition: React.FC = () => {
  const [position, setposition] = useState<any>({
    position: "",
    positionId: 0
  });
  const router = useRouter();
  //   const zoneMutation = useZone();
  const data = router.query;
  const joiningId = Object.entries(data);

  const getbyid = async () => {
    const authToken = sessionStorage.getItem('authToken');
    try {
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/joining-position/${joiningId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
      console.log(JSON.stringify(data.payload.data))
      setposition(data.payload.data[0])
    } catch (error: any) {
      // status == 400 it's worng status code on auth error
      if (error.response.data == 'Invalid token.' || error.response.status == 400) {
        localStorage.removeItem('authToken')
        router.push(`/auth/login`);
      }
      console.log({ error })
    }
  }

  useEffect(() => {
    if (joiningId) {
      getbyid();
    }
  }, [])

  const handleLocation = async () => {
    try {
      // Get the authToken from sessionStorage
      const authToken = sessionStorage.getItem('authToken');
      let response;
      if (joiningId) {
        response = await axios.put('https://marsworld.co.in/api/hr/joining-position', position, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        })
      } else {
        // Make the API request with zone and authToken
        response = await fetch('https://marsworld.co.in/api/hr/joining-position', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            position: position.position,
          }),
        });
      }
      console.log({ response })
      if (response.status == 200) {
        // Handle success
        console.log('Data added successfully');

        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data added successfully!',
        });
        router.push('/hr/joining')
        // You may want to update your UI or perform other actions on success
      } else {
        // Handle error
        console.error('Failed to add location:', response.statusText);

        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add location. Please try again.',
        });

        // You may want to show an error message or perform other actions on error
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input Value:', e.target.value);
    setposition({ ...position, position: e.target.value });
  };


  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Add AddPisition</span>
          <SubheaderSeparator />
          <strong>HR Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60  my-10 d-flex align-items-center justify-content-center'>

          <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="zone">Enter Position:</label>
            <br />
            <input
              type="text"
              id="zone"
              value={position.position}
              onChange={handleChange}
              className='form-control mb-3'
            />
            <Button type="button" onClick={handleLocation} className='btn btn-primary'>
              Add Position
            </Button>
          </form>

        </div>
      </Page>
    </PageWrapper>
  );
};

export default AddPisition;
