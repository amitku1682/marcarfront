import React, { FC, useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '../../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Page from '@/layout/Page/Page';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import { CSVLink } from 'react-csv';

interface Center {
  Id: number;
  name: string;
  store_id: number;
  asm_id: number;
  address: string;
}

const CenterList: FC = () => {
  const router = useRouter();
  const [centerdata, setCenterdata] = useState<Center[]>([]);
  const { darkModeStatus } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const { items, requestSort, getClassNamesFor } = useSortableData(centerdata);

  const handleDelete = async (asmId: number) => {
    const confirmDeletion = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this center. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirmDeletion.isConfirmed) {
      return;
    }

    try {
      const storedToken = sessionStorage.getItem('authToken');
      const response = await axios.delete(`https://marsworld.co.in/api/hr/center/${asmId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        const filterdata = centerdata.filter((data) => data.Id !== asmId);
        setCenterdata(filterdata);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Center deleted successfully!',
        });
      }
    } catch (error) {
      console.error('Error deleting center:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete center. Please try again.',
      });
    }
  };

  const headers = [
    { label: 'Center ID', key: 'Id' },
    { label: 'Name', key: 'name' },
    { label: 'Store ID', key: 'store_id' },
    { label: 'ASM ID', key: 'asm_id' },
    { label: 'Address', key: 'address' },
  ];

  const handleExportToExcel = () => {
    // Implement export functionality here
    console.log('Export to Excel clicked');
  };

  const getCenters = async () => {
    const storedToken = sessionStorage.getItem('authToken');

    try {
      const { data } = await api.get(ENDPOINTS.CENTER, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setCenterdata(data.payload.data);
    } catch (error: any) {
      if (error?.response?.data === 'Invalid token.') {
        localStorage.removeItem('authToken');
        router.push(`/auth/login`);
      }
      console.log({ error });
    }
  };

  useEffect(() => {
    getCenters();
  }, []);

  // Filter the items based on the search term
  const filteredItems = items.filter((center) =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Page container='fluid'>
      <div className='row'>
        <div className='col-12'>
          <Card>
            <CardHeader style={{ backgroundColor: '#add8e6' }}>
              <div className='mb-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Search centers...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='mb-3'>
              <CSVLink data={centerdata} filename={'location_data.csv'} className='btn btn-success mb-3'>
          Export to CSV
        </CSVLink>

              </div>
            </CardHeader>
            <CardBody className='table-responsive'>
              <table className='table table-modern table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Center ID</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Store Id</th>
                    <th scope='col'>ASM Id</th>
                    <th scope='col'>Address</th>
                    <th scope='col'>Actions</th>
                    <th scope='col'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPagination(filteredItems, currentPage, perPage)?.length > 0 &&
                    dataPagination(filteredItems, currentPage, perPage).map((center) => (
                      <tr key={center.Id}>
                        <td>{center.Id}</td>
                        <td>{center.name}</td>
                        <td>{center.store_id}</td>
                        <td>{center.asm_id}</td>
                        <td>{center.address}</td>
                        <td>
                          <Link className='btn btn-primary' href={`/hr/centers/Add?id=${center.Id}`}>
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button className='btn btn-danger' onClick={() => handleDelete(center.Id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  {dataPagination(filteredItems, currentPage, perPage)?.length <= 0 && (
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
        </div>
      </div>
    </Page>
  );
};

export default CenterList;
