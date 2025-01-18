import './App.css'
import { HashRouter } from 'react-router-dom'
import RouteHandler from './routes/routeHandler'
import { useEffect, useState } from 'react'

function App() {
  const [isUserLoggin, setUserLoggin] = useState(false);

  useEffect(() => {
    const localData = localStorage.getItem("res");
    if (!localData) {
      setUserLoggin (false);
    } else {
      setUserLoggin (true);
    }
  }, []);

  return (
    <>
     <HashRouter>
        <RouteHandler />
      </HashRouter>
    </>
  )
}

export default App
