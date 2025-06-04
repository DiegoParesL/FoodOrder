import { useState, useEffect} from 'react';
import MealsList from './components/MealsList';
import Home from './components/Home';
import "./App.css";
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import MisPedidos from './components/Pedidos';

function App() {
  const [display, setDisplay] = useState("home");
  
  function handleClickMenu(pagina) {
    setDisplay(pagina);
  }

  const [cart, setCart] = useState([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
          if (pedidoEnviado) {
            const timer = setTimeout(() => {
              setPedidoEnviado(false);
            }, 4000);
            return () => clearTimeout(timer); // limpieza
          }
        }, [pedidoEnviado]);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auth/yo/", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.logged_in) {
          setUser(data.username);
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        console.error("Error al obtener estado de sesión:", err);
        setUser(null);
      });
  }, []);
  const handleLogout = () => {
    setUser(""); // Borra el usuario de la sesión frontend
  };


  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=0.6, user-scalable=yes"></meta>
      {display === "home" && <Home user={user} onLogout={handleLogout} onClickMenu={handleClickMenu} />}
      {display === "meals" && <MealsList onClickMenu={handleClickMenu} user={user} cart={cart} setCart={setCart} pedidoEnviado={pedidoEnviado} setPedidoEnviado={setPedidoEnviado} />}
      {display === "login" && <LoginPage onClickMenu={handleClickMenu} setUser={setUser} />}
      {display === "register" && <RegisterPage onClickMenu={handleClickMenu} setUser={setUser} />}
      {display === "pedidos" && <MisPedidos onClickMenu={handleClickMenu} user={user} />}
      
      {pedidoEnviado && (
        <div className='mensaje-exito'>
          Pedido enviado correctamente.
        </div>
      )}
      {user && <p>Sesión iniciada como: {user}</p>}
    </>
  )
  
}

export default App
