// Simple test component to verify React is working
export default function TestApp() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>🟢 React is Working!</h1>
      <p>If you can see this, React rendering is functioning correctly.</p>
      <p>The white screen issue is likely related to routing or authentication.</p>
    </div>
  );
}
