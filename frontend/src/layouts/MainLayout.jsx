import Navigation from '../components/Navigation';

function MainLayout({ children }) {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main style={{ padding: '16px' }}>{children}</main>
    </div>
  );
}

export default MainLayout;
