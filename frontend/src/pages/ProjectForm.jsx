import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createProject,
  updateProject,
  fetchProjectById,
  updateFormData,
  resetFormData,
  clearFormErrors,
  clearError
} from '../store/slices/projectsSlice';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './ProjectForm.css';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = Boolean(id);

  const { formData, formErrors, loading, error, currentProject } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchProjectById(id));
    } else {
      dispatch(resetFormData());
    }

    return () => {
      dispatch(clearFormErrors());
      dispatch(clearError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentProject) {
      dispatch(updateFormData({ name: currentProject.name }));
    }
  }, [dispatch, isEditing, currentProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await dispatch(updateProject({ id, projectData: formData })).unwrap();
      } else {
        await dispatch(createProject(formData)).unwrap();
      }
      navigate('/projects');
    } catch (error) {
      // L'erreur est gérée par le slice
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  if (loading && isEditing) {
    return <Loading />;
  }

  return (
    <div className="project-form">
      <div className="form-header">
        <h1>{isEditing ? 'Modifier le projet' : 'Nouveau projet'}</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nom du projet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${formErrors.name ? 'form-input-error' : ''}`}
            placeholder="Entrez le nom du projet"
            required
          />
          {formErrors.name && (
            <span className="form-error">{formErrors.name[0]}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.name.trim()}
            isLoading={loading}
          >
            {isEditing ? 'Mettre à jour' : 'Créer le projet'}
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

export default ProjectForm;
