import Form from '../Forms/Form';
import InputText from '../Forms/InputText';
import InputPassword from '../Forms/InputPassword';
import Button from '../Button';
import { useState, useContext } from 'react';
import UserContext from '../../context/user';

function LoginForm() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const { getAccessToken } = useContext(UserContext);

  const handleUsernameChange = async (e) => {
    setLoginUsername(e.target.value);
  };

  const handlePasswordChange = async (e) => {
    setLoginPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await getAccessToken(loginUsername, loginPassword);
    console.log(response);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor='username'>Username:</label>
      <InputText onChange={handleUsernameChange} value={loginUsername} id='username' name='username' />
      <label htmlFor='password'>Password:</label>
      <InputPassword onChange={handlePasswordChange} value={loginPassword} id='password' name='password' />
      <Button primary rounded type='submit'>
        Login
      </Button>
    </Form>
  );
}

export default LoginForm;
