import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject, clearError } from '../store/slices/projectsSlice';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import './ProjectsList.css';

const ProjectsList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDeleteProject = (project) => {
    setDeleteModal({ isOpen: true, project });
  };

  const confirmDelete = async () => {
    if (deleteModal.project) {
      await dispatch(deleteProject(deleteModal.project.id));
      setDeleteModal({ isOpen: false, project: null });
      // Rechargement de la liste
      dispatch(fetchProjects());
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, project: null });
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  if (loading && projects.length === 0) {
    return <Loading text="Chargement des projets..." />;
  }

  return (
    <div className="projects-list">
      <div className="projects-list__header">
        <h1>Mes Projets</h1>
        <Link to="/projects/new">
          <Button variant="primary">
            + Nouveau Projet
          </Button>
        </Link>
      </div>

      {error && (
        <ErrorMessage 
          error={error} 
          onClose={handleCloseError}
        />
      )}

      {projects.length === 0 && !loading ? (
        <div className="projects-list__empty">
          <h3>Aucun projet trouvé</h3>
          <p>Commencez par créer votre premier projet !</p>
          <Link to="/projects/new">
            <Button variant="primary">
              Créer un projet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card__header">
                <h3 className="project-card__title">{project.name}</h3>
                <div className="project-card__badge">
                  {project.tasks_count || 0} tâche{(project.tasks_count || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="project-card__meta">
                <p className="project-card__date">
                  Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="project-card__actions">
                <Link to={`/projects/${project.id}`}>
                  <Button variant="primary" size="small">
                    Voir détails
                  </Button>
                </Link>
                <Link to={`/projects/${project.id}/edit`}>
                  <Button variant="secondary" size="small">
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => handleDeleteProject(project)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && projects.length > 0 && (
        <div className="projects-list__loading">
          <Loading text="Mise à jour..." inline />
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Confirmer la suppression"
        size="small"
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le projet <strong>"{deleteModal.project?.name}"</strong> ?
        </p>
        <p className="text-danger">
          Cette action est irréversible et supprimera également toutes les tâches associées.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsList;
