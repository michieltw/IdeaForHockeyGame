import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionLog from './ActionLog';
import { GameEvent } from '../../types';

describe('ActionLog Component', () => {
  const mockOnUndo = vi.fn();

  const mockEvents: GameEvent[] = [
    {
      id: 'event-1',
      type: 'shot',
      team: 'Home Team',
      time: '19:45',
      text: 'Shot on Goal',
      isUndone: false,
      isHistorical: false,
    },
    {
      id: 'event-2',
      type: 'goal',
      team: 'Away Team',
      time: '18:30',
      text: 'Goal scored',
      isUndone: true,
      isHistorical: false,
      x: 100,
      y: 200,
    },
    {
      id: 'event-3',
      type: 'penalty',
      team: 'Home Team',
      time: '15:00',
      text: 'Tripping - 2 min',
      isUndone: false,
      isHistorical: true,
    }
  ];

  const defaultProps = {
    events: mockEvents,
    filter: 'all',
    onUndo: mockOnUndo,
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    homeColor: '#ff0000',
    awayColor: '#0000ff',
    labels: {
      title: 'ACTION LOG',
      undoButton: 'UNDO',
      redoButton: 'REDO',
    }
  };

  it('renders successfully with all events', () => {
    render(<ActionLog {...defaultProps} />);

    expect(screen.getByText('ACTION LOG')).toBeInTheDocument();
    expect(screen.getByText('Shot on Goal')).toBeInTheDocument();
    expect(screen.getByText('Goal scored')).toBeInTheDocument();
    expect(screen.getByText('Tripping - 2 min')).toBeInTheDocument();
  });

  it('filters events based on filter prop', () => {
    render(<ActionLog {...defaultProps} filter="goal" />);

    expect(screen.getByText('Goal scored')).toBeInTheDocument();
    expect(screen.queryByText('Shot on Goal')).not.toBeInTheDocument();
    expect(screen.queryByText('Tripping - 2 min')).not.toBeInTheDocument();
  });

  it('triggers onUndo when undo button is clicked', () => {
    render(<ActionLog {...defaultProps} />);

    const undoButtons = screen.getAllByText('UNDO');
    expect(undoButtons.length).toBeGreaterThan(0);

    fireEvent.click(undoButtons[0]);
    expect(mockOnUndo).toHaveBeenCalledWith('event-1');
  });

  it('displays REDO for undone events', () => {
    render(<ActionLog {...defaultProps} />);

    const redoButton = screen.getByText('REDO');
    expect(redoButton).toBeInTheDocument();

    fireEvent.click(redoButton);
    expect(mockOnUndo).toHaveBeenCalledWith('event-2');
  });

  it('does not show undo button for historical events', () => {
    render(<ActionLog {...defaultProps} />);

    // Using string matching as text might be split or nested inside the DOM element containing the text
    const historicalEventText = screen.getByText('Tripping - 2 min');
    const row = historicalEventText.closest('.action-log-row');

    // Event 3 is historical, should not have an undo or redo button in its row
    expect(row).toBeInTheDocument();
    if (row) {
      expect(row.querySelector('button')).not.toBeInTheDocument();
    }
  });

  it('displays X and Y coordinates when provided', () => {
    render(<ActionLog {...defaultProps} />);

    expect(screen.getByText(/\(X: 100 Y: 200\)/)).toBeInTheDocument();
  });
});
