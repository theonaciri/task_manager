import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  createTask,
  updateTask,
  fetchTaskById,
  updateFormData,
  resetFormData,
  clearFormErrors,
  clearError
} from '../store/slices/tasksSlice';
import { fetchProjects } from '../store/slices/projectsSlice';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './TaskForm.css';

const TaskForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = Boolean(id);
  const projectId = searchParams.get('project_id');

  const { formData, formErrors, loading, error, currentTask } = useSelector(
    (state) => state.tasks
  );
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
    
    if (isEditing && id) {
      dispatch(fetchTaskById(id));
    } else {
      dispatch(resetFormData());
      if (projectId) {
        dispatch(updateFormData({ project_id: projectId }));
      }
    }

    return () => {
      dispatch(clearFormErrors());
      dispatch(clearError());
    };
  }, [dispatch, id, isEditing, projectId]);

  useEffect(() => {
    if (isEditing && currentTask) {
      dispatch(updateFormData({
        title: currentTask.title,
        status: currentTask.status,
        project_id: currentTask.project_id.toString()
      }));
    }
  }, [dispatch, isEditing, currentTask]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        project_id: parseInt(formData.project_id)
      };
      
      if (isEditing) {
        await dispatch(updateTask({ id, taskData })).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      
      // Rediriger vers le projet parent ou la liste des projets
      if (formData.project_id) {
        navigate(`/projects/${formData.project_id}`);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    if (formData.project_id) {
      navigate(`/projects/${formData.project_id}`);
    } else {
      navigate('/projects');
    }
  };

  if (loading && isEditing) {
    return <Loading />;
  }

  return (
    <div className="task-form">
      <div className="form-header">
        <h1>{isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Titre de la tâche *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${formErrors.title ? 'form-input-error' : ''}`}
            placeholder="Entrez le titre de la tâche"
            required
          />
          {formErrors.title && (
            <span className="form-error">{formErrors.title[0]}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="project_id" className="form-label">
            Projet *
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            className={`form-select ${formErrors.project_id ? 'form-input-error' : ''}`}
            required
          >
            <option value="">Sélectionner un projet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {formErrors.project_id && (
            <span className="form-error">{formErrors.project_id[0]}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Statut *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`form-select ${formErrors.status ? 'form-input-error' : ''}`}
            required
          >
            <option value="pending">En attente</option>
            <option value="completed">Terminée</option>
          </select>
          {formErrors.status && (
            <span className="form-error">{formErrors.status[0]}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.title.trim() || !formData.project_id}
            isLoading={loading}
          >
            {isEditing ? 'Mettre à jour' : 'Créer la tâche'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
