import className from 'classnames';

function Header({ size, children }) {
  const sizeClasses = {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-1xl',
  };

  const classes = className(sizeClasses[size], 'mt-3 font-extrabold tracking-tight text-slate-900');

  return (
    <div>
      <h1 className={classes}>{children}</h1>
    </div>
  );
}

export default Header;
