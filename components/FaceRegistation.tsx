import React, { useState, useRef, useEffect } from 'react';
import { detectAllFaces, TinyFaceDetectorOptions, createCanvasFromMedia } from 'face-api.js';

import Button from './bootstrap/Button';
import FormGroup from './bootstrap/forms/FormGroup';
import Input from './bootstrap/forms/Input';


const EmployeeRegistration: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
  });

  useEffect(() => {
    startCamera();
   // return stopCamera;
   
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  // const stopCamera = () => {
  //   if (isCameraOn) {
  //     const stream = videoRef.current?.srcObject as MediaStream;
  //     if (stream) {
  //       const tracks = stream.getTracks();
  //       tracks.forEach((track) => track.stop());
  //     }
  //   }
  // };

  const captureFace = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const options = new TinyFaceDetectorOptions();
      const detections = await detectAllFaces(video, options).withFaceLandmarks();

      if (detections.length > 0) {
        const canvas = createCanvasFromMedia(video);
       // detections.forEach(({ landmarks }) => landmarks.draw(canvas));
        
        const imageData = canvas.toDataURL('image/jpeg');
        const employeeData = {
          ...employeeDetails,
          faceImage: imageData,
        };

        // Perform API call to register employee data
        // Example: await registerEmployee(employeeData);

        console.log('Employee details captured:', employeeData);
      } else {
        console.log('No face detected');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleCamera = () => {
    if (isCameraOn) {
    //  stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Employee Registration</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <video ref={videoRef} width="100%" height="auto" autoPlay muted style={{ marginBottom: '10px' }}></video>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <FormGroup label="First Name">
            <Input
              type="text"
              name="firstName"
              value={employeeDetails.firstName}
              onChange={handleInputChange}
              className="form-control"
            />
          </FormGroup>

          <FormGroup label="Last Name">
            <Input
              type="text"
              name="lastName"
              value={employeeDetails.lastName}
              onChange={handleInputChange}
              className="form-control"
            />
          </FormGroup>

          <FormGroup label="Employee ID">
            <Input
              type="text"
              name="employeeId"
              value={employeeDetails.employeeId}
              onChange={handleInputChange}
              className="form-control"
            />
          </FormGroup>

          <FormGroup label="Department">
            <Input
              type="text"
              name="department"
              value={employeeDetails.department}
              onChange={handleInputChange}
              className="form-control"
            />
          </FormGroup>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <Button
            color={isCameraOn ? 'danger' : 'success'}
            onClick={handleToggleCamera}
            className="btn btn-block"
          >
            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          </Button>
        </div>
      </div>

      <div className="row justify-content-center mt-2">
        <div className="col-md-8">
          <Button
            color="primary"
            onClick={captureFace}
       //     disabled={!isCameraOn}
            className="btn btn-block"
          >
            Capture Employee Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
