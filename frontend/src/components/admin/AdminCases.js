import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { adminService } from '../../services/api';

function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await adminService.getCases();
        setCases(response.data.cases || []);
      } catch (err) {
        console.error('Ошибка при получении кейсов', err);
        setError('Ошибка при получении списка кейсов');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот кейс?')) {
      try {
        await adminService.deleteCase(caseId);
        setCases(cases.filter(item => item._id !== caseId));
        setSuccess('Кейс успешно удален');
      } catch (err) {
        console.error('Ошибка при удалении кейса', err);
        setError('Ошибка при удалении кейса');
      }
    }
  };

  if (loading) return <AdminHeader title="Кейсы" />;

  return (
    <>
      <AdminHeader title="Кейсы" success={success} error={error} />
      <div className="container">
        <div className="mb-3">
          <Link to="/admin/cases/new" className="btn btn-success">Создать новый кейс</Link>
        </div>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Файлы</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(item => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  {item.files && item.files.length > 0 ? (
                    <ul className="list-unstyled">
                      {item.files.map((file, index) => (
                        <li key={index}>
                          <a href={`/api/cases/files/${file.filename}`} download={file.originalname}>
                            {file.originalname}
                          </a>
                          <small className="text-muted ml-1">({Math.round(file.size / 1024)} KB)</small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Нет файлов'
                  )}
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteCase(item._id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminCases;
