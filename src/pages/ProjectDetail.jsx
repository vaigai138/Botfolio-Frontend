import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { FaPlus, FaTrashAlt, FaEdit, FaSearch, FaFilter, FaFilePdf } from 'react-icons/fa';
import { Helmet } from "react-helmet-async";
//import LenisScrollWrapper from '../components/LenisScrollWrapper';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [verifyTaskName, setVerifyTaskName] = useState('');
  const [form, setForm] = useState({
    projectName: '',
    givenDate: '',
    submissionDate: '',
    approvedDate: '',
    payment: '',
    received: false,
    paymentMethod: 'Bank Transfer', // New field with a default value
    paymentReceivedDate: '', // New field
  });
  const [clientName, setClientName] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Filter states
  const [filterProjectName, setFilterProjectName] = useState('');
  const [filterReceived, setFilterReceived] = useState('all');

  // Ref for the table element to be exported
  const tableRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchTasks();
      fetchProjectName();
    } else {
      alert("Project not found or invalid URL. Redirecting to projects list.");
      navigate('/projects');
    }
  }, [id, navigate]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get(`/api/tasks/project/${id}`, { headers });

      if (Array.isArray(res.data)) {
        const fetchedTasks = res.data.map(task => ({
          ...task,
          givenDate: task.givenDate ? new Date(task.givenDate).toISOString().substring(0, 10) : '',
          submissionDate: task.submissionDate ? new Date(task.submissionDate).toISOString().substring(0, 10) : '',
          approvedDate: task.approvedDate ? new Date(task.approvedDate).toISOString().substring(0, 10) : '',
          // Format new date field
          paymentReceivedDate: task.paymentReceivedDate ? new Date(task.paymentReceivedDate).toISOString().substring(0, 10) : '',
        }));
        setTasks(fetchedTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      alert('Failed to fetch tasks.');
    }
  };

  const fetchProjectName = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get(`/api/projects/${id}`, { headers });
      setClientName(res.data.clientName);
    } catch (err) {
      setClientName('Unknown Client');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("Project ID is missing. Cannot create task. Please ensure you're on a valid project page.");
      return;
    }
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(`/api/tasks/project/${id}`, form, { headers });
      setTasks([...tasks, res.data]);
      setEditingTaskId(null);
      setForm({
        projectName: '',
        givenDate: '',
        submissionDate: '',
        approvedDate: '',
        payment: '',
        received: false,
        paymentMethod: 'Bank Transfer',
        paymentReceivedDate: '',
      });
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setForm({
      projectName: task.projectName,
      givenDate: task.givenDate,
      submissionDate: task.submissionDate,
      approvedDate: task.approvedDate,
      payment: task.payment,
      received: task.received,
      paymentMethod: task.paymentMethod, // Set the new field for editing
      paymentReceivedDate: task.paymentReceivedDate, // Set the new date field
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.put(`/api/tasks/${editingTaskId}`, form, { headers });
      setTasks(tasks.map((t) => (t._id === editingTaskId ? res.data : t)));
      setEditingTaskId(null);
      setForm({
        projectName: '',
        givenDate: '',
        submissionDate: '',
        approvedDate: '',
        payment: '',
        received: false,
        paymentMethod: 'Bank Transfer',
        paymentReceivedDate: '',
      });
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const confirmDeleteTask = async (taskId, taskProjectName) => {
    if (verifyTaskName !== taskProjectName) {
      alert('Project name mismatch. Please type the project name exactly.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`/api/tasks/${taskId}`, { headers });
      setTasks(tasks.filter((t) => t._id !== taskId));
      setDeleteConfirmation('');
      setVerifyTaskName('');
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleAddRow = () => {
    if (editingTaskId === 'new') return;

    setEditingTaskId('new');
    setForm({
      projectName: '',
      givenDate: '',
      submissionDate: '',
      approvedDate: '',
      payment: '',
      received: false,
      paymentMethod: 'Bank Transfer',
      paymentReceivedDate: '',
    });
  };

  const filteredTasks = useMemo(() => {
    let currentTasks = [...tasks];

    if (filterProjectName) {
      currentTasks = currentTasks.filter(task =>
        task.projectName.toLowerCase().includes(filterProjectName.toLowerCase())
      );
    }

    if (filterReceived !== 'all') {
      const isReceived = filterReceived === 'true';
      currentTasks = currentTasks.filter(task => task.received === isReceived);
    }

    return currentTasks;
  }, [
    tasks,
    filterProjectName,
    filterReceived,
  ]);

  const totalPayment = filteredTasks.reduce((acc, task) => acc + (task.payment || 0), 0);

  // Function to export table to PDF
  const handleExportPdf = async () => {
    if (!tableRef.current) {
      alert("Could not find table to export.");
      return;
    }

    setLoadingPdf(true); // Show loading indicator

    try {
      // Dynamically import jsPDF and html2canvas
      const { jsPDF } = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule; // Robust way to get the function

      const input = tableRef.current;
      
      // Changed scale from 4 to 2 to reduce PDF file size
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const filename = `${clientName || 'Client'}_Tasks_${dateString}.pdf`;
      pdf.save(filename);
      alert('Table exported to PDF successfully!');
    } catch (error) {
      // Console error is kept for debugging purposes only, as requested.
      console.error('Error exporting PDF:', error);
      alert('Failed to export table to PDF. Please try again.');
    } finally {
      setLoadingPdf(false); // Hide loading indicator
    }
  };


  return (
    //<LenisScrollWrapper>
    <>
    <Helmet>
  <title>Botfolio | Manage Tasks</title>
  <meta
    name="description"
    content="Stay organized with Botfolio’s task manager. Track deadlines, progress, and boost your freelance productivity."
  />
</Helmet>
    <div className="p-4 sm:p-6" style={{backgroundColor: '#ffffffff', minHeight: '100vh'}}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{color: '#1F2937'}}>Tasks for Client: {clientName || 'Loading...'}</h2>
      </div>

      {/* Filter Section */}
      <div className="p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <h3 className="text-lg font-semibold" style={{color: '#1F2937'}}>Filters:</h3>
        
        {/* New inner flex container for inputs to control alignment */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">  
          {/* Project Name Filter */}
          <div className="relative flex items-center w-full sm:w-64"> {/* Adjusted width */}
            <FaSearch className="absolute left-3" style={{color: '#9CA3AF'}} />
            <input
              type="text"
              placeholder="Search projects..."
              value={filterProjectName}
              onChange={(e) => setFilterProjectName(e.target.value)}
              className="p-2 pl-9 border rounded-sm text-sm w-full focus:outline-none"
              style={{borderColor: '#D1D5DB'}}
            />
          </div>

          {/* Payment Status Filter */}
          <div className="relative flex items-center w-full sm:w-40"> {/* Smaller width */}
            <FaFilter className="absolute left-3" style={{color: '#9CA3AF'}} />
            <select
              value={filterReceived}
              onChange={(e) => setFilterReceived(e.target.value)}
              className="p-2 pl-9 border rounded-sm text-sm w-full appearance-none focus:outline-none pr-8"
              style={{borderColor: '#D1D5DB'}}
            >
              <option value="all">All Status</option>
              <option value="true">Received</option>
              <option value="false">Not Received</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" style={{color: '#374151'}}>
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="p-4 sm:p-6 rounded-sm shadow-sm overflow-x-auto" style={{backgroundColor: '#FFFFFF'}}>
        <table ref={tableRef} className="min-w-full divide-y" style={{borderColor: '#E5E7EB'}}>
          <thead style={{backgroundColor: '#F9FAFB'}}>
            <tr>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>S.No.</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Project Name</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Given Date</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Submission Date</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Approved Date</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Payment (₹)</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Payment Method</th> {/* New header */}
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Payment Received Date</th> {/* New header */}
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Received?</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}>Actions</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB'}}>
            {/* Render existing tasks */}
            {filteredTasks.length === 0 && editingTaskId !== 'new' ? (
              <tr>
                <td colSpan="10" className="px-3 py-2 sm:px-6 sm:py-4 text-center" style={{color: '#6B7280'}}>No tasks found.</td>
              </tr>
            ) : (
              filteredTasks.map((task, index) => (
                <tr key={task._id}>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#111827'}}>{index + 1}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium" style={{color: '#111827'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="text"
                        name="projectName"
                        value={form.projectName}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                        required
                      />
                    ) : (
                      task.projectName
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="date"
                        name="givenDate"
                        value={form.givenDate}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                      />
                    ) : (
                      task.givenDate ? new Date(task.givenDate).toLocaleDateString() : 'N/A'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="date"
                        name="submissionDate"
                        value={form.submissionDate}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                      />
                    ) : (
                      task.submissionDate ? new Date(task.submissionDate).toLocaleDateString() : 'N/A'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="date"
                        name="approvedDate"
                        value={form.approvedDate}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                      />
                    ) : (
                      task.approvedDate ? new Date(task.approvedDate).toLocaleDateString() : 'N/A'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="number"
                        name="payment"
                        value={form.payment}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        placeholder="Payment"
                        style={{borderColor: '#D1D5DB'}}
                        required
                      />
                    ) : (
                      `₹${task.payment ? task.payment.toLocaleString('en-IN') : '0'}`
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      task.paymentMethod || 'N/A'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="date"
                        name="paymentReceivedDate"
                        value={form.paymentReceivedDate}
                        onChange={handleChange}
                        className="w-full p-1 border rounded-sm focus:outline-none"
                        style={{borderColor: '#D1D5DB'}}
                      />
                    ) : (
                      task.paymentReceivedDate ? new Date(task.paymentReceivedDate).toLocaleDateString() : 'N/A'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                    {editingTaskId === task._id ? (
                      <input
                        type="checkbox"
                        name="received"
                        checked={form.received}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 rounded-sm focus:outline-none"
                        style={{color: '#F4A100'}} // This specific color is a custom hex, so it should be fine.
                      />
                    ) : (
                      task.received ? 'Yes' : 'No'
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingTaskId === task._id ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleUpdateTask}
                          className="px-3 py-1 hover:opacity-90 transition text-sm"
                          style={{backgroundColor: '#F4A100', color: '#FFFFFF'}}
                          title="Save Changes"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingTaskId(null); setForm({ projectName: '', givenDate: '', submissionDate: '', approvedDate: '', payment: '', received: false, paymentMethod: 'Bank Transfer', paymentReceivedDate: '' }); }}
                          className="px-3 py-1 hover:bg-gray-300 transition text-sm"
                          style={{backgroundColor: '#E5E7EB', color: '#1F2937'}}
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2 justify-end">
                        <button onClick={() => handleEditTask(task)} style={{color: '#374151'}} title="Edit Task"><FaEdit size={18} /></button>
                        <button onClick={() => setDeleteConfirmation(task._id)} style={{color: '#4B5563'}} title="Delete Task"><FaTrashAlt size={18} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
            {/* Render new task row if editingTaskId is 'new' at the bottom */}
            {editingTaskId === 'new' && (
              <tr>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#111827'}}>New</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium" style={{color: '#111827'}}>
                  <input
                    type="text"
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    placeholder="Project Name"
                    style={{borderColor: '#D1D5DB'}}
                    required
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="date"
                    name="givenDate"
                    value={form.givenDate}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    style={{borderColor: '#D1D5DB'}}
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="date"
                    name="submissionDate"
                    value={form.submissionDate}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    style={{borderColor: '#D1D5DB'}}
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="date"
                    name="approvedDate"
                    value={form.approvedDate}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    style={{borderColor: '#D1D5DB'}}
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="number"
                    name="payment"
                    value={form.payment}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    placeholder="Payment"
                    style={{borderColor: '#D1D5DB'}}
                    required
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    style={{borderColor: '#D1D5DB'}}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="date"
                    name="paymentReceivedDate"
                    value={form.paymentReceivedDate}
                    onChange={handleChange}
                    className="w-full p-1 border rounded-sm focus:outline-none"
                    style={{borderColor: '#D1D5DB'}}
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm" style={{color: '#6B7280'}}>
                  <input
                    type="checkbox"
                    name="received"
                    checked={form.received}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 rounded-sm focus:outline-none"
                    style={{color: '#F4A100'}}
                  />
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={handleCreateTask}
                      className="px-3 py-1 hover:opacity-90 transition text-sm"
                      style={{backgroundColor: '#F4A100', color: '#FFFFFF'}}
                      title="Save New Task"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingTaskId(null); setForm({ projectName: '', givenDate: '', submissionDate: '', approvedDate: '', payment: '', received: false, paymentMethod: 'Bank Transfer', paymentReceivedDate: '' }); }}
                      className="px-3 py-1 hover:bg-gray-300 transition text-sm"
                      style={{backgroundColor: '#E5E7EB', color: '#1F2937'}}
                      title="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot style={{backgroundColor: '#F9FAFB'}}>
            <tr>
              <td colSpan="1" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}></td>
              <td className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#374151'}}>
                Task Count: {filteredTasks.length}
              </td>
              <td colSpan="4" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}></td>
              <td className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#374151'}}>
                Total Payment: ₹{totalPayment.toLocaleString('en-IN')}
              </td>
              <td colSpan="3" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#6B7280'}}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 cursor-pointer flex items-center"
          style={{backgroundColor: '#F4A100', color: '#FFFFFF'}}
        >
          <FaPlus className="mr-2" /> Add New Task
        </button>
        <button
          onClick={handleExportPdf}
          className="px-4 py-2 cursor-pointer border border-gray-400 flex items-center"
          style={{backgroundColor: '#ffffffff', color: '#000000ff'}}
          title="Export Table to PDF"
        >
          {loadingPdf ? 'Generating PDF...' : <><FaFilePdf className="mr-2" /> Export to PDF</>}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-200/70 flex justify-center items-center z-50 p-4">
          <div className="p-8 rounded-sm w-full max-w-md shadow-2xl text-center" style={{backgroundColor: '#FFFFFF'}}>
            <p className="mb-4 text-lg" style={{color: '#1F2937'}}>Are you sure you want to delete this task?</p>
            <p className="mb-3" style={{color: '#374151'}}>Type "<strong>{tasks.find(t => t._id === deleteConfirmation)?.projectName || ''}</strong>" to confirm:</p>
            <input
              type="text"
              className="border p-3 w-full mb-4 focus:outline-none"
              style={{borderColor: '#D1D5DB', color: '#1F2937'}}
              value={verifyTaskName}
              onChange={(e) => setVerifyTaskName(e.target.value)}
              placeholder="Enter project name"
            />
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => confirmDeleteTask(deleteConfirmation, tasks.find(t => t._id === deleteConfirmation)?.projectName || '')}
                className="px-4 py-2 hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                style={{backgroundColor: '#DC2626', color: '#FFFFFF'}}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmation('');
                  setVerifyTaskName('');
                }}
                className="px-4 py-2 hover:bg-gray-400 transition duration-300 ease-in-out shadow-md"
                style={{backgroundColor: '#D1D5DB', color: '#1F2937'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
    //</LenisScrollWrapper>
  );
};

export default ProjectDetail;

