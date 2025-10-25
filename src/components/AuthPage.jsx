import React, { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  const LoginForm = () => (
    <form className="auth-form">
      <h2 className="h2">Login</h2>
      <div>
        <label htmlFor="login-email" className="form-label">Email</label>
        <input id="login-email" type="email" className="form-input" required />
      </div>
      <div>
        <label htmlFor="login-password" className="form-label">Password</label>
        <input id="login-password" type="password" className="form-input" required />
      </div>
      <div>
        <label>
          <input type="checkbox" /> Remember Me
        </label>
      </div>
      <button type="submit" className="btn-primary">Login</button>
      <p>
        <a href="#" className="text-link">Forgot Password?</a>
      </p>
      <div>
        <p>Or login with:</p>
        <button type="button">Google</button>
        <button type="button">Facebook</button>
      </div>
      <p>
        New here?{' '}
        <button type="button" onClick={toggleView} className="text-link">
          Sign up now
        </button>
      </p>
    </form>
  );

  const RegisterForm = () => (
    <form className="auth-form">
      <h2 className="h2">Register</h2>
      <div>
        <label htmlFor="register-email" className="form-label">Email (use your campus domain)</label>
        <input id="register-email" type="email" className="form-input" required />
      </div>
      <div>
        <label htmlFor="register-password" className="form-label">Password (strength meter)</label>
        <input id="register-password" type="password" className="form-input" required />
      </div>
      <div>
        <label htmlFor="register-confirm-password" className="form-label">Confirm Password</label>
        <input id="register-confirm-password" type="password" className="form-input" required />
      </div>
      <div>
        <label htmlFor="register-campus" className="form-label">Campus/Year</label>
        <input id="register-campus" type="text" className="form-input" required />
      </div>
      <div>
        <label>
          <input type="checkbox" required /> I agree to the Terms and Conditions
        </label>
      </div>
      <button type="submit" className="btn-primary">Register</button>
      <div>
        <p>Or register with:</p>
        <button type="button">Google</button>
        <button type="button">Facebook</button>
      </div>
      <p>
        Already a member?{' '}
        <button type="button" onClick={toggleView} className="text-link">
          Login here
        </button>
      </p>
    </form>
  );

  return (
    <div className="auth-page container" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
