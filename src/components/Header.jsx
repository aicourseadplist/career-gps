function Header({ onLogoClick }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <button className="logo" onClick={onLogoClick}>
            Career GPS
          </button>
          <span className="text-small text-muted">
            clarity before action
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
