import Header from './components/Header.js'
import Footer from './components/Footer.js'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        <h1>Hello React 🚀</h1>
        <p>이건 CRA(App.js)에서 만든 메인 영역입니다.</p>
      </main>

      <Footer />
    </div>
  )
}

export default App
