import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useDarkMode from '@/hooks/useDarkMode';
import Icon from '../icon/Icon';
import Card, { CardBody } from '../bootstrap/Card';
import { TColor } from '@/type/color-type';
import axios from 'axios';
import { useRouter } from 'next/router';
import api from '@/core/api';
import ENDPOINTS from '@/core/endpoints';

const Stats = () => {
  const { darkModeStatus } = useDarkMode();
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [asset, setAssets] = useState([]);
  const [zone, setZone] = useState([]);
  const [posotion, setJoiningPositions] = useState([]);
  const [location, setLocations] = useState([]);
  const [attendanceInfo, setAttendanceInfo] = useState({
    totalCount: 0,
    present: 0,
    absent: 0,
    weekOff: 0,
    notMarked: 0,
    halfDay: 0,
    holiday: 0,
    presentOnWO: 0
  });

  const fetchData = async () => {
    try {
      const storedToken = sessionStorage.getItem('authToken');
      const response = await axios.get('https://marsworld.co.in/api/hr/attendanceinfo', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setAttendanceInfo(response.data.payload.data);
    } catch (error) {
      console.error('Error fetching attendance info:', error);
      if (error) {
        router.push('/auth/login');
      }
    }
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
        setUser(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
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

  const getCenters = async () => {
    const storedToken = sessionStorage.getItem('authToken');

    try {
      const { data } = await api.get(ENDPOINTS.CENTER, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setZone(data.payload.data);
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

  useEffect(() => {
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

  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    if (!storedToken) {
      router.push('/auth/login');
    }
    fetchData();
  }, []);

  const updatedDummyData = [
    { total: attendanceInfo.totalCount, icon: 'Group', label: 'Total Employees', colorClass: { light: 'bg-l25-success', dark: 'bg-lo25-success' } },
    { total: attendanceInfo.present, icon: 'Group', label: 'Present Today', colorClass: { light: 'bg-l25-warning', dark: 'bg-lo25-warning' } },
    { total: attendanceInfo.absent, icon: 'Group', label: 'Absent Today', colorClass: { light: 'bg-l25-success', dark: 'bg-lo25-info' } },
    { total: attendanceInfo.weekOff, icon: 'Group', label: 'Week off today', colorClass: { light: 'bg-l25-danger', dark: 'bg-lo25-danger' } },
    { total: 0, icon: 'Group', label: 'Present on W/O', colorClass: { light: 'bg-l25-primary', dark: 'bg-lo25-primary' } },
    { total: attendanceInfo.halfDay, icon: 'Group', label: 'Half day', colorClass: { light: 'bg-l25-success', dark: 'bg-lo25-secondary' } },
    { total: attendanceInfo.notMarked, icon: 'Group', label: 'Not marked', colorClass: { light: 'bg-l50-secondary', dark: 'bg-lo25-secondary' } },
    { total: user.length, icon: 'Group', label: 'All User', colorClass: { light: 'bg-l50-secondary', dark: 'bg-lo25-secondary' } },
    { total: asset.length, icon: 'Group', label: 'Asset List', colorClass: { light: 'bg-l25-info', dark: 'bg-lo25-secondary' } },
    { total: zone.length, icon: 'Group', label: 'All Zone', colorClass: { light: 'bg-l50-secondary', dark: 'bg-lo25-secondary' } },
    { total: posotion.length, icon: 'Group', label: 'All Position', colorClass: { light: 'bg-l25-danger', dark: 'bg-lo25-secondary' } },
    { total: location.length, icon: 'Group', label: 'All Location', colorClass: { light: 'bg-l25-success', dark: 'bg-lo25-secondary' } },
  ];

  return (
    <div className='row row-cols-1 row-cols-md-4 g-4 mb-5'>
      {updatedDummyData.map((d) => (
        <div key={d.label} className='col'>
          <Card
            className={classNames('m-0 stats-card', {
              [d.colorClass.light]: !darkModeStatus,
              [d.colorClass.dark]: darkModeStatus,
            })}
          >
            <CardBody>
              <div className={classNames('d-flex align-items-center rounded-2 p-3')}>
                <div className='flex-shrink-0'>
                  <Icon icon={d.icon} size='3x' color={d.colorClass.dark.split('-')[2] as TColor || 'success'} />
                </div>
                <div className='flex-grow-1 ms-3'>
                  <div className='fw-bold fs-3 mb-0'>{d.total}</div>
                  <div className='text-muted mt-n2 truncate-line-1'>{d.label}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Stats;
