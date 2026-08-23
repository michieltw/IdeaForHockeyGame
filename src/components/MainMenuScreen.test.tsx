import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainMenuScreen from './MainMenuScreen';

describe('MainMenuScreen', () => {
  const mockProps = {
    onNewGame: vi.fn(),
    onStartScheduledGame: vi.fn(),
    onLogout: vi.fn(),
    onDatabase: vi.fn(),
    onStats: vi.fn(),
    onCalendar: vi.fn(),
    onLineupBuilder: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(<MainMenuScreen {...mockProps} />);

    // Check main buttons are present
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
    const databaseButton = screen.getByText('DATABASE');
    fireEvent.click(databaseButton);
    expect(mockProps.onDatabase).toHaveBeenCalledTimes(1);
  });

  it('calls onStats when STATS button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);
    const statsButton = screen.getByText('STATS');
    fireEvent.click(statsButton);
    expect(mockProps.onStats).toHaveBeenCalledTimes(1);
  });

  it('renders scheduled games from localStorage', async () => {
    const games = [{
      id: '1', homeTeam: 'Team A', awayTeam: 'Team B',
      date: '2023-10-27', time: '20:00', location: 'Rink 1',
      competition: 'Friendly', matchType: 'Exhibition'
    }];
    localStorage.setItem('blackout_scheduled_games', JSON.stringify(games));

    render(<MainMenuScreen {...mockProps} />);

    // Using findByText because state updates in useEffect
    expect(await screen.findByText('Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('2023-10-27 • 20:00 • Rink 1')).toBeInTheDocument();
  });

  it('calls onStartScheduledGame when a scheduled game is clicked', async () => {
    const games = [{
      id: '1', homeTeam: 'Team A', awayTeam: 'Team B',
      date: '2023-10-27', time: '20:00', location: 'Rink 1',
      competition: 'Friendly', matchType: 'Exhibition'
    }];
    localStorage.setItem('blackout_scheduled_games', JSON.stringify(games));

    render(<MainMenuScreen {...mockProps} />);

    const gameButton = await screen.findByText('Team A vs Team B');
    fireEvent.click(gameButton);

    expect(mockProps.onStartScheduledGame).toHaveBeenCalledTimes(1);
    expect(mockProps.onStartScheduledGame).toHaveBeenCalledWith(games[0]);
  });

  it('calls onLogout when user icon is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('hides video overlay when skip button is clicked', () => {
    render(<MainMenuScreen {...mockProps} />);
    const skipButton = screen.getByText('SKIP');
    expect(skipButton).toBeInTheDocument();

    fireEvent.click(skipButton);

    // Skip button should disappear after clicking
    expect(screen.queryByText('SKIP')).not.toBeInTheDocument();
  });
});
