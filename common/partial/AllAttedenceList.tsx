import React, { FC, useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import axios from 'axios';
import { CSVLink } from 'react-csv';

interface IEmployee {
  employeeId: string;
  inTime: string | null;
  outTime: string | null;
  workingHours: string | null;
  attendanceTypeId: number | null;
  attendanceStatus: string | null;
  date: string; // Add date property to employee
}

interface IAttendanceData {
  date: string;
  employees: IEmployee[];
}

const AllAttendanceList: FC = () => {
  const [attendanceData, setAttendanceData] = useState<IAttendanceData[]>([]);
  const [searchDate, setSearchDate] = useState(getFormattedCurrentDate());
  const { darkModeStatus } = useDarkMode();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await axios.post('https://marsworld.co.in/api/hr/attendance/all', {
          startDate: calculateStartDate(),
          endDate: getFormattedCurrentDate(),
        }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
 

         
        setAttendanceData(response.data.payload.data || []); // Handle potential undefined response
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['3']);
  const { items, requestSort, getClassNamesFor } = useSortableData(
    attendanceData.flatMap(entry => entry.employees || [])
  );

  const csvData = items.map((entry) => ({
    'Employee ID': entry.employeeId,
    'Date': entry.date,
    'IN Time': entry.inTime || 'N/A',
    'Out Time': entry.outTime || 'N/A',
    'Working Hours': entry.workingHours || 'N/A',
    'Attendance Status': entry.attendanceStatus || 'N/A',
  }));

  const calculateStartDate = () => {
    const currentDate = new Date();
    currentDate.setDate(1); // Start from the first day of the current month
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const renderTableHeaders = () => {
    const headers = [<th key="employeeId" scope='col'>Employee ID</th>];
    for (let day = 1; day <= daysInMonth; day++) {
      headers.push(<th key={day}>{day}</th>);
    }
 
    return headers;
  };

  const renderAttendanceData = () => {
    return dataPagination(items, currentPage, perPage)?.map((entry) => {
      const attendanceStatusByDay: { [day: string]: string | null } = {};
      (entry.employees || []).forEach((employee) => {
        attendanceStatusByDay[employee.date] = employee.attendanceStatus ;
      });

      return (
        <tr key={`${entry.employeeId}`}>
          <td>{entry.employeeId}</td>
          <td>{entry.attendanceStatus}</td>
          
          <td>
          
          </td>
        </tr>
      );
    });
  };

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-center' style={{ backgroundColor: '#add8e6' }}>
        <div className='mb-3 flex-grow-1'>
        
          <div className='d-flex'>
            <input
              type='date'
              id='searchDate'
              placeholder='Filter attendance...'
              className='form-control me-2'
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
           
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
              {renderTableHeaders()}
            </tr>
          </thead>
          <tbody>
            {renderAttendanceData()}
            {dataPagination(items, currentPage, perPage)?.length <= 0 && (
              <tr>
                <td className='text-center' style={{ height: 100 }} colSpan={daysInMonth + 2}>
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

const getFormattedCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default AllAttendanceList;
