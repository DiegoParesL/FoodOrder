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
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=0.6, user-scalable=yes"></meta>
      {display === "home" && <Home onClickMenu={handleClickMenu} />}
      {display === "meals" && <MealsList onClickMenu={handleClickMenu} cart={cart} setCart={setCart} pedidoEnviado={pedidoEnviado} setPedidoEnviado={setPedidoEnviado} />}

      {pedidoEnviado && (
        <div className='mensaje-exito'>
          Pedido enviado correctamente.
        </div>
      )}
    </>
  )
  
}

export default App
