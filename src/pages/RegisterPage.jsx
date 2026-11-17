// src/pages/RegisterPage.jsx
import { RegisterForm } from '../components/organisms/RegisterForm';

export const RegisterPage = ({ onRegisterSuccess }) => {
  return (
    <div className="container my-5">
      <RegisterForm onSuccess={onRegisterSuccess} />
    </div>
  );
};