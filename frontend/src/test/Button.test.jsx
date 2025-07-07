import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders button text correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('shows spinner when loading prop is true', () => {
    render(<Button loading={true}>Test</Button>);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('shows spinner when isLoading prop is true', () => {
    render(<Button isLoading={true}>Test</Button>);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading={true}>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when isLoading', () => {
    render(<Button isLoading={true}>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles onClick correctly when not loading', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    const button = screen.getByRole('button');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not pass isLoading prop to DOM element', () => {
    render(<Button isLoading={true}>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('isLoading');
    expect(button).not.toHaveAttribute('isloading');
  });
});
