import React, { FC, useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { CSVLink } from 'react-csv';
import Button from '@/components/bootstrap/Button';


interface IAsset {
  userId: number;
  name: string;
  email: string;
  mobileNo: string;
  usersRole: string;
}

const Asm: FC = () => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkModeStatus } = useDarkMode();

  const handleEdit = (userId: number) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = async (userId: number) => {
    // Display a confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with the delete action
        try {
          const storedToken = sessionStorage.getItem('authToken');
          await axios.delete(`https://marsworld.co.in/api/hr/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          // Update the local state by removing the deleted user
          setAssets((prevAssets) => prevAssets.filter((asset) => asset.userId !== userId));

          // Show SweetAlert success message for successful deletion
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User deleted successfully!',
          });
        } catch (error) {
          console.error(`Error deleting user with ID ${userId}:`, error);

          // Show SweetAlert error message for deletion failure
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete User. Please try again later.',
          });
        }
      }
    });
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.USERLIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log(response);
        setAssets(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

 
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const { items, requestSort, getClassNamesFor } = useSortableData(assets);

  const filteredItems = items.filter((asset) =>
    Object.values(asset).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedItems = dataPagination(filteredItems, currentPage, perPage);
 // CSV data for export
 const csvData = paginatedItems.map((asset) => ({
  'User ID': asset.userId,
  'Name': asset.name,
  'Email': asset.email,
  'Mobile No': asset.mobileNo,
  'Role': asset.usersRole,
}));
  return (
    <Card>     <CardHeader style={{ backgroundColor: '#add8e6' }}>
     
     <div className='mb-3'>
          
          <input
            type='text'
            id='search'
            className='form-control'
            placeholder='Filter user...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CSVLink data={csvData} filename={'table_data.csv'} className='btn btn-success mb-3'>
  Export to CSV
</CSVLink>
     </CardHeader>
      <CardBody className='table-responsive'>
        
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>User ID</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Mobile No</th>
              <th scope='col'>Role</th>
              <th scope='col'>Actions</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((asset) => (
                <tr key={asset.userId}>
                  <td>{asset.userId}</td>
                  <td>{asset.name}</td>
                  <td>{asset.email}</td>
                  <td>{asset.mobileNo}</td>
                  <td>{asset.usersRole}</td>
                  <td>
  <Link href={`/hr/user/update-user/${asset.userId}`}>
    <Button
      style={{ backgroundColor: '#3498db', color: '#fff', border: '1px solid #3498db' }}
      icon='Edit'
    />
  </Link>
</td>

<td>
  <Button
    className='danger'
    style={{ backgroundColor: '#ffdddd', color: 'red',  border: '1px solid #ff9999' }}
    icon='Delete'
    onClick={() => handleDelete(asset.userId)}
  />
</td>




                </tr>
              ))
            ) : (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={7}>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <PaginationButtons
        data={filteredItems}
        label='items'
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </Card>
  );
};

export default Asm;
