export default function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test App</h1>
      <p>If you see this, React is working!</p>
      <button onClick={() => alert('Button works!')}>
        Click Me
      </button>
    </div>
  );
}
