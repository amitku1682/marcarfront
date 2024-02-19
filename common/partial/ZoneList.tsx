import React, { FC, useState, useEffect } from 'react';
// import Card, { CardBody, CardHeader } from '../../../components/bootstrap/Card';
// import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';

import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Page from '@/layout/Page/Page';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import { CSVLink } from 'react-csv';
import Button from '@/components/bootstrap/Button';
import Card, { CardBody, CardHeader } from '@/components/bootstrap/Card';
import PaginationButtons, { PER_COUNT, dataPagination } from '@/components/PaginationButtons';
import useDarkMode from '@/hooks/useDarkMode';
import useSortableData from '@/hooks/useSortableData';

interface Zone {
  Id: number;
  name: string;
}

const ZoneList: FC = () => {
  const router = useRouter();
  const [zonedata, setZonedata] = useState<Zone[]>([]);
  const { darkModeStatus } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['10']);
  const { items, requestSort, getClassNamesFor } = useSortableData(zonedata);

  const handleDelete = async (zoneId: number) => {
    const confirmDeletion = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this zone. This action cannot be undone.',
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
      const response = await axios.delete(`https://marsworld.co.in/api/hr/zone/${zoneId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        const filterdata = zonedata.filter((data) => data.Id !== zoneId);
        setZonedata(filterdata);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Zone deleted successfully!',
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
    { label: 'Store ID', key: 'Id' },
    { label: 'Name', key: 'name' },
  ];

  const handleExportToExcel = () => {
    // Implement export functionality here
    console.log('Export to Excel clicked');
  };

  const getZones = async () => {
    const storedToken = sessionStorage.getItem('authToken');

    try {
      const { data } = await api.get(ENDPOINTS.ZONELIST, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setZonedata(data.payload.data);
    } catch (error: any) {
      if (error?.response?.data === 'Invalid token.') {
        localStorage.removeItem('authToken');
        router.push(`/auth/login`);
      }
      console.log({ error });
    }
  };

  useEffect(() => {
    getZones();
  }, []);

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
                  placeholder='Search zone...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='mb-3'>
<Button className='btn btn-succss'></Button>
              </div>
            </CardHeader>
            <CardBody className='table-responsive'>
              <table className='table table-modern table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Store ID</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Actions</th>
                    <th scope='col'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPagination(items, currentPage, perPage)?.length > 0 &&
                    dataPagination(items, currentPage, perPage).map((zone) => (
                      <tr key={zone.storeId}>
                        <td>{zone.storeId}</td>
                        <td>{zone.name}</td>
                        <td>
                          <Link className='btn btn-primary' href={`/hr/zone/update-zone/${zone.storeId}`}>
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button className='btn btn-danger' onClick={() => handleDelete(zone.storeId)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  {dataPagination(items, currentPage, perPage)?.length <= 0 && (
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
              data={items}
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

export default ZoneList;
