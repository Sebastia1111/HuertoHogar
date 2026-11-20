// src/pages/RegisterPage.jsx
import { RegisterForm } from '../components/organisms/RegisterForm';

export const RegisterPage = ({ onRegister, onRegisterSuccess }) => {
  return (
    <div className="container my-5">
      <RegisterForm onRegister={onRegister} onSuccess={onRegisterSuccess} />
    </div>
  );
};
