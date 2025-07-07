import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    lastPage: 5,
    total: 50,
    perPage: 10,
    onPageChange: vi.fn(),
    loading: false
  };

  it('renders pagination info correctly', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Affichage de 1 à 10 sur 50 éléments')).toBeInTheDocument();
  });

  it('renders page buttons correctly', () => {
    render(<Pagination {...defaultProps} />);
    
    // Should show pages 1, 2, 3, 4, 5
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton.closest('button')).toHaveClass('pagination__page-btn');
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    
    const prevButton = screen.getByText('← Précédent');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const nextButton = screen.getByText('Suivant →');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when next button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByText('Suivant →'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByText('← Précédent'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination {...defaultProps} lastPage={20} currentPage={10} />);
    
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('does not render when there is only one page', () => {
    const { container } = render(<Pagination {...defaultProps} lastPage={1} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('disables all buttons when loading', () => {
    render(<Pagination {...defaultProps} loading={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('calculates pagination info correctly for middle pages', () => {
    render(<Pagination {...defaultProps} currentPage={3} perPage={10} total={50} />);
    
    expect(screen.getByText('Affichage de 21 à 30 sur 50 éléments')).toBeInTheDocument();
  });

  it('calculates pagination info correctly for last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} perPage={10} total={47} />);
    
    expect(screen.getByText('Affichage de 41 à 47 sur 47 éléments')).toBeInTheDocument();
  });
});
