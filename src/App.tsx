import { ChatInterface } from './components/ChatInterface';

export default function App() {
  return (
    <div
      style={{
        height: '100dvh',
        width: '100%',
        backgroundColor: '#111b21',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        <ChatInterface />
      </div>
    </div>
  );
}