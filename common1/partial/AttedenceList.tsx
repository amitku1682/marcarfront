import React, { FC, useState, useEffect } from 'react';

import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import { CSVLink } from 'react-csv'; // Import CSVLink
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';

interface IAttendance {
  employeeId: string;
  date: string;
  inTime: string | null;
  outTime: string | null;
  workingHours: string | null;
  attendanceStatus: string | null;
}

const AttendanceList: FC = () => {
  const [attendance, setAttendance] = useState<IAttendance[]>([]);
  const [searchDate, setSearchDate] = useState(getFormattedCurrentDate());
  const { darkModeStatus } = useDarkMode();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await axios.post('https://marsworld.co.in/api/hr/attendance', {
          date: searchDate,
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setAttendance(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [searchDate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['10']);
  const { items, requestSort, getClassNamesFor } = useSortableData(attendance);

  const handleSearch = async () => {
    try {
      const storedToken = sessionStorage.getItem('authToken');
      const response = await axios.post('https://marsworld.co.in/api/hr/attendance', {
        date: searchDate,
      }, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setAttendance(response.data.payload.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const csvData = items.map((entry) => ({
    'Employee ID': entry.employeeId,
    'Date': entry.date,
    'IN Time': entry.inTime || 'N/A',
    'Out Time': entry.outTime || 'N/A',
    'Working Hours': entry.workingHours || 'N/A',
    'Attendance Status': entry.attendanceStatus || 'N/A',
  }));

  return (
    <Card>
     <CardHeader className='d-flex justify-content-between align-items-center' style={{ backgroundColor: '#add8e6' }}>
  <div className='mb-3 flex-grow-1'>
    <label htmlFor='searchDate' className='form-label'>
      Search by Date:
    </label>
    <div className='d-flex'>
      <input
        type='date'
        id='searchDate'
        placeholder='Filter attendance...'
        className='form-control me-2'
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
      />
      <button className='btn btn-success' onClick={handleSearch}>
        Search
      </button>
      <CSVLink data={csvData} filename={`attendance_data_${searchDate}.csv`} className='btn btn-warning ms-2'>
        Export to CSV
      </CSVLink>
    </div>
  </div>
</CardHeader>

      <CardBody className='table-responsive'>
       
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>Employee ID</th>
              <th scope='col'>Date</th>
              <th scope='col'>IN Time</th>
              <th scope='col'>Out Time</th>
              <th scope='col'>Working Hours</th>
              <th scope='col'>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {dataPagination(items, currentPage, perPage)?.length > 0 &&
              dataPagination(items, currentPage, perPage).map((entry) => (
                <tr key={entry.date}>
                  <td>{entry.employeeId}</td>
                  <td>{entry.date}</td>
                  <td>{entry.inTime || 'N/A'}</td>
                  <td>{entry.outTime || 'N/A'}</td>
                  <td>
                    {entry.workingHours ? (
                      <button className='btn btn-primary w-50'>
                        {entry.workingHours}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {entry.attendanceStatus ? (
                      <button type="button" className="btn btn-primary w-50">
                        {entry.attendanceStatus}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            {dataPagination(items, currentPage, perPage)?.length <= 0 && (
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
        data={items}
        label='items'
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </Card>
  );
};

// Helper function to get the formatted current date
const getFormattedCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default AttendanceList;
