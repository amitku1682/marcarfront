import React, { useEffect, useState } from 'react';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddAsset: React.FC = () => {
  const router = useRouter();
  const assetid = router.query;
  const entries = Object.entries(assetid);
  const [asset, setAsset] = useState({
    asset: '',
    assetCategory: '',
    make: '',
    model: '',
    description: '',
    rate: 0,
    "assetId": entries,
  });

  const getbyid = async () => {
    const authToken = sessionStorage.getItem('authToken');
    try {
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/asset/${entries}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
      // console.log(JSON.stringify(data.payload.data))
     // setAsset(data.payload.data[0])
    } catch (error: any) {
      // status == 400 it's worng status code on auth error
      // if (error.response.data == 'Invalid token.' || error.response.status == 400) {
      //   localStorage.removeItem('authToken')
      //   router.push(`/auth/login`);
      // }
      console.log({ error })
    }
  }
  //   const assetMutation = useAsset(); // Assuming you have a hook for adding asset
  useEffect(() => {
    if (entries) {
      getbyid()
    }
  }, [])

  const handleAddAsset = async () => {
    try {
      // Get the authToken from sessionStorage
      const authToken = sessionStorage.getItem('authToken');
      let response;
      // if (entries) {
      //   response = await axios.put('https://marsworld.co.in/api/hr/asset', asset, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${authToken}`,
      //     },
      //   })
      // } else {
        // Make the API request with asset and authToken using Axios
        response = await axios.post('https://marsworld.co.in/api/hr/asset', asset, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(JSON.stringify(response))
     // }

      if (response.status === 200) {
        // Handle success
        console.log('Asset added successfully');
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Asset added successfully!',
        });
        router.push('/hr/asset')

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
  useEffect(() => {

  }, [])

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
          <span className='h4 mb-0 fw-bold'>Add Asset</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className='row h-60  my-10 d-flex align-items-center justify-content-center'>
          <form className='p-4 rounded shadow-sm w-50 my-20'>
            <label htmlFor="asset">Asset:</label>
            <br />
            <input
              type="text"
              id="asset"
              name="asset"
              value={asset.asset}
              onChange={handleChange}
              className='form-control mb-3'
            />

<label htmlFor="assetCategory">Asset Category:</label>
<br />
<select
  id="assetCategory"
  name="assetCategory"
  value={asset.assetCategory}
  onChange={handleChange}
  className='form-control mb-3'
>
  <option value="">Select Asset Category</option>
  <option value="Electronics">Electronics</option>
  <option value="Laptops">Laptops</option>
  <option value="Mobiles">Mobiles</option>
  <option value="Clothes">Clothes</option>
  <option value="Miscellaneous">Miscellaneous</option>
</select>

            <label htmlFor="make">Make:</label>
            <br />
            <input
              type="text"
              id="make"
              name="make"
              value={asset.make}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <label htmlFor="model">Model:</label>
            <br />
            <input
              type="text"
              id="model"
              name="model"
              value={asset.model}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <label htmlFor="description">Description:</label>
            <br />
            <input
              type="text"
              id="description"
              name="description"
              value={asset.description}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <label htmlFor="rate">Rate:</label>
            <br />
            <input
              type="number"
              id="rate"
              name="rate"
              value={asset.rate}
              onChange={handleChange}
              className='form-control mb-3'
            />

            <Button type="button" onClick={handleAddAsset} className='btn btn-primary w-100'>
              Add Asset
            </Button>
          </form>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default AddAsset;
