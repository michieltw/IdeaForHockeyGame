import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MainMenuScreen from './MainMenuScreen';

describe('MainMenuScreen', () => {
  const mockProps = {
    onNewGame: vi.fn(),
    onStartScheduledGame: vi.fn(),
    onLogout: vi.fn(),
    onDatabase: vi.fn(),
    onStats: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock HTMLMediaElement.prototype.play
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  });

  it('renders standard action buttons', () => {
    render(<MainMenuScreen {...mockProps} />);

    expect(screen.getByText('NEW GAME')).toBeInTheDocument();
    expect(screen.getByText('DATABASE')).toBeInTheDocument();
    expect(screen.getByText('STATS')).toBeInTheDocument();
    expect(screen.getByText('Import Games')).toBeInTheDocument();
    expect(screen.getByText('Export Games')).toBeInTheDocument();
  });

  it('calls onNewGame when NEW GAME button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);

    const newGameButton = screen.getByText('NEW GAME');
    fireEvent.click(newGameButton);

    expect(mockProps.onNewGame).toHaveBeenCalledTimes(1);
  });

  it('calls onDatabase when DATABASE button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);

    const dbButton = screen.getByText('DATABASE');
    fireEvent.click(dbButton);

    expect(mockProps.onDatabase).toHaveBeenCalledTimes(1);
  });

  it('calls onStats when STATS button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);

    const statsButton = screen.getByText('STATS');
    fireEvent.click(statsButton);

    expect(mockProps.onStats).toHaveBeenCalledTimes(1);
  });

  it('renders scheduled games from localStorage', async () => {
    const scheduledGames = [
      {
        id: '1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        date: '2023-10-27',
        time: '19:00',
        location: 'Arena 1'
      }
    ];
    localStorage.setItem('blackout_scheduled_games', JSON.stringify(scheduledGames));

    render(<MainMenuScreen {...mockProps} />);

    // Wait for the useEffect to fetch games
    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
    });

    expect(screen.getByText('2023-10-27 • 19:00 • Arena 1')).toBeInTheDocument();
  });

  it('calls onStartScheduledGame when a scheduled game is clicked', async () => {
    const scheduledGames = [
      {
        id: '1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        date: '2023-10-27',
        time: '19:00',
        location: 'Arena 1'
      }
    ];
    localStorage.setItem('blackout_scheduled_games', JSON.stringify(scheduledGames));

    render(<MainMenuScreen {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
    });

    const gameButton = screen.getByText('Team A vs Team B').closest('button');
    expect(gameButton).not.toBeNull();
    fireEvent.click(gameButton!);

    expect(mockProps.onStartScheduledGame).toHaveBeenCalledTimes(1);
    expect(mockProps.onStartScheduledGame).toHaveBeenCalledWith(scheduledGames[0]);
  });

  it('renders and dismisses the intro video overlay when SKIP is clicked', async () => {
    render(<MainMenuScreen {...mockProps} />);

    const skipButton = screen.getByText('SKIP');
    expect(skipButton).toBeInTheDocument();

    fireEvent.click(skipButton);

    // The skip button should be removed from the document as videoPlaying becomes false
    await waitFor(() => {
        expect(screen.queryByText('SKIP')).not.toBeInTheDocument();
    });
  });

  it('calls onLogout when the logout button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);

    // The logout button doesn't have explicit text, but has a title
    const logoutButton = screen.getByTitle('Logout / Switch User');
    fireEvent.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });
});
