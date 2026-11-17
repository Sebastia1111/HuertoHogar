// src/pages/LoginPage.jsx
import { LoginForm } from '../components/organisms/LoginForm';

export const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="container my-5">
      <LoginForm onSuccess={onLoginSuccess} />
    </div>
  );
};