import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Button from '../../../components/bootstrap/Button';
import axios from 'axios';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import dayjs from 'dayjs';
import AddEmployeeForm from '@/common/partial/AddEmployee';
import EmployeeAttendance from './add-employee-attendance';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
interface IEmployeeAttendanceProps {
  isSignUp?: boolean;
}

const AddEmployee: React.FC<IEmployeeAttendanceProps> = ({ isSignUp }) => {
  const router = useRouter();
  const querydata = router.query;
  const employeeId = Object.entries(querydata);
  const [employeedata, setEmployee] = useState<any>()
  const getbyid = async () => {
    const authToken = sessionStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://103.68.23.37/api/hr/employee/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      console.log(JSON.stringify(response.data.payload))
      if (response.status === 200) {
        setEmployee(response.data.payload[0])
        // You may want to update your UI or perform other actions on success
      }
    } catch (error) {
      console.error('Asset error:', error);
    }
  }

  useEffect(() => {
    if (employeeId) {
      getbyid()
    }
  }, [])

  const handleAddEmployee = async (employee: any) => {
    const authToken = sessionStorage.getItem('authToken');
    try {
      const response = await axios.post('https://103.68.23.37/api/hr/employee', employee, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      // console.log(JSON.stringify(response))
      if (response.status === 200) {
        // Handle success
        // console.log('Asset added successfully');
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Asset added successfully!',
        });
        router.push('/hr/Employee/Employee-List')

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
      }
    } catch (error) {
      console.error('Asset error:', error);
    }
  };

  return (
    <PageWrapper isProtected={false}>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Add New Employee</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
        </SubHeaderLeft>

        <AddEmployeeForm employeedata={employeedata ? employeedata : {}} onAddEmployee={handleAddEmployee} />

      </SubHeader>


    </PageWrapper>
  );
};


const dataURItoBlob = (dataURI: string | null) => {
  if (!dataURI) return null;

  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);

  }

  return new Blob([arrayBuffer], { type: mimeString });
};

export default AddEmployee;
