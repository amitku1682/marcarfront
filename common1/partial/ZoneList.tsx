import React, { FC, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
} from '../../components/bootstrap/Card';
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import Link from 'next/link';
import { CSVLink } from 'react-csv'; // Import CSVLink

interface IZone {
  storeId: number;
  name: string;
}

const ZoneList: FC = () => {
  const [zones, setZones] = useState<IZone[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkModeStatus } = useDarkMode();

  const handleEdit = (zoneId: number) => {
    console.log(`Edit zone with ID: ${zoneId}`);
    // Add your logic for handling edit here
  };

  const handleDelete = async (zoneId: number) => {
    // Display a confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this zone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        // Make API call to delete zone
        const response = await api.delete(`${ENDPOINTS.ZONELIST}/${zoneId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.status === 200) {
          // Handle success
          console.log('Zone deleted successfully');
          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Zone deleted successfully!',
          });

          // Update state to reflect the changes
          setZones((prevZones) =>
            prevZones.filter((zone) => zone.storeId !== zoneId)
          );
        } else {
          // Handle error
          console.error('Failed to delete zone:', response.statusText);
          // Show SweetAlert error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete zone. Please try again.',
          });
        }
      } catch (error) {
        console.error('Delete zone error:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch zone data when the component mounts
    const fetchZones = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.ZONELIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setZones(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['3']);
  const { items, requestSort, getClassNamesFor } = useSortableData(zones);

  // Filter items based on search term
  const filteredItems = items.filter((zone) =>
    Object.values(zone).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // CSV data for export
  const csvData = filteredItems.map((zone) => ({
    'Store ID': zone.storeId,
    'Name': zone.name,
  }));

  return (
    <Card>
   
      <CardHeader style={{ backgroundColor: '#add8e6' }}> <div className='mb-3'>
          <label htmlFor='search' className='form-label'>
            Search:
          </label>
          <input
            type='text'
            id='search'
  placeholder='Filter zone...'
            className='form-control'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CSVLink data={csvData} filename={'zone_data.csv'} className='btn btn-success mb-3'>
          Export to CSV
        </CSVLink>
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
            {dataPagination(filteredItems, currentPage, perPage)?.length > 0 &&
              dataPagination(filteredItems, currentPage, perPage).map((zone) => (
                <tr key={zone.storeId}>
                  <td>{zone.storeId}</td>
                  <td>{zone.name}</td>
                  <td>
                    <Link
                      className='btn btn-primary'
                      href={`/hr/zone/update-zone/${zone.storeId}`}
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      className='btn btn-danger'
                      onClick={() => handleDelete(zone.storeId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            {dataPagination(filteredItems, currentPage, perPage)?.length <= 0 && (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={6}>
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

export default ZoneList;
