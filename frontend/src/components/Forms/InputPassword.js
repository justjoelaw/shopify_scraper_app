function InputText({ ...rest }) {
  return (
    <input
      {...rest}
      type='password'
      placeholder='******************'
      autoComplete='on'
      className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
    />
  );
}

export default InputText;
