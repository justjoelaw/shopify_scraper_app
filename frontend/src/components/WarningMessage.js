function WarningMessage({ displayBool, children }) {
  return displayBool ? (
    <p className='text-orange-400'>{children}</p>
  ) : (
    <div>
      <br />
    </div>
  );
}

export default WarningMessage;
