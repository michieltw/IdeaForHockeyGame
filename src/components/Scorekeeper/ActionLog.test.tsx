import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ActionLog from './ActionLog';
import { GameEvent } from '../../types';

describe('ActionLog Component', () => {
  const mockOnUndo = vi.fn();

  const defaultProps = {
    events: [],
    filter: 'all',
    onUndo: mockOnUndo,
    homeTeam: 'Home',
    awayTeam: 'Away',
    homeColor: '#ff0000',
    awayColor: '#0000ff',
  };

  const sampleEvents: GameEvent[] = [
    {
      id: '1',
      type: 'goal',
      team: 'Home',
      time: '12:34',
      text: 'Goal by Home',
      isHistorical: false,
      isUndone: false,
    },
    {
      id: '2',
      type: 'shot',
      team: 'Away',
      time: '10:00',
      text: 'Shot by Away',
      isHistorical: false,
      isUndone: true,
      x: 10,
      y: 20,
    },
    {
      id: '3',
      type: 'penalty',
      team: 'Home',
      time: '05:00',
      text: 'Penalty Home',
      isHistorical: true,
      isUndone: false,
    },
  ];

  it('renders without crashing with empty events', () => {
    const { container } = render(<ActionLog {...defaultProps} />);
    // The <section> wrapper is rendered even with empty events
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders events correctly', () => {
    const { container } = render(<ActionLog {...defaultProps} events={sampleEvents} />);

    // Check texts
    expect(screen.getByText('Goal by Home')).toBeInTheDocument();
    expect(screen.getByText('Shot by Away')).toBeInTheDocument();
    expect(screen.getByText('Penalty Home')).toBeInTheDocument();

    // Check time
    expect(screen.getByText('12:34')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();

    // Check coordinates
    expect(screen.getByText('(X: 10 Y: 20)')).toBeInTheDocument();
  });

  it('filters events correctly based on filter prop', () => {
    render(<ActionLog {...defaultProps} events={sampleEvents} filter="goal" />);

    expect(screen.getByText('Goal by Home')).toBeInTheDocument();
    expect(screen.queryByText('Shot by Away')).not.toBeInTheDocument();
    expect(screen.queryByText('Penalty Home')).not.toBeInTheDocument();
  });

  it('renders custom labels correctly', () => {
    const customLabels = {
      title: 'CUSTOM LOG TITLE',
      undoButton: 'REVERT',
      redoButton: 'APPLY AGAIN',
    };

    render(
      <ActionLog
        {...defaultProps}
        events={sampleEvents}
        labels={customLabels}
      />
    );

    expect(screen.getByText('CUSTOM LOG TITLE')).toBeInTheDocument();
    // Event 1 is not undone, so it should have UNDO label
    expect(screen.getByText('REVERT')).toBeInTheDocument();
    // Event 2 is undone, so it should have REDO label
    expect(screen.getByText('APPLY AGAIN')).toBeInTheDocument();
  });

  it('calls onUndo with the correct id when undo button is clicked', async () => {
    const user = userEvent.setup();
    render(<ActionLog {...defaultProps} events={sampleEvents} />);

    // The first event is not undone, and not historical. It has "UNDO" by default.
    const undoButton = screen.getByText('UNDO');
    await user.click(undoButton);
    expect(mockOnUndo).toHaveBeenCalledWith('1');
  });

  it('does not render undo/redo button for historical events', () => {
    render(<ActionLog {...defaultProps} events={sampleEvents} />);

    // Event 3 is historical.
    // We expect 1 UNDO (from event 1) and 1 REDO (from event 2).
    // No button should be present for event 3.
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // Only for event 1 and event 2
  });

  it('renders undone items with specific styles', () => {
      render(<ActionLog {...defaultProps} events={sampleEvents} />);

      const undoneText = screen.getByText('Shot by Away');
      expect(undoneText.className).toContain('line-through');
  });
});
