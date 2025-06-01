import { useEffect, useState,useRef } from 'react';



function MealsList({ onClickMenu, cart, setCart, pedidoEnviado, setPedidoEnviado }) {
  const [meals, setMeals] = useState([]);
  useEffect(() => {
          if (pedidoEnviado) {
            const timer = setTimeout(() => {
              setPedidoEnviado(false);
            }, 4000);
            return () => clearTimeout(timer); // limpieza
          }
        }, [pedidoEnviado]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/meals/')
      .then(response => response.json())
      .then(data => setMeals(data))
  }, []);
  function añadirAlCarrito(meal) {
    setCart(prevCart => {
      const existente = prevCart.find(item => item.meal.id === meal.id);
      if (existente) {
        return prevCart.map(item =>
          item.meal.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { meal, quantity: 1 }];
      }
    });
  }
  function reducirCantidad(mealId) {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.meal.id === mealId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }
  function limpiarCarrito() {
    setCart([]);
  }

  function handleEnviarPedido() {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    const resumenPedido = {};
    cart.forEach(item => {
      if (resumenPedido[item.id]) {
        resumenPedido[item.id] += 1;
      } else {
        resumenPedido[item.id] = 1;
      }
    });
    

    const pedidoFinal = cart.map(item => ({
      meal: item.id,
      quantity: item.quantity
    }));
    fetch('http://127.0.0.1:8000/api/orders/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: pedidoFinal })
  })
    .then(response => {
      if (response.ok) {
        setPedidoEnviado(true);
        setCart([]);
      } else {
        throw new Error("Error al enviar pedido");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo enviar el pedido.");
    });
  }
  
  let total=0
  cart.forEach(item => { 
    total +=item.meal.price * item.quantity
  })
  const botonRef =useRef(null);
  const handleClickDiv = () =>{
    if(botonRef.current){
      botonRef.current.focus();
    }
  }
  
  return (
    <div className='base'>
      <div className='meals'>
        <button onClick={() => onClickMenu("home")}>Volver al inicio</button>

        <h2>FoodOrder</h2>
        <ul className='meals-grid'>
          {meals.map(meal => (
            <li key={meal.id}>
              <div className='plate' onClick={() =>añadirAlCarrito(meal)} role='button' tabIndex={0} onKeyDown={(e) => {if (e.key === 'Enter')añadirAlCarrito(meal);}}>
                <button onClick={(e) => {e.stopPropagation(); añadirAlCarrito(meal)}} >
                  <p>{meal.name} </p> 
                  <i>{meal.price} €</i>
                </button>
              </div>
              
            </li>
          ))}
        </ul>
      </div>
      <div className='cart'>
        <h3>Detalles del Pedido</h3>
        <ul> 
          {cart.map((item, index) => (
            <li key={index}>
              <div className='ticket'>
                <div>
                  <button onClick={() => reducirCantidad(item.meal.id)}>–</button>
                  <p>{item.meal.name}</p>
                </div>
                <p>{item.quantity} x {item.meal.price} €</p>
              </div>
            </li>
          ))}
        </ul>
        <div className='send'>
          <p><strong>Total:</strong> {total.toFixed(2)} €</p>
          <div>
            <button onClick={limpiarCarrito}>Vaciar carrito</button>
            <button onClick={handleEnviarPedido}>Enviar pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealsList;