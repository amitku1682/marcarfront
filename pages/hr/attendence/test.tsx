import React, { useState } from 'react';
import axios from 'axios';
import Card, { CardBody, CardHeader } from '@/components/bootstrap/Card';

const EmployeeUpdateForm = () => {
  // State to hold form data with nested structure
  const [formDatas, setFormDatas] = useState({
    employeeId: "MCC-00014",
    password: "123456",
    firstName: "emp21",
    lastName: "sinha",
    email: "ak.emp1@gmail.com",
    contact: "9911728794",
    profileImage: "",
    fatherName: "empFather",
    husbandName: "",
    maritalStatus: "0",
    previousEmployer: "top",
    dateOfBirth: "top",
    currentAddress: "Test Asset Modelview",
    permanentAddress: "",   
    contactPerson: "ABC",
    relation: "Father",
    contactNumber: "973473922",
    adhaarNumber: "209523390288",
    panNumber: "AGFPD6305V",
    licenseNumber: "DL-0420060328457",
    bankName: "KOTAK MAHINDRA",
    accountNumber: "AGFPD6305V",
    accountType: "DL-0420060328457",
    ifscCode: "DL-0420060328459",
    joiningPosition: 4,
    joiningLocation: 12,
    zoneLocation: 39,
    joiningCenter: 4,
    asmId: 20,
    supervisorId: 27,
    joiningDate: "2018-06-02",
    reportingTime: "9:00 AM", 
    uanNumber: "3009",
    pfNumber: "1100",
    esiNumber: "1200",
    recruitedBy: "HR",
    baseSalary: 20000,
    hraSalary: 6000.00,
    conveyanceSalary: 2000,
    paymentMode: 2,
    deductPf: 1,
    deductEsi: 0,
    aadhaarProof: 0,
    panProof: 1,
    addressProof: 0,
    educationProof: 1
  });
  

  // Handle input change
  const handleInputChange = (fieldName, value) => {
    setFormDatas((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Handle form submission
  const handleUpdateEmployee = async () => {
    try {
    
console.log(formDatas)
const storedToken = sessionStorage.getItem('authToken');
const response = await axios.put('https://marsworld.co.in/api/hr/employeeUpdate', formDatas, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${storedToken}`,
  },
});
      // Handle success or update UI accordingly
    } catch (error) {
      console.error('Error updating employee:', error);
      // Handle error or show an error message to the user
    }
  };


  const formHeaderStyle = {
    backgroundColor: '#222',
    padding: '10px 5px',
    marginBottom: '15px',
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    width:'100%'
  };
  return (
    <Card>
     <CardHeader style={formHeaderStyle}>
      <h5>Add Employee Form</h5>
    </CardHeader>
     <CardBody>
       <div className='row '>
        <ul style={{ paddingRight: '10px', marginLeft: '10px' }}>
           <li style={{ padding: '5px 0' }}>Fields marked with * are mandatory.</li>
          <li style={{ padding: '5px 0' }}>Enter NA if the field has no value.</li>
          <li style={{ padding: '5px 0' }}>Upload only PNG, JPG, JPEG images.</li>
         </ul>

      

            <div className='col-sm-12 mb-3'>
              {/* Employee ID */}
              <div className='mb-3'>
                <label className='form-label'>Employee ID:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                />
              </div>

              {/* Password */}
              <div className='mb-3'>
                <label className='form-label'>Password:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>

              {/* First Name */}
              <div className='mb-3'>
                <label className='form-label'>First Name:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className='mb-3'>
                <label className='form-label'>Last Name:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              {/* Email */}
              <div className='mb-3'>
                <label className='form-label'>Email:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {/* Contact */}
              <div className='mb-3'>
                <label className='form-label'>Contact:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
              </div>

              {/* Profile Image */}
              <div className='mb-3'>
                <label className='form-label'>Profile Image:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.profileImage}
                  onChange={(e) => handleInputChange('profileImage', e.target.value)}
                />
              </div>

              {/* Father Name */}
              <div className='mb-3'>
                <label className='form-label'>Father Name:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                />
              </div>

              {/* Husband Name */}
              <div className='mb-3'>
                <label className='form-label'>Husband Name:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.husbandName}
                  onChange={(e) => handleInputChange('husbandName', e.target.value)}
                />
              </div>

              {/* Marital Status */}
              <div className='mb-3'>
                <label className='form-label'>Marital Status:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                />
              </div>

              {/* Previous Employer */}
              <div className='mb-3'>
                <label className='form-label'>Previous Employer:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.previousEmployer}
                  onChange={(e) => handleInputChange('previousEmployer', e.target.value)}
                />
              </div>

              {/* Date of Birth */}
              <div className='mb-3'>
                <label className='form-label'>Date of Birth:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>

              {/* Current Address */}
              <div className='mb-3'>
                <label className='form-label'>Current Address:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                />
              </div>

              {/* Permanent Address */}
              <div className='mb-3'>
                <label className='form-label'>Permanent Address:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                />
              </div>

              {/* Contact Person */}
              <div className='mb-3'>
                <label className='form-label'>Contact Person:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              </div>

              {/* Relation */}
              <div className='mb-3'>
                <label className='form-label'>Relation:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.relation}
                  onChange={(e) => handleInputChange('relation', e.target.value)}
                />
              </div>

              {/* Contact Number */}
              <div className='mb-3'>
                <label className='form-label'>Contact Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>

              {/* Adhaar Number */}
              <div className='mb-3'>
                <label className='form-label'>Adhaar Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.adhaarNumber}
                  onChange={(e) => handleInputChange('adhaarNumber', e.target.value)}
                />
              </div>

              {/* PAN Number */}
              <div className='mb-3'>
                <label className='form-label'>PAN Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                />
              </div>

              {/* License Number */}
              <div className='mb-3'>
                <label className='form-label'>License Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                />
              </div>

              {/* Bank Name */}
              <div className='mb-3'>
                <label className='form-label'>Bank Name:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                />
              </div>

              {/* Account Number */}
              <div className='mb-3'>
                <label className='form-label'>Account Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                />
              </div>

              {/* Account Type */}
              <div className='mb-3'>
                <label className='form-label'>Account Type:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                />
              </div>

              {/* IFSC Code */}
              <div className='mb-3'>
                <label className='form-label'>IFSC Code:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                />
              </div>

              {/* Joining Position */}
              <div className='mb-3'>
                <label className='form-label'>Joining Position:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.joiningPosition}
                  onChange={(e) => handleInputChange('joiningPosition', e.target.value)}
                />
              </div>

              {/* Joining Location */}
              <div className='mb-3'>
                <label className='form-label'>Joining Location:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.joiningLocation}
                  onChange={(e) => handleInputChange('joiningLocation', e.target.value)}
                />
              </div>

              {/* Zone Location */}
              <div className='mb-3'>
                <label className='form-label'>Zone Location:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.zoneLocation}
                  onChange={(e) => handleInputChange('zoneLocation', e.target.value)}
                />
              </div>

              {/* Joining Center */}
              <div className='mb-3'>
                <label className='form-label'>Joining Center:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.joiningCenter}
                  onChange={(e) => handleInputChange('joiningCenter', e.target.value)}
                />
              </div>

              {/* ASM ID */}
              <div className='mb-3'>
                <label className='form-label'>ASM ID:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.asmId}
                  onChange={(e) => handleInputChange('asmId', e.target.value)}
                />
              </div>

              {/* Supervisor ID */}
              <div className='mb-3'>
                <label className='form-label'>Supervisor ID:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.supervisorId}
                  onChange={(e) => handleInputChange('supervisorId', e.target.value)}
                />
              </div>

              {/* Joining Date */}
              <div className='mb-3'>
                <label className='form-label'>Joining Date:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />
              </div>

              {/* Reporting Time */}
              <div className='mb-3'>
                <label className='form-label'>Reporting Time:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.reportingTime}
                  onChange={(e) => handleInputChange('reportingTime', e.target.value)}
                />
              </div>

              {/* UAN Number */}
              <div className='mb-3'>
                <label className='form-label'>UAN Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.uanNumber}
                  onChange={(e) => handleInputChange('uanNumber', e.target.value)}
                />
              </div>

              {/* PF Number */}
              <div className='mb-3'>
                <label className='form-label'>PF Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.pfNumber}
                  onChange={(e) => handleInputChange('pfNumber', e.target.value)}
                />
              </div>

              {/* ESI Number */}
              <div className='mb-3'>
                <label className='form-label'>ESI Number:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.esiNumber}
                  onChange={(e) => handleInputChange('esiNumber', e.target.value)}
                />
              </div>

              {/* Recruited By */}
              <div className='mb-3'>
                <label className='form-label'>Recruited By:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.recruitedBy}
                  onChange={(e) => handleInputChange('recruitedBy', e.target.value)}
                />
              </div>

              {/* Base Salary */}
              <div className='mb-3'>
                <label className='form-label'>Base Salary:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.baseSalary}
                  onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                />
              </div>

              {/* HRA Salary */}
              <div className='mb-3'>
                <label className='form-label'>HRA Salary:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.hraSalary}
                  onChange={(e) => handleInputChange('hraSalary', e.target.value)}
                />
              </div>

              {/* Conveyance Salary */}
              <div className='mb-3'>
                <label className='form-label'>Conveyance Salary:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.conveyanceSalary}
                  onChange={(e) => handleInputChange('conveyanceSalary', e.target.value)}
                />
              </div>

              {/* Payment Mode */}
              <div className='mb-3'>
                <label className='form-label'>Payment Mode:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.paymentMode}
                  onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                />
              </div>

              {/* Deduct PF */}
              <div className='mb-3'>
                <label className='form-label'>Deduct PF:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.deductPf}
                  onChange={(e) => handleInputChange('deductPf', e.target.value)}
                />
              </div>

              {/* Deduct ESI */}
              <div className='mb-3'>
                <label className='form-label'>Deduct ESI:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.deductEsi}
                  onChange={(e) => handleInputChange('deductEsi', e.target.value)}
                />
              </div>

              {/* Aadhaar Proof */}
              <div className='mb-3'>
                <label className='form-label'>Aadhaar Proof:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.aadhaarProof}
                  onChange={(e) => handleInputChange('aadhaarProof', e.target.value)}
                />
              </div>

              {/* PAN Proof */}
              <div className='mb-3'>
                <label className='form-label'>PAN Proof:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.panProof}
                  onChange={(e) => handleInputChange('panProof', e.target.value)}
                />
              </div>

              {/* Address Proof */}
              <div className='mb-3'>
                <label className='form-label'>Address Proof:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.addressProof}
                  onChange={(e) => handleInputChange('addressProof', e.target.value)}
                />
              </div>

              {/* Education Proof */}
              <div className='mb-3'>
                <label className='form-label'>Education Proof:</label>
                <input
                  type='text'
                  className=''
                  value={formDatas.educationProof}
                  onChange={(e) => handleInputChange('educationProof', e.target.value)}
                />
              </div>

              {/* Update Employee Button */}
              <button className='btn btn-primary' onClick={handleUpdateEmployee}>
                Update Employee
              </button>
            </div>
            </div>
            
      
      </CardBody>
    </Card>
  );
};


export default EmployeeUpdateForm;
