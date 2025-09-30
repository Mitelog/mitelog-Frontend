import '../styles/footer.css'

function Footer() {
  return (
    <footer id="footer" className="global-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <ul>
            <li><a href="/about">食べログについて</a></li>
            <li><a href="/contact">お問い合わせ</a></li>
            <li><a href="/privacy">プライバシーポリシー</a></li>
            <li><a href="/terms">利用規約</a></li>
          </ul>
        </div>

        <div className="footer-logo">
          <a href="/">
            <img src="/logo192.png" alt="食べログ" />
          </a>
        </div>

        <p className="copyright">
          © 2025 Tabelog Clone Example
        </p>
      </div>
    </footer>
  )
}

export default Footer
