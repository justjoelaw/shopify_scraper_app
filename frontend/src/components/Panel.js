import className from 'classnames';

function Panel({ children, ...rest }) {
  const classes = className(rest.className, 'bg-indigo-200 rounded-lg p-5 my-5');

  return (
    <div {...rest} className={classes}>
      {children}
    </div>
  );
}

export default Panel;
