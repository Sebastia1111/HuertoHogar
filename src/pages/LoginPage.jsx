// src/pages/LoginPage.jsx
import { LoginForm } from '../components/organisms/LoginForm';

export const LoginPage = ({ onLogin, onLoginSuccess }) => {
  return (
    <div className="container my-5">
      <LoginForm onLogin={onLogin} onSuccess={onLoginSuccess} />
    </div>
  );
};
