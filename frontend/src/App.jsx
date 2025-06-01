import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MealsList from './components/MealsList';
import Home from './components/Home';
import "./App.css"

function App() {
  const [display, setDisplay] = useState("home");

  function handleClickMenu(pagina) {
    setDisplay(pagina);
  }

  const [cart, setCart] = useState([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  return (
    <>
      {display === "home" && <Home onClickMenu={handleClickMenu} />}
      {display === "meals" && <MealsList onClickMenu={handleClickMenu} cart={cart} setCart={setCart} setPedidoEnviado={setPedidoEnviado} />}

      {pedidoEnviado && (
        <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "1rem", marginTop: "1rem" }}>
          Pedido enviado correctamente.
        </div>
      )}
    </>
  )
  
}

export default App
