import React, { FC, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import axios from 'axios';
import Link from 'next/link';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import { CSVLink } from 'react-csv'; // Import CSVLink
import useDarkMode from '../../hooks/useDarkMode';
interface IJoiningPosition {
  positionId: number;
  position: string;
}

const JoiningPositionList: FC = () => {
  const [joiningPositions, setJoiningPositions] = useState<IJoiningPosition[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { darkModeStatus } = useDarkMode();

  const handleEdit = (positionId: number) => {
    console.log(`Edit position with ID: ${positionId}`);
    // Add your logic for handling edit here
  };

  const handleDelete = async (positionId: number) => {
    console.log(`Delete position with ID: ${positionId}`);
    const storedToken = sessionStorage.getItem('authToken');
    try {
      const confirmDeletion = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this Joining. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (!confirmDeletion.isConfirmed) {
        return;
      }

      const response = await axios.delete(`https://marsworld.co.in/api/hr/joining-position/${positionId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        // Handle success
        const filterdata = joiningPositions.filter((data, i) => {
          return data.positionId !== positionId
        })
        setJoiningPositions(filterdata)
      }
    } catch (error) {
      console.error('Error deleting joining position:', error);
    }
  };

  useEffect(() => {
    const fetchJoiningPositions = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.JOININGPOSTION, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setJoiningPositions(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching joining positions:', error);
      }
    };

    fetchJoiningPositions();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['3']);
  const { items, requestSort, getClassNamesFor } = useSortableData(joiningPositions);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.position && item.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CSV data for export
  const csvData = filteredItems.map((position) => ({
    'ID': position.positionId,
    'Position Name': position.position,
  }));

  return (
    <Card>
      <CardHeader style={{ backgroundColor: '#add8e6' }}>
        <div className='mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Search positions...'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className='mb-3'>
          <CSVLink data={csvData} filename={'joining_positions.csv'} className='btn btn-success'>
            Export to Excel
          </CSVLink>
        </div>
      </CardHeader>

      <CardBody className='table-responsive'>
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Position Name</th>
              <th scope='col'>Actions</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataPagination(filteredItems, currentPage, perPage)?.map((position) => (
              <tr key={position.positionId}>
                <td>{position.positionId}</td>
                <td>{position.position}</td>
                <td>
                  <Link
                    className='btn btn-primary'
                    href={`/hr/joining/add-new?${position.positionId}`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(position.positionId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {dataPagination(filteredItems, currentPage, perPage)?.length <= 0 && (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={4}>
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

export default JoiningPositionList;
