import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import Webcam from "react-webcam";
import Button from "@/components/bootstrap/Button";
import PageWrapper from "@/layout/PageWrapper/PageWrapper";
import Page from "@/layout/Page/Page";
import * as faceapi from 'face-api.js';
import axios from 'axios';  // Import axios
import attedenceapi from '../../../../core/api'

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { json } from "stream/consumers";
import ENDPOINTS from "@/core/endpoints";

type CreateUserResponse = {
  statusCode: number;
  success: string;
  payload?: {
    message: string;
  };
};
// ... (your imports)

const EmployeeAttendance = ({ id }) => {
  const [cameraStatus, setCameraStatus] = useState('opened');
  const [message, setMessage] = useState('');
  const [outline, setOutline] = useState('');
  const webcamRef = useRef();
  const detection = useRef();
  let counter = 0;
  const router = useRouter();

  const loadFaceApiModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };

  const handleStreamVideo = async () => {
    await loadFaceApiModels();

    detection.current = setInterval(async () => {
      if (counter <= 40 && webcamRef.current && webcamRef.current.video) {
        const faces = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions());

        if (faces.length === 1 && faces[0].score > 0.5) {
          counter++;
          setOutline('#00ff00');
          setMessage((prevMessage) => 'Stand still for ' + Math.round(4 - (counter / 10)) + ' seconds.');
        } else {
          counter = 0;
          setOutline('#f00000');
          setMessage((prevMessage) => 'Place the face in the oval.');
        }

        if (counter === 40) {
          const faceDescriptor = await getFaceDescriptor();
          console.log(faceDescriptor);
          takeScreenshotAndAuthenticate(faceDescriptor);
        }
      } else {
        // takeScreenshotAndAuthenticate();
      }
    }, 100);
  };

  const getFaceDescriptor = async () => {
    const detectionResult = await faceapi.detectSingleFace(
      webcamRef.current.video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detectionResult && detectionResult.score > 0.5) {
      const faceDescriptor = await faceapi.computeFaceDescriptor(
        webcamRef.current.video,
        detectionResult
      );

      return faceDescriptor;
    }

    return null;
  };

  const takeScreenshotAndAuthenticate = async (faceDescriptor) => {
    setCameraStatus('closed');
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();

      // Make API call with the screenshot and face descriptor
      registerUser(screenshot, id, faceDescriptor);
    }
  };

  const registerUser = async (screenshot, id, faceDescriptor) => {
    try {
      const base64Data = screenshot.replace(/^data:image\/jpeg;base64,/, '');

      const data = {
        employeeId: id,
        photo: base64Data,
        faceDescriptor: faceDescriptor,
      };

      console.log("Data:", data);

      const authToken = sessionStorage.getItem('authToken');

      const response = await axios.post('https://marsworld.co.in/api/hr/faceRegisters2', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Response:", response);

      if (response.status === 200) {
        // Handle success
        console.log('EMPLOYEE added successfully');

        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'EMPLOYEE added successfully!',
        });
        router.push('/hr/Employee/Employee-List');
        // You may want to update your UI or perform other actions on success
      } else {
        // Handle error
        console.error('Failed to add EMPLOYEE:', response.status, response.statusText);

        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add EMPLOYEE. Please try again.',
        });

        // You may want to show an error message or perform other actions on error
      }
    } catch (error) {
      console.error('API error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add EMPLOYEE. Please try again.',
      });
    }
  };

  const registerManually = () => {
    setCameraStatus('closed');
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      // Make API call with the screenshot without face recognition
      registerUser(screenshot, id, null);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(detection.current);
    };
  }, [cameraStatus]);

  return (
    <PageWrapper isProtected={false}>
      <Page className=''>
        <div className='row h-100 align-items-center justify-content-center'>
          <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container p-4 rounded border'>
            <div className="camera-face-overlay text-center justify-content-center" style={{ borderColor: outline }}>
              <h3 className="text-center">Employee Id : {id}</h3>
            </div>
            <div className="camera-face-overlay text-center justify-content-center" style={{ borderColor: outline }}>
              <div className="camera-face-message">{message}</div>
            </div>
            {cameraStatus === 'opened' && (
              <Webcam
                className="camera-video"
                id="webcam"
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                screenshotQuality={1}
                width={'100%'}
                mirrored={true}
                videoConstraints={{ facingMode: 'user' }}
                onUserMedia={handleStreamVideo}
                onUserMediaError={() => setCameraStatus('closed')}
              />
            )}
            <div className="d-flex justify-content-center mt-3">
              <Button
                className={`btn ${outline === '#00ff00' ? 'btn-success' : 'btn-primary'} mt-3 mx-2`}
                onClick={takeScreenshotAndAuthenticate}
              >
                {cameraStatus === 'opened' ? 'Attendance Processing ...' : 'Open Camera'}
              </Button>
              <Button
                className={`btn btn-primary mt-3 mx-2`}
                onClick={registerManually}
              >
                Register Manually
              </Button>
            </div>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id
    }
  };
};

export default EmployeeAttendance;
