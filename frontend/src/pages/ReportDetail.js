import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportsAPI.getById(id);
        console.log('Fetched Report:', response.data); // Debugging line
        setReport(response.data);
      } catch (err) {
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    try {
      await reportsAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete report.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-6 py-8 mx-auto">
        {loading && <p>Loading report...</p>}
        {error && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
        
        {report && (
          <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{report.title}</h2>
              <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${
                  report.status === 'Pending' ? 'bg-yellow-500' :
                  report.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {report.status}
                </span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Reported on: {new Date(report.createdAt).toLocaleString()}
            </p>

            {report.image && (
                <div className="my-4">
                    <h3 className="mb-2 text-xl font-semibold">Image</h3>
                    <img 
                        src={`http://localhost:5000/${report.image}`} 
                        alt={report.title} 
                        className="object-cover w-full rounded-lg"
                    />
                </div>
            )}

            <div className="text-gray-700">
              <h3 className="mb-2 text-xl font-semibold">Description</h3>
              <p>{report.description}</p>
            </div>

            <div className="flex justify-end mt-8 space-x-4">
              <Link to={`/edit/${report._id}`} className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
                Edit
              </Link>
              <button onClick={handleDelete} className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        )}
         <div className="mt-8">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                &larr; Back to Dashboard
            </Link>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
