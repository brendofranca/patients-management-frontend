import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { createPatient, deletePatient, fetchData, updatePatient } from './patientService';

function App() {
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState({ id: '', name: '', dateOfBirth: '', email: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    try {
      const json = await fetchData();
      setData(json);
    } catch (error) {
      toast.error('Error to load patients list.');
    }
  };

  const handleEdit = (item) => {
    setEditItem({
      ...item,
      dateOfBirth: format(parseISO(item.dateOfBirth), 'yyyy-MM-dd'),
    });
    setIsModalOpen(true);
    setIsNewRecord(false);
  };

  const handleNewRecord = () => {
    setEditItem({ name: '', dateOfBirth: '', email: '' });
    setIsModalOpen(true);
    setIsNewRecord(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearErrors();
  };

  const clearErrors = () => {
    setErrorMessage('');
    setEmailError('');
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editItem.name.trim() || !editItem.dateOfBirth || !editItem.email) {
      setErrorMessage('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      if (isNewRecord) {        
        await createPatient(editItem);
        setIsModalOpen(false);
        fetchDataApi();
        toast.success('Patient created successfully!');
      } else {
        const formattedDateOfBirth = formatDate(editItem.dateOfBirth);
        await updatePatient(editItem.id, { ...editItem, dateOfBirth: formattedDateOfBirth });  
        setIsModalOpen(false);
        fetchDataApi();
        toast.success('Patient updated successfully!');
      }
    } catch (error) {
      setErrorMessage('An error occurred while saving the patient.');
      toast.error('Failed to save the patient.');
    }
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    try {
      if (deleteItem) {
        await deletePatient(deleteItem.id);
        setDeleteItem(null);
        fetchDataApi();
        toast.success('Patient deleted successfully!');
      }
    } catch (error) {
      setErrorMessage('An error occurred while saving the patient.');
      toast.error('Failed to save the patient.');
    }
  };

  const handleDateOfBirthChange = (e) => {
    const { value } = e.target;
    setEditItem({ ...editItem, dateOfBirth: value });
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editItem.email.match(emailPattern)) {
      setEmailError('Invalid e-mail');
    } else {
      setEmailError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'dateOfBirth') {
      const formattedDate = formatDate(value);
      setEditItem({ ...editItem, [name]: formattedDate });
    } else {
      setEditItem({ ...editItem, [name]: value });
    }
  };  

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const isFormValid = editItem.name.trim() && editItem.dateOfBirth && editItem.email && !emailError;

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark justify-content-center">
        <span className="navbar-brand mb-0 h1">Patients Management v1.0</span>
      </nav>
      <div className="separator border-bottom"></div>
      <div className="container mt-3">
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={handleNewRecord}>
              Register
            </button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>E-mail</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>              
                    <td>{format(new Date(item.dateOfBirth), 'yyyy-MM-dd')}</td>
                    <td>{item.email}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Actions">
                        <button className="btn btn-primary btn-flat btn-square" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <span className="btn-separator"></span>
                        <button className="btn btn-danger btn-flat btn-square" onClick={() => handleDelete(item)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isNewRecord ? 'Register Patient' : 'Edit Patient'}</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editItem.name}
                      onChange={handleInputChange}
                      required
                    />
                    {!editItem.name.trim() && <p className="text-danger">Please enter a name.</p>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={editItem.dateOfBirth}
                      onChange={handleDateOfBirthChange}
                      required
                    />
                    {editItem.dateOfBirth === '' && <p className="text-danger">Please enter a date of birth.</p>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={editItem.email}
                      onChange={handleInputChange}
                      onBlur={validateEmail}
                      required
                    />
                    {editItem.email === '' && <p className="text-danger">Please enter an e-mail.</p>}
                    {emailError && <p className="text-danger">{emailError}</p>}
                  </div>
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                      {isNewRecord ? 'Create' : 'Save changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}                
                  
      {deleteItem && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Patient</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteItem(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this patient?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteItem(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
