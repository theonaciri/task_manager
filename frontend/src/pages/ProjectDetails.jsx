import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProjectById, deleteProject, clearError } from '../store/slices/projectsSlice';
import { fetchTasks, deleteTask, updateFilters, clearFilters } from '../store/slices/tasksSlice';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProject, loading: projectLoading, error: projectError } = useSelector(state => state.projects);
  const { tasks, loading: tasksLoading, error: tasksError, filters } = useSelector(state => state.tasks);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null, type: null });

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(updateFilters({ project_id: id }));
      dispatch(fetchTasks({ project_id: id }));
    }

    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch, id]);

  const handleDeleteTask = (task) => {
    setDeleteModal({ isOpen: true, task, type: 'task' });
  };

  const handleDeleteProject = () => {
    setDeleteModal({ isOpen: true, task: null, type: 'project' });
  };

  const confirmDelete = async () => {
    if (deleteModal.type === 'task' && deleteModal.task) {
      await dispatch(deleteTask(deleteModal.task.id));
      dispatch(fetchTasks({ project_id: id }));
    } else if (deleteModal.type === 'project') {
      await dispatch(deleteProject(id));
      navigate('/projects');
    }
    setDeleteModal({ isOpen: false, task: null, type: null });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, task: null, type: null });
  };

  const handleStatusFilter = (status) => {
    const newFilters = { project_id: id };
    if (status !== 'all') {
      newFilters.status = status;
    }
    dispatch(updateFilters(newFilters));
    dispatch(fetchTasks(newFilters));
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  if (projectLoading) {
    return <Loading text="Chargement du projet..." />;
  }

  if (!currentProject) {
    return (
      <div className="project-details__not-found">
        <h2>Projet non trouvé</h2>
        <Link to="/projects">
          <Button variant="primary">Retour aux projets</Button>
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter(task => task.project_id === parseInt(id));
  const pendingTasks = projectTasks.filter(task => task.status === 'pending');
  const completedTasks = projectTasks.filter(task => task.status === 'completed');

  return (
    <div className="project-details">
      <div className="project-details__header">
        <div className="project-details__title-section">
          <Link to="/projects" className="project-details__back">
            ← Retour aux projets
          </Link>
          <h1>{currentProject.name}</h1>
          <div className="project-details__meta">
            <span className="project-details__date">
              Créé le {new Date(currentProject.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        
        <div className="project-details__actions">
          <Link to={`/projects/${id}/edit`}>
            <Button variant="secondary">
              Modifier le projet
            </Button>
          </Link>
          <Button 
            variant="danger" 
            onClick={handleDeleteProject}
          >
            Supprimer le projet
          </Button>
        </div>
      </div>

      {(projectError || tasksError) && (
        <ErrorMessage 
          error={projectError || tasksError} 
          onClose={handleCloseError}
        />
      )}

      <div className="project-details__stats">
        <div className="stat-card">
          <h3>Total</h3>
          <span className="stat-number">{projectTasks.length}</span>
        </div>
        <div className="stat-card stat-card--pending">
          <h3>En attente</h3>
          <span className="stat-number">{pendingTasks.length}</span>
        </div>
        <div className="stat-card stat-card--completed">
          <h3>Terminées</h3>
          <span className="stat-number">{completedTasks.length}</span>
        </div>
      </div>

      <div className="project-details__tasks">
        <div className="tasks-header">
          <h2>Tâches du projet</h2>
          <Link to={`/tasks/new?project_id=${id}`}>
            <Button variant="primary">
              + Nouvelle tâche
            </Button>
          </Link>
        </div>

        <div className="tasks-filters">
          <Button 
            variant={!filters.status ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('all')}
          >
            Toutes ({projectTasks.length})
          </Button>
          <Button 
            variant={filters.status === 'pending' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('pending')}
          >
            En attente ({pendingTasks.length})
          </Button>
          <Button 
            variant={filters.status === 'completed' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleStatusFilter('completed')}
          >
            Terminées ({completedTasks.length})
          </Button>
        </div>

        {tasksLoading ? (
          <Loading text="Chargement des tâches..." />
        ) : projectTasks.length === 0 ? (
          <div className="tasks-empty">
            <h3>Aucune tâche trouvée</h3>
            <p>Commencez par ajouter une tâche à ce projet !</p>
            <Link to={`/tasks/new?project_id=${id}`}>
              <Button variant="primary">
                Créer une tâche
              </Button>
            </Link>
          </div>
        ) : (
          <div className="tasks-list">
            {projectTasks.map((task) => (
              <div key={task.id} className={`task-card task-card--${task.status}`}>
                <div className="task-card__header">
                  <h3 className="task-card__title">{task.title}</h3>
                  <span className={`task-status task-status--${task.status}`}>
                    {task.status === 'pending' ? 'En attente' : 'Terminée'}
                  </span>
                </div>
                
                <div className="task-card__meta">
                  <span className="task-card__date">
                    Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="task-card__actions">
                  <Link to={`/tasks/${task.id}/edit`}>
                    <Button variant="secondary" size="small">
                      Modifier
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDeleteTask(task)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Confirmer la suppression"
        size="small"
      >
        {deleteModal.type === 'task' ? (
          <div>
            <p>
              Êtes-vous sûr de vouloir supprimer la tâche <strong>"{deleteModal.task?.title}"</strong> ?
            </p>
            <p className="text-danger">Cette action est irréversible.</p>
          </div>
        ) : (
          <div>
            <p>
              Êtes-vous sûr de vouloir supprimer le projet <strong>"{currentProject.name}"</strong> ?
            </p>
            <p className="text-danger">
              Cette action est irréversible et supprimera également toutes les tâches associées.
            </p>
          </div>
        )}
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

export default ProjectDetails;
