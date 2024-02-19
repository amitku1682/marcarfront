import React, { FC, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import Link from 'next/link';
import { CSVLink } from 'react-csv'; // Import CSVLink
import Button from '@/components/bootstrap/Button';

interface ILocation {
  locationId: number;
  name: string;
}

const LocationList: FC = () => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkModeStatus } = useDarkMode();

  const handleEdit = (locationId: number) => {
    // Add your logic for handling edit here
    console.log(`Edit location with ID: ${locationId}`);
  };

  const handleDelete = async (locationId: number) => {
    // Display a confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this location!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      // If the user confirms, proceed with the delete action
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.delete(`${ENDPOINTS.LOCATIONLIST}/${locationId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        console.log(response); // Log the response
        // Add logic to handle the UI update or other actions on success
        if (response.status === 200) {
          // Handle success, update the state or perform other actions
          const updatedLocations = locations.filter((loc) => loc.locationId !== locationId);
          setLocations(updatedLocations);

          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Location deleted successfully!',
          });
        }
      } catch (error) {
        console.error('Error deleting location:', error);
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete location. Please try again.',
        });
      }
    }
  };

  useEffect(() => {
    // Fetch location data when the component mounts
    const fetchLocations = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.LOCATIONLIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setLocations(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['3']);
  const { items, requestSort, getClassNamesFor } = useSortableData(locations);

  // Filter items based on search term
  const filteredItems = items.filter((location) =>
    Object.values(location).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // CSV data for export
  const csvData = filteredItems.map((location) => ({
    'Location ID': location.locationId,
    'Name': location.name,
  }));

  return (
    <Card>     <CardHeader style={{ backgroundColor: '#add8e6' }}>
       <div className='mb-3'>
          <label htmlFor='search' className='form-label'>
            Search:
          </label>
          <input
            type='text'
            id='search'
            placeholder='Filter Location...'
            className='form-control'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CSVLink data={csvData} filename={'location_data.csv'} className='btn btn-primary mb-3'>
          Export to CSV
        </CSVLink>
    </CardHeader>
      <CardBody className='table-responsive'>
       
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>Location ID</th>
              <th scope='col'>Name</th>
              <th scope='col'>Actions</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataPagination(filteredItems, currentPage, perPage)?.length > 0 &&
              dataPagination(filteredItems, currentPage, perPage).map((location) => (
                <tr key={location.locationId}>
                  <td>{location.locationId}</td>
                  <td>{location.name}</td>
                  <td>
                    <Link
                   
                      href={`/hr/location/update-location/${location.locationId}`}
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
  <Button
    className='danger'
    style={{ backgroundColor: '#ffdddd', color: 'red', fontSize: '18px', border: '1px solid #ff9999' }}
    icon='Delete'
    onClick={() =>  handleDelete(location.locationId)}
  />
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

export default LocationList;
