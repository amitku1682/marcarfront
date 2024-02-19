
import React, { useEffect, useState } from 'react';
// import useAsset from '../../../core/mutations/AddCenter'; // Assuming you have a hook for adding asset
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Button from '@/components/bootstrap/Button';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddCenter: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [storedata, setStoredata] = useState([])
    const [asm, setAsm] = useState([])
    const [asset, setAsset] = useState({
        id: 0,
        "storeId": 0,
        "asmId": 0,
        "name": "",
        "address": "",
        "centerTime": getCurrentTime(),
    });
    console.log(asset+"asset")
    const getStore = async () => {
        const authToken = sessionStorage.getItem('authToken');
        try {
            const { data } = await axios.get(`https://marsworld.co.in/api/hr/zone`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            })
            // console.log(JSON.stringify(data.payload.data))
            setStoredata(data.payload.data);
        } catch (error: any) {
            // status == 400 it's worng status code on auth error
            if (error?.response?.data == 'Invalid token.') {
                localStorage.removeItem('authToken')
                router.push(`/auth/login`);
            }
            console.log({ error })
        }
    }

    const getasm = async () => {
        const authToken = sessionStorage.getItem('authToken');
        try {
            const { data } = await axios.get(`https://marsworld.co.in/api/hr/asm`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            })
            // console.log(JSON.stringify(data.payload.data))
            setAsm(data.payload.data);
        } catch (error: any) {
            // status == 400 it's worng status code on auth error
            if (error?.response?.data == 'Invalid token.') {
                localStorage.removeItem('authToken')
                router.push(`/auth/login`);
            }
            console.log({ error })
        }
    }
    //   const assetMutation = useAsset(); // Assuming you have a hook for adding asset
    const getbyid = async () => {
        const authToken = sessionStorage.getItem('authToken');
        try {
            const { data } = await axios.get(`https://marsworld.co.in/api/hr/center/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            const centerdata = data.payload.data;
            setAsset({
                storeId: centerdata.store_id,
                asmId: centerdata.asm_id,
                name: centerdata.name,
                address: centerdata.address,
                centerTime: centerdata.centerTime,
            });
        } catch (error: any) {
            if (error?.response?.data == 'Invalid token.') {
                localStorage.removeItem('authToken');
                router.push(`/auth/login`);
            }
            console.log({ error });
        }
    }
    
    useEffect(() => {
        getasm();
        getStore();
        if (id) {
            getbyid();
        }
        setAsset({ ...asset, id: id })
    }, [])

    function getCurrentTime() {
        const currentTime = new Date();
        let hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12

        // Add leading zero to minutes if needed
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
        return formattedTime;
    }

    const handleASM = async () => {
        try {
            // alert(JSON.stringify(asset))
            // Get the authToken from sessionStorage
            const authToken = sessionStorage.getItem('authToken');
            let response;
            if (id) {
                asset['id'] = id
                response = await axios.put('https://marsworld.co.in/api/hr/centerUpdate', asset, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                })
            } else {
                response = await axios.post('https://marsworld.co.in/api/hr/centeradd', asset, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            }

            console.log(JSON.stringify(response))
            if (response.status === 200) {
                // Handle success
                console.log('Asset added successfully');
                // Show SweetAlert success message
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Center added successfully!',
                });
                router.push('/hr/centers/CenterList')
            } else {
                console.error('Failed to add asset:', response.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add Center. Please try again.',
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
    const store = storedata.map((data, i) => {
        return (
            <>
               
                <option value={`${data.storeId}`}>{data.name}</option>
            </>
        )
    })
    const asmdata = asm.map((data, i) => {
        return (
            <>
               
                <option value={`${data.asmId}`}>{data.name}</option>
            </>
        )
    })
    return (
        <PageWrapper>
            <SubHeader>
                <SubHeaderLeft>
                    <span className='h4 mb-0 fw-bold'>Add Center</span>
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
                        <label htmlFor="asset">Store:</label>
                        <br />
                        <select className="form-select mb-3" name='storeId'
                            onChange={handleChange}
                            value={asset.storeId}
                            aria-label="Default select example">
                            {store}
                        </select>
                        <label htmlFor="asset">ASM:</label>
                        <br />
                        <select className="form-select mb-3"
                            name='asmId'
                            onChange={handleChange}
                            value={asset.asmId}
                            aria-label="Default select example">
                            {asmdata}
                        </select>
                        <label htmlFor="assetCategory">Address:</label>
                        <br />
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={asset.address}
                            onChange={handleChange}
                            className='form-control mb-3'
                        />
                        <label htmlFor="model">Center Time:</label>
                        <br />
                        <input
                            type="text"
                            id="centerTime"
                            name="centerTime"
                            value={asset.centerTime}
                            onChange={handleChange}
                            className='form-control mb-3'
                        />
                        <Button type="button" onClick={handleASM} className='btn btn-primary w-100'>
                            Add Center
                        </Button>
                    </form>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default AddCenter;
