import React, { FC, useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv'; // Import CSVLink
import { useRouter } from 'next/router';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';

interface IAsset {
  assetId: number;
  asset: string;
  assetCategory: string;
  model: string;
  make: string;
  description: string;
  rate: number;
}

const AssetList: FC = () => {
  const router = useRouter();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkModeStatus } = useDarkMode();

  const handleDelete = async (assetId: number) => {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this asset!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const storedToken = sessionStorage.getItem('authToken');
          const response = await axios.delete(`https://marsworld.co.in/api/hr/asset/${assetId}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.status === 200) {
            // Handle success
            const updatedAssets = assets.filter((data) => data.assetId !== assetId);
            setAssets(updatedAssets);
            // Show SweetAlert success message
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Asset deleted successfully!',
            });
            router.push('/hr/asset');
          }
        } catch (error) {
          console.error('Error deleting asset:', error);
          // Show SweetAlert error message for deletion failure
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete asset. Please try again later.',
          });
        }
      }
    });
  };

  useEffect(() => {
    // Fetch asset data when the component mounts
    const fetchAssets = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.ASSETLIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setAssets(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['3']);
  const { items, requestSort, getClassNamesFor } = useSortableData(assets);

  // Filter items based on search term
  const filteredItems = items.filter((asset) =>
    Object.values(asset).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // CSV data for export
  const csvData = filteredItems.map((asset) => ({
    'Asset ID': asset.assetId,
    'Asset': asset.asset,
    'Category': asset.assetCategory,
    'Model': asset.model,
    'Make': asset.make,
    'Description': asset.description,
    'Rate': asset.rate,
  }));

  return (
    <Card><CardHeader style={{ backgroundColor: '#add8e6' }}>
      <div className='mb-3'>
          <label htmlFor='search' className='form-label'>
            Search:
          </label>
          <input
            type='text'
            id='search'
            className='form-control'
            placeholder='Filter asset...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CSVLink data={csvData} filename={'asset_data.csv'} className='btn btn-primary mb-3'>
          Export to CSV
        </CSVLink>

        </CardHeader>
      <CardBody className='table-responsive'>
       
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>Asset ID</th>
              <th scope='col'>Asset</th>
              <th scope='col'>Category</th>
              <th scope='col'>Model</th>
              <th scope='col'>Make</th>
              <th scope='col'>Description</th>
              <th scope='col'>Rate</th>
              <th scope='col'>Actions</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataPagination(filteredItems, currentPage, perPage)?.length > 0 &&
              dataPagination(filteredItems, currentPage, perPage).map((asset) => (
                <tr key={asset.assetId}>
                  <td>{asset.assetId}</td>
                  <td>{asset.asset}</td>
                  <td>{asset.assetCategory}</td>
                  <td>{asset.model}</td>
                  <td>{asset.make}</td>
                  <td>{asset.description}</td>
                  <td>{asset.rate}</td>
                  <td>
                    <Link
                      className='btn btn-primary'
                      href={`/hr/asset/update-asset/${asset.assetId}`}
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      className='btn btn-danger'
                      onClick={() => handleDelete(asset.assetId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {dataPagination(filteredItems, currentPage, perPage)?.length <= 0 && (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={9}>
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

export default AssetList;
