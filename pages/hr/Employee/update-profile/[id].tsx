import React, { useState } from 'react';
import axios from 'axios';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '@/layout/SubHeader/SubHeader';
import Page from '@/layout/Page/Page';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const ProfileImageUpload: React.FC = ({ id }) => {
  const [photo, setPhoto] = useState(null);
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile);
  };

  const handleUpload = async () => {
    try {
      // Check if a file is selected
      if (!photo) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please choose a file to upload!',
        });
        return;
      }

      // Check file type (allow only image files)
      if (!photo.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please choose a valid image file!',
        });
        return;
      }

      // Check file size (limit to 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (photo.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'File size exceeds the limit (5MB)!',
        });
        return;
      }

      const formData = new FormData();
      formData.append('employeeId', id);
      formData.append('photo', photo);

      const response = await axios.post('https://marsworld.co.in/api/hr/uploadprofilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { message, fileUrl } = response.data.payload;
      setFileUrl(fileUrl);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Update Image + {id}</span>
          <SubheaderSeparator />
          <strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format('DD MMM YYYY')}&nbsp;)
        </SubHeaderLeft>
      </SubHeader>
      <Page container='fluid'>
        <div className="container d-flex align-items-center justify-content-center ">
          <div className="w-50 p-4 shadow-sm rounded">
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Choose Photo:
              </label>
              {fileUrl && (
              <div className="mt-4">
                {/* <p className="alert alert-success">File has been uploaded successfully.</p> */}
                <img src={fileUrl} alt="Profile" className="img-fluid" />
              </div>
            )}
              <input
                type="file"
                id="photo"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <button onClick={handleUpload} className="btn btn-primary">
                Upload Photo
              </button>
            </div>

            
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default ProfileImageUpload;
