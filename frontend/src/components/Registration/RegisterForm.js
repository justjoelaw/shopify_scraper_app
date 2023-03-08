import Form from '../Forms/Form';
import InputText from '../Forms/InputText';
import InputPassword from '../Forms/InputPassword';
import WarningMessage from '../WarningMessage';
import Button from '../Button';
import { useState, useContext } from 'react';
import UserContext from '../../context/user';

function RegisterForm() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [passwordComplexityValid, setPasswordComplexityValid] = useState(false);

  const { registerUser } = useContext(UserContext);

  const handleUsernameChange = async (e) => {
    setRegisterUsername(e.target.value);
  };

  const handleEmailChange = async (e) => {
    setRegisterEmail(e.target.value);
  };

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const handlePasswordChange = (e) => {
    setRegisterPassword(e.target.value);
    let checkComplexity = passwordRegex.test(e.target.value);
    setPasswordComplexityValid(checkComplexity);
  };

  const handlePasswordConfirmChange = async (e) => {
    setRegisterConfirmPassword(e.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(registerEmail);
  };

  const validatePasswords = () => {
    const notEmptyPassword = registerPassword !== '' && registerConfirmPassword !== '' ? true : false;
    const passwordsMatch = registerPassword === registerConfirmPassword ? true : false;

    return notEmptyPassword && passwordsMatch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      alert('Password failure. Check the passwords match and pass the minimum requirements');
    }
    if (!validateEmail()) {
      alert('Enter a valid email address');
    }
    const response = await registerUser(registerUsername, registerEmail, registerPassword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor='username'>Username:</label>
      <InputText onChange={handleUsernameChange} value={registerUsername} id='username' name='username' />
      <label htmlFor='email'>Email:</label>
      <InputText onChange={handleEmailChange} value={registerEmail} id='email' name='email' />
      <label htmlFor='password'>Password:</label>
      <WarningMessage displayBool={!passwordComplexityValid}>
        Password must contain 8 or more characters, including a number and an upper-case character
      </WarningMessage>
      <InputPassword onChange={handlePasswordChange} value={registerPassword} id='password' name='password' />
      <label htmlFor='confirm_password'>Confirm Password:</label>
      <InputPassword onChange={handlePasswordConfirmChange} value={registerConfirmPassword} id='confirm_password' name='confirm_password' />
      <Button primary rounded type='submit'>
        Submit
      </Button>
    </Form>
  );
}

export default RegisterForm;
