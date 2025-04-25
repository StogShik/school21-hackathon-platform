import React, { useEffect, useState } from 'react';
import { casesService } from '../services/api';

function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await casesService.getCases();
        console.log('Cases response:', response.data); // Debug log
        setCases(response.data.cases || []);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Ошибка при получении кейсов: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleFileClick = (e, filename, originalName) => {
    e.preventDefault();
    
    const fileUrl = `/api/cases/files/${filename}`;
    console.log(`Opening file: ${fileUrl} (${originalName})`);
    
    window.open(fileUrl, '_blank');
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Список кейсов</h1>
      <div className="row">
        {cases.length > 0 ? (
          cases.map(caseItem => (
            <div className="col-md-4" key={caseItem._id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{caseItem.title}</h5>
                  <p className="card-text">{caseItem.description}</p>
                  
                  {/* Display files with improved error handling */}
                  {caseItem.files && caseItem.files.length > 0 && (
                    <div className="mt-3">
                      <h6>Прикрепленные файлы:</h6>
                      <ul className="list-unstyled">
                        {caseItem.files.map((file, index) => (
                          <li key={index} className="mb-1">
                            <a 
                              href={`/api/cases/files/${file.filename}`}
                              onClick={(e) => handleFileClick(e, file.filename, file.originalname)}
                              className="text-primary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-solid fa-download me-1"></i> {file.originalname || 'Файл'}
                            </a>
                            <small className="text-muted ms-2">
                              ({Math.round((file.size || 0) / 1024)} KB)
                            </small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="card-text">
                    <small className="text-muted">
                      Создан: {new Date(caseItem.createdAt).toLocaleDateString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>Нет доступных кейсов</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cases;
