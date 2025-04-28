import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import '../../assets/styles/pages/auth/LoginPage.scss';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    return () => {
      // Nettoyer les erreurs lors du démontage du composant
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Adresse e-mail invalide')
      .required('L\'adresse e-mail est obligatoire'),
    password: Yup.string()
      .required('Le mot de passe est obligatoire'),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <h2>Connexion</h2>
      <p className="subtitle">Connectez-vous pour accéder au système</p>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field 
                id="email" 
                name="email" 
                type="email" 
                placeholder="votre.email@exemple.com" 
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="password-field">
                <Field 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Votre mot de passe" 
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={isSubmitting || loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="login-help">
        <p>
          <a href="#">Mot de passe oublié ?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
