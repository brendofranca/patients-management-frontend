const API_URL = 'https://localhost:8443/api/v1/patients';

export async function fetchData() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log('Error to load data from API:', error);    
    throw error;
  }
}

export async function createPatient(patientData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (response.ok) {
      const json = await response.json();  
      return json;
    } else {
      console.log('Error to create patient:', response.status);
      throw new Error('Error to create patient');
    }
  } catch (error) {
    console.log('Error to send request:', error);
    throw error;
  }
}

export async function updatePatient(patientId, patientData) {
  try {
    const response = await fetch(`${API_URL}/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      console.log('Error to update patient:', response.status);
      throw new Error('Error to update patient');
    }
  } catch (error) {
    console.log('Error to send request:', error);
    throw error;
  }
}

export async function deletePatient(patientId) {
  try {
    await fetch(`${API_URL}/${patientId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log('Error to delete patient:', error);
    throw error;
  }
}
