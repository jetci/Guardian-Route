import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RoleProvider, useRole, useHasRole, useIsMockMode, useIsDeveloper, type User } from '../context/RoleContext';

// Test component to access context
function TestComponent() {
  const { currentRole, user, isMockMode, isDeveloper, setMockRole, clearMockRole, setUser } = useRole();
  
  return (
    <div>
      <div data-testid="current-role">{currentRole || 'null'}</div>
      <div data-testid="user-name">{user?.username || 'no-user'}</div>
      <div data-testid="mock-mode">{isMockMode ? 'true' : 'false'}</div>
      <div data-testid="is-developer">{isDeveloper ? 'true' : 'false'}</div>
      <button onClick={() => setUser({ id: '1', username: 'dev', email: 'dev@test.com', role: 'DEVELOPER', fullName: 'Developer' })}>Set Developer</button>
      <button onClick={() => setMockRole('ADMIN')}>Set Mock Role</button>
      <button onClick={() => clearMockRole()}>Clear Mock</button>
    </div>
  );
}

describe('RoleContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should provide null role by default', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    expect(screen.getByTestId('current-role')).toHaveTextContent('null');
  });

  it('should not be in mock mode by default', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    expect(screen.getByTestId('mock-mode')).toHaveTextContent('false');
  });

  it('should not be developer by default', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-developer')).toHaveTextContent('false');
  });

  it('should allow setting user', async () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const button = screen.getByText('Set Developer');
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('dev');
      expect(screen.getByTestId('current-role')).toHaveTextContent('DEVELOPER');
    });
  });

  it('should persist user to localStorage', async () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const button = screen.getByText('Set Developer');
    button.click();

    await waitFor(() => {
      const stored = localStorage.getItem('user_data');
      expect(stored).toBeTruthy();
      const user = JSON.parse(stored!);
      expect(user.username).toBe('dev');
    });
  });

  it('should load user from localStorage', () => {
    const user: User = {
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      fullName: 'Admin User',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('admin');
    expect(screen.getByTestId('current-role')).toHaveTextContent('ADMIN');
  });

  it('should allow developer to set mock role', async () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const button = screen.getByText('Set Mock Role');
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('current-role')).toHaveTextContent('ADMIN');
      expect(screen.getByTestId('mock-mode')).toHaveTextContent('true');
    });
  });

  it('should persist mock role to localStorage', async () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const button = screen.getByText('Set Mock Role');
    button.click();

    await waitFor(() => {
      expect(localStorage.getItem('dev_mock_role')).toBe('ADMIN');
    });
  });

  it('should load mock role from localStorage', () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.parse(user));
    localStorage.setItem('dev_mock_role', 'SUPERVISOR');

    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    expect(screen.getByTestId('current-role')).toHaveTextContent('SUPERVISOR');
    expect(screen.getByTestId('mock-mode')).toHaveTextContent('true');
  });

  it('should clear mock role', async () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('dev_mock_role', 'ADMIN');

    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const button = screen.getByText('Clear Mock');
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('current-role')).toHaveTextContent('DEVELOPER');
      expect(screen.getByTestId('mock-mode')).toHaveTextContent('false');
      expect(localStorage.getItem('dev_mock_role')).toBeNull();
    });
  });

  it('should throw error when useRole is used outside RoleProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useRole must be used within a RoleProvider');

    console.error = originalError;
  });
});

describe('useHasRole', () => {
  function TestHasRole({ role }: { role: string | string[] }) {
    const hasRole = useHasRole(role as any);
    return <div data-testid="has-role">{hasRole ? 'true' : 'false'}</div>;
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false when no user', () => {
    render(
      <RoleProvider>
        <TestHasRole role="ADMIN" />
      </RoleProvider>
    );

    expect(screen.getByTestId('has-role')).toHaveTextContent('false');
  });

  it('should return true when role matches', () => {
    const user: User = {
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      fullName: 'Admin',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestHasRole role="ADMIN" />
      </RoleProvider>
    );

    expect(screen.getByTestId('has-role')).toHaveTextContent('true');
  });

  it('should return false when role does not match', () => {
    const user: User = {
      id: '1',
      username: 'user',
      email: 'user@test.com',
      role: 'FIELD_OFFICER',
      fullName: 'User',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestHasRole role="ADMIN" />
      </RoleProvider>
    );

    expect(screen.getByTestId('has-role')).toHaveTextContent('false');
  });

  it('should work with array of roles', () => {
    const user: User = {
      id: '1',
      username: 'supervisor',
      email: 'supervisor@test.com',
      role: 'SUPERVISOR',
      fullName: 'Supervisor',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestHasRole role={['ADMIN', 'SUPERVISOR']} />
      </RoleProvider>
    );

    expect(screen.getByTestId('has-role')).toHaveTextContent('true');
  });
});

describe('useIsMockMode', () => {
  function TestMockMode() {
    const isMockMode = useIsMockMode();
    return <div data-testid="is-mock-mode">{isMockMode ? 'true' : 'false'}</div>;
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false by default', () => {
    render(
      <RoleProvider>
        <TestMockMode />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-mock-mode')).toHaveTextContent('false');
  });

  it('should return true when mock role is set', () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('dev_mock_role', 'ADMIN');

    render(
      <RoleProvider>
        <TestMockMode />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-mock-mode')).toHaveTextContent('true');
  });
});

describe('useIsDeveloper', () => {
  function TestIsDeveloper() {
    const isDeveloper = useIsDeveloper();
    return <div data-testid="is-developer">{isDeveloper ? 'true' : 'false'}</div>;
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false by default', () => {
    render(
      <RoleProvider>
        <TestIsDeveloper />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-developer')).toHaveTextContent('false');
  });

  it('should return true when user is developer', () => {
    const user: User = {
      id: '1',
      username: 'dev',
      email: 'dev@test.com',
      role: 'DEVELOPER',
      fullName: 'Developer',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestIsDeveloper />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-developer')).toHaveTextContent('true');
  });

  it('should return false when user is not developer', () => {
    const user: User = {
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      fullName: 'Admin',
    };
    localStorage.setItem('user_data', JSON.stringify(user));

    render(
      <RoleProvider>
        <TestIsDeveloper />
      </RoleProvider>
    );

    expect(screen.getByTestId('is-developer')).toHaveTextContent('false');
  });
});
