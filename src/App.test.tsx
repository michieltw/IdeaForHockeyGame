import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

// Mock all the screen components to isolate App's routing logic
vi.mock('./components/LoginScreen', () => ({
  default: ({ onLogin }: { onLogin: () => void }) => (
    <div data-testid="login-screen">
      <button onClick={onLogin}>Login</button>
    </div>
  ),
}));

vi.mock('./components/MainMenuScreen', () => ({
  default: ({
    onNewGame,
    onStartScheduledGame,
    onLogout,
    onDatabase,
    onStats,
  }: {
    onNewGame: () => void;
    onStartScheduledGame: (data: any) => void;
    onLogout: () => void;
    onDatabase: () => void;
    onStats: () => void;
  }) => (
    <div data-testid="main-menu-screen">
      <button onClick={onNewGame}>New Game</button>
      <button onClick={() => onStartScheduledGame({ homeTeam: 'A', awayTeam: 'B' })}>
        Start Scheduled Game
      </button>
      <button onClick={onDatabase}>Database</button>
      <button onClick={onStats}>Stats</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}));

vi.mock('./components/SettingsScreen', () => ({
  default: ({
    onStart,
    onBack,
    scheduledGameData,
  }: {
    onStart: () => void;
    onBack: () => void;
    scheduledGameData: any;
  }) => (
    <div data-testid="settings-screen">
      {scheduledGameData ? (
        <span data-testid="scheduled-data">{scheduledGameData.homeTeam}</span>
      ) : null}
      <button onClick={onStart}>Start</button>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('./components/ScorekeeperScreen', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="scorekeeper-screen">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('./components/DatabaseScreen', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="database-screen">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('./components/StatsScreen', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="stats-screen">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

describe('App Component Navigation', () => {
  it('renders LoginScreen initially', () => {
    render(<App />);
    expect(screen.getByTestId('login-screen')).toBeInTheDocument();
  });

  it('navigates to MainMenuScreen after login', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('main-menu-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('login-screen')).not.toBeInTheDocument();
  });

  it('navigates from MainMenuScreen to SettingsScreen on New Game without data', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Settings
    await user.click(screen.getByText('New Game'));
    expect(screen.getByTestId('settings-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('scheduled-data')).not.toBeInTheDocument();
  });

  it('navigates from MainMenuScreen to SettingsScreen with scheduled game data', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Settings with Scheduled Data
    await user.click(screen.getByText('Start Scheduled Game'));
    expect(screen.getByTestId('settings-screen')).toBeInTheDocument();
    expect(screen.getByTestId('scheduled-data')).toHaveTextContent('A');
  });

  it('navigates from MainMenuScreen to DatabaseScreen and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Database
    await user.click(screen.getByText('Database'));
    expect(screen.getByTestId('database-screen')).toBeInTheDocument();

    // Go Back
    await user.click(screen.getByText('Back'));
    expect(screen.getByTestId('main-menu-screen')).toBeInTheDocument();
  });

  it('navigates from MainMenuScreen to StatsScreen and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Stats
    await user.click(screen.getByText('Stats'));
    expect(screen.getByTestId('stats-screen')).toBeInTheDocument();

    // Go Back
    await user.click(screen.getByText('Back'));
    expect(screen.getByTestId('main-menu-screen')).toBeInTheDocument();
  });

  it('navigates from MainMenuScreen back to LoginScreen on Logout', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Logout
    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('login-screen')).toBeInTheDocument();
  });

  it('navigates from SettingsScreen to ScorekeeperScreen and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Settings
    await user.click(screen.getByText('New Game'));

    // Go to Scorekeeper
    await user.click(screen.getByText('Start'));
    expect(screen.getByTestId('scorekeeper-screen')).toBeInTheDocument();

    // Go Back to Settings
    await user.click(screen.getByText('Back'));
    expect(screen.getByTestId('settings-screen')).toBeInTheDocument();
  });

  it('navigates from SettingsScreen back to MainMenuScreen', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to Main Menu
    await user.click(screen.getByText('Login'));

    // Go to Settings
    await user.click(screen.getByText('New Game'));

    // Go Back to Main Menu
    await user.click(screen.getByText('Back'));
    expect(screen.getByTestId('main-menu-screen')).toBeInTheDocument();
  });
});
