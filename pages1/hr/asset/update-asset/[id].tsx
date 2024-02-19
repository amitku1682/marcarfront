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

const AddAsset: React.FC = ({ id }) => {
  const router = useRouter();
  const assetid = id;
  const entries = Object.entries(assetid);
  const [asset, setAsset] = useState({
    asset: '',
    assetCategory: '',
    make: '',
    model: '',
    description: '',
    rate: 0,
  });

  console.log(asset);

  const getbyid = async () => {
    const authToken = sessionStorage.getItem('authToken');
    try {
      const { data } = await axios.get(`https://marsworld.co.in/api/hr/asset/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      console.log(data)
      setAsset(data.payload.data[0]);
    } catch (error: any) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (entries) {
      getbyid();
    }
  }, []);

  const handleAddAsset = async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      let response;
      
      response = await axios.put('https://marsworld.co.in/api/hr/asset', asset, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        console.log('Asset added successfully');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Asset Updated successfully!',
        });
        router.push('/hr/asset');
      } else {
        console.error('Failed to add asset:', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to Update asset. Please try again.',
        });
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
            <input
              type="text"
              id="assetCategory"
              name="assetCategory"
              value={asset.assetCategory}
              onChange={handleChange}
              className='form-control mb-3'
            />

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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    return {
      props: {
        id: query.id
      }
    };
  };

export default AddAsset;
