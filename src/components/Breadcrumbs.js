import { Link, useLocation } from 'react-router-dom';

function formatSegment(segment) {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
}

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav style={{ margin: '16px 0'}}>
      <Link to="/" style={{textDecoration:'underline'}}>Home</Link>
      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = formatSegment(segment);

        return (
          <span key={to}>
            {' > '}
            <Link to={to} style={{textDecoration:'underline'}}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
