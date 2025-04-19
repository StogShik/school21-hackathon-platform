import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { adminService } from '../../services/api';

function AdminNewCase() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      // Append each file to form data
      files.forEach(file => {
        formData.append('files', file);
      });

      await adminService.createCase(formData);
      alert('Кейс успешно создан');
      navigate('/admin/cases');
    } catch (err) {
      console.error('Ошибка при создании кейса', err);
      setError('Ошибка при создании кейса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Создать кейс" error={error} />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название кейса</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание кейса</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="files">Прикрепить файлы (до 5 файлов)</label>
            <input
              type="file"
              id="files"
              name="files"
              className="form-control-file"
              onChange={handleFileChange}
              multiple
              max="5"
            />
            <small className="form-text text-muted">
              Можно загрузить до 5 файлов. Максимальный размер файла: 10MB.
            </small>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать кейс'}
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminNewCase;
