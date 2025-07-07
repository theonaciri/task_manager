import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks, deleteTask, clearError, updateFilters, clearFilters } from '../store/slices/tasksSlice';
import { fetchProjects } from '../store/slices/projectsSlice';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import './TasksList.css';

const TasksList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, pagination, filters } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(updateFilters({ search: searchTerm }));
        setCurrentPage(1);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, dispatch]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: 10,
      ...filters
    };
    dispatch(fetchTasks(params));
  }, [dispatch, currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    dispatch(updateFilters(newFilters));
    setCurrentPage(1); // Reset à la première page lors du changement de filtre
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  const handleDeleteTask = (task) => {
    setDeleteModal({ isOpen: true, task });
  };

  const confirmDelete = async () => {
    if (deleteModal.task) {
      await dispatch(deleteTask(deleteModal.task.id));
      setDeleteModal({ isOpen: false, task: null });
      // Rechargement de la liste en gardant la page courante
      const params = {
        page: currentPage,
        per_page: 10,
        ...filters
      };
      dispatch(fetchTasks(params));
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, task: null });
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'task-status--completed';
      case 'in_progress':
        return 'task-status--in-progress';
      case 'pending':
      default:
        return 'task-status--pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in_progress':
        return 'En cours';
      case 'pending':
      default:
        return 'En attente';
    }
  };

  if (loading && tasks.length === 0) {
    return <Loading text="Chargement des tâches..." />;
  }

  return (
    <div className="tasks-list">
      <div className="tasks-list__header">
        <h1>Mes Tâches</h1>
        <Link to="/tasks/new">
          <Button variant="primary">
            + Nouvelle Tâche
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="tasks-filters">
        <div className="tasks-filters__row">
          <input
            id="tasks-search"
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="tasks-filters__search"
          />
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="tasks-filters__select"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminées</option>
          </select>

          <select
            value={filters.project_id}
            onChange={(e) => handleFilterChange({ project_id: e.target.value })}
            className="tasks-filters__select"
          >
            <option value="">Tous les projets</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {(filters.status || filters.project_id || searchTerm) && (
            <Button
              variant="secondary"
              size="small"
              onClick={handleClearFilters}
            >
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>

      {error && (
        <ErrorMessage 
          error={error} 
          onClose={handleCloseError}
        />
      )}

      {tasks.length === 0 && !loading ? (
        <div className="tasks-list__empty">
          <h3>Aucune tâche trouvée</h3>
          <p>Commencez par créer votre première tâche !</p>
          <Link to="/tasks/new">
            <Button variant="primary">
              Créer une tâche
            </Button>
          </Link>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card__header">
                <h3 className="task-card__title">{task.title}</h3>
                <span className={`task-status ${getStatusBadgeClass(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
              
              <div className="task-card__meta">
                <p className="task-card__project">
                  Projet: <strong>{task.project?.name || 'N/A'}</strong>
                </p>
                <p className="task-card__date">
                  Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="task-card__actions">
                <Link to={`/tasks/${task.id}/edit`}>
                  <Button variant="primary" size="small">
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

      {tasks.length > 0 && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={pagination.per_page}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {loading && tasks.length > 0 && (
        <div className="tasks-list__loading">
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
          Êtes-vous sûr de vouloir supprimer la tâche <strong>"{deleteModal.task?.title}"</strong> ?
        </p>
        <p className="text-danger">
          Cette action est irréversible.
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

export default TasksList;
