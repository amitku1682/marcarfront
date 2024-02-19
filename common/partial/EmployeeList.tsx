import React, { FC, useState, useEffect } from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ENDPOINTS from '@/core/endpoints';
import * as XLSX from 'xlsx';
import api from '@/core/api';
import Button from '@/components/bootstrap/Button';
interface IEmployee {
  empId: number;
  EmployeeName: string;
  userName: string;
  email: string;
  password: string;
  role: number;
  isRejoin: number;
  apiToken: string;
  rememberToken: string | null;
  isLocked: number;
  isDelete: number;
  userDetails: {
    id: number | null;
    userID: number | null;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    dob: string | null;
    // Add more fields as needed
  };
  emergencyDetails: {
    contactPerson: string | null;
    relation: string | null;
    contactNamer: string | null;
    isDelete: number | null;
    // Add more fields as needed
  };
  identificationDetail: {
    adhaarNumber: string | null;
    PanNo: string | null;
    licenseNumber: string | null;
    isDeleted: number | null;
    // Add more fields as needed
  };
  bankDetailuser: {
    bankName: string | null;
    accountNamber: string | null;
    accounttype: string | null;
    ifscCode: string | null;
    isDelted: number | null;
    // Add more fields as needed
  };
  employmentDetailsuser: {
    joiningPosition: string | null;
    joinningLocation: string | null;
    zoneLocation: string | null;
    joiningCenter: string | null;
    joiningDate: string | null;
    reportingTime: string | null;
    pfNumber: string | null;
    uanNumber: string | null;
    esiNumber: string | null;
    recruitedBy: string | null;
    isDeleted: number | null;
    // Add more fields as needed
  };
  salaryDetailssuser: {
    id: number | null;
    user_id: number | null;
    base_salary: number | null;
    hra_salary: number | null;
    conveyance_salary: number | null;
    salary_active_date: string | null;
    payment_mode: string | null;
    deduct_pf: number | null;
    deduct_esi: number | null;
    is_deleted: number | null;
    created_by: string | null;
    updated_by: string | null;
    created_at: string | null;
    updated_at: string | null;
    // Add more fields as needed
  };
  empDocs: {
    id: number | null;
    user_id: number | null;
    adhaar: string | null;
    pan: string | null;
    address_proof: string | null;
    education_proof: string | null;
    is_deleted: number | null;
    created_by: string | null;
    updated_by: string | null;
    created_at: string | null;
    updated_at: string | null;
    // Add more fields as needed
  };
}
const EmployeeList: FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const { darkModeStatus } = useDarkMode();
  const [filter, setFilter] = useState('');
  const navigate = useRouter();

  const handleEdit = (positionId: number) => {
    console.log(`Edit position with ID: ${positionId}`);
    // navigate.push(`/hr/Employee/add-employee-attendance/${positionId}`);
  };

 console.log('employees' +JSON.stringify(employees.userDetails))

  const handleDelete = async (employeeId: string) => {
    console.log(employeeId);

    try {
      const storedToken = sessionStorage.getItem('authToken');
      const response = await axios.delete(`https://marsworld.co.in/api/hr/employeeDelete`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        data: {
          employeeId: employeeId,
        },
      });
      // console.log(response);
      if (response.data.success === 'true') {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.employeeId !== employeeId)
        );
      } else {
        console.error('Failed to delete employee:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  
  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some(
      (value) =>
        value &&
        typeof value === 'string' &&
        value.toLowerCase().includes(filter.toLowerCase())
    )
  );
  

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EmployeeData');
    XLSX.writeFile(wb, 'EmployeeData.xlsx');
  };

  const handlePending = (positionId: number) => {
    console.log(`Delete position with ID: ${positionId}`);
    navigate.push(`/hr/Employee/add-employee-attendance/${positionId}`);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.EMOLOYEELIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        //console.log("test"+response.data.payload)
        if (response.data.success === 'true') {
          setEmployees(response.data.payload);
        } else {
          console.error('Failed to fetch employees:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);
  
  const handleUnlock = (employeeId) => {
    // For demonstration purposes, let's log a message
    console.log(`Unlocking employee with ID: ${employeeId}`);
    
  };
  


  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['10']);
  const { items, requestSort, getClassNamesFor } = useSortableData(filteredEmployees);

  return (
    <Card>
     <CardHeader style={{ backgroundColor: '#add8e6' }}>
        <div className='mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Filter employees...'
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <div className='mb-3'>
          <button
            className='btn btn-success'
            onClick={handleExportToExcel}
            disabled={filteredEmployees.length === 0}
          >
            Export to Excel
          </button>
        </div>
      </CardHeader>
      <CardBody className='table-responsive'>
        <table className='table  table-hover'>
          <thead>
            <tr> 
              <th scope='col'>Profile</th>
              <th scope='col'>Employee ID</th>
             
              <th scope='col'>Employee Name</th>
              <th scope='col'>Username</th>
              <th scope='col'>Email</th>
              {/* <th scope='col'>Phone</th> */}
              {/* <th scope='col'>Is Locked</th>
              <th scope='col'>Is Delete</th>   */}
                <th scope='col'>Update Profile</th>
              <th scope='col'>  Face</th>
              <th scope='col'>Actions</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataPagination(items, currentPage, perPage)?.length > 0 &&
              dataPagination(items, currentPage, perPage).map((employee) => (

               
                <tr key={employee.employeeId}>
                  {/* {console.log('res'+employee.userDetails.firstName || '')} */}
               <td>
    {/* Perform a null/undefined check for userDetails before accessing profile_image */}
    <td>
  <img
    src={employee.userDetails?.profileImage || "/profile.png"}
    alt="Profile"
    width="50"
    style={{ borderRadius: '50%' }}
  />
</td>

  </td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.userName}</td>
                  <td>{employee.email}</td>
                  {/* <td>{employee.employees}</td> */}
                  {/* <td>
  {employee.isLocked === 1 ? (
    <img src="/lock.png" alt="Checkmark" width="25" />
  ) : (
    <img src="/open-padlock.png" alt="Checkmark" width="25" />
  )}
</td>
<td>
  {employee.isDelete === 1 ? (
    <img src="/success.png" alt="Checkmark" width="25" />
  ) : (
    <img src="/error.png" alt="Checkmark" width="25" />
  )}
</td> */}
{/*  */}
{/* <td>{employee.employee}</td> */}
<td>
                    <Link
                      className='btn btn-primary  w-100'
                      href={`/hr/Employee/update-profile/${employee.employeeId}`}
                    >
                      VIEW
                    </Link>
                  </td>
                  <td>
                    {!employee.is_face_registerd ? (
                      <Link
                      
                        href={`/hr/Employee/add-employee-attendance/${employee.userName}`}
                      >
                        <img src="/process.png" alt="Checkmark" width="25" />
                      </Link>
                    ) : (
                      <img src="/success.png" alt="Checkmark" width="25" />
                      // <Button className='btn btn-success w-100' disabled>
                      //   Registered
                      // </Button>
                    )}
                  </td>
                  <td>
                    <Link
                      
                      href={`/hr/Employee/update-employee/${employee.userId}`}
                    >
                       {/* <Button
      style={{ backgroundColor: '#3498db', color: '#fff', border: '1px solid #3498db' }}
      icon='Edit'
    /> */}
<img src="/edit.png" alt="Checkmark" width="25" />
                    </Link>
                  </td>
                  
                  <td>

                  {/* <Button  onClick={() => handleDelete(employee.employeeId)}/> <img src="/delete.png" alt="Checkmark" width="25" /> */}
                    <Button
                 
                      onClick={() => handleDelete(employee.employeeId)}
                    >
                      <img src="/delete.png" alt="Checkmark" width="25" />
                    </Button>
                  </td>
                </tr>
              ))}
            {dataPagination(items, currentPage, perPage)?.length <= 0 && (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={17}>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <PaginationButtons
        data={items}
        label='employees'
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </Card>
  );
};

export default EmployeeList;
