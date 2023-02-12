import className from 'classnames';

function AppIcon({ url, small }) {
  const classes = className('rounded-lg', {
    'w-32 h-32': small,
  });

  return <img src={url} className={classes} />;
}

export default AppIcon;
