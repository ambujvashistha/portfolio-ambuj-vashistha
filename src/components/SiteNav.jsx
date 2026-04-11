export default function SiteNav({ items }) {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="#top">
        Ambuj Vashistha
      </a>

      <nav className="nav-links" aria-label="Primary">
        {items.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>

      <a className="profile-chip" href="#contact">
        Dev Profile
      </a>
    </header>
  )
}
