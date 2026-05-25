import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import './styles/global.css';
import './styles/animations.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const TestPage = lazy(() => import('./pages/TestPage'));

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--space-deep)',
      color: 'var(--text-muted)',
      fontSize: '1rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          margin: '0 auto 16px',
          border: '2px solid var(--glass-border)',
          borderTopColor: 'var(--color-ei)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        正在加载宇宙...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <HashRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </QuizProvider>
  );
}
