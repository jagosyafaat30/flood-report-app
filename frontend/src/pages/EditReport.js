import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-2xl font-bold text-gray-800">
              🌊 Flood Report
            </Link>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Welcome, {user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportsAPI.getById(id);
        setFormData({ title: response.data.title, description: response.data.description, status: response.data.status });
      } catch (err) {
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);
  
  const { title, description, status } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const updatedReport = new FormData();
    updatedReport.append('title', title);
    updatedReport.append('description', description);
    
    if (user?.role === 'admin') {
      updatedReport.append('status', status);
    }
    
    if (image) {
      updatedReport.append('image', image);
    }

    try {
      await reportsAPI.update(id, updatedReport);
      navigate(`/report/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-6 py-8 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">Edit Report</h2>
        
        <div className="p-8 bg-white rounded-lg shadow-md">
            {loading && <p>Loading...</p>}
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            {!loading && !error && (
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                        rows="4"
                        className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      {user?.role === 'admin' ? (
                        <select
                          name="status"
                          value={status}
                          onChange={onChange}
                          className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-lg text-gray-900">{status}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Change Image</label>
                      <input
                        type="file"
                        name="image"
                        onChange={onFileChange}
                        className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>


                    <div className="flex justify-end space-x-4">
                        <Link to="/dashboard" className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </Link>
                        <button type="submit" className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Report'}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}

export default EditReport;
