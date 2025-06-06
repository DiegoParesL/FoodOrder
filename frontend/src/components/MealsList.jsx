import { useEffect, useState,useRef } from 'react';

function MealsList({ onClickMenu, cart, setCart, pedidoEnviado, setPedidoEnviado, user }) {
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
    fetch('/api/meals/meal',{
      credentials:'include'
    })
      .then(response => response.json())
      .then(data => setMeals(data))
  }, []);
  
	function sendToPedidos(){
	
	}
	function addAlCarrito(meal){
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

  async function handleEnviarPedido() {
    if (!user) {
      alert("Debes iniciar sesión para enviar un pedido.");
      return;
    }
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // Obtener token CSRF
    const csrfRes = await fetch("/api/auth/csrf/", {
      credentials: "include",
    });
    const csrfData = await csrfRes.json();

    // Preparar pedido
    const pedidoFinal = {
      items: cart.map(item => ({
      meal_id: item.meal.id,
      quantity: item.quantity
    }))
};


    // Enviar a la API
    fetch("/api/orders/order/", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfData.csrfToken,
      },
      body: JSON.stringify(pedidoFinal), 
    })
      .then(response => {
        if (response.ok) {
          setPedidoEnviado(true);
            setTimeout(() => {
              onClickMenu("pedidos");
            }, 1000);
	  
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
  
  return (
    <div className='base'>
      <div className='meals'>
        <button onClick={() => onClickMenu("home")}>Volver al inicio</button>

        <h2>FoodOrder</h2>
        <ul className='meals-grid'>
          {meals.map(meal => (
            <li key={meal.id}>
              <div className='plate' onClick={() => addAlCarrito(meal)} role='button' tabIndex={0} onKeyDown={(e) => {if (e.key === 'Enter') addAlCarrito(meal);}}>
                <button onClick={(e) => {e.stopPropagation(); addAlCarrito(meal)}} >
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
	      <div className="ticket">
	        <div>
	          <button onClick={() => reducirCantidad(item.meal.id)}>–</button>
	          <span>{item.quantity} x {item.meal.name}</span>
	        </div>
	        <span>{(item.meal.price * item.quantity).toFixed(2)} €</span>
	      </div>
	    </li>
	  ))}
        </ul>
        <div className='send'>
          <p><strong>Total:</strong> {cart.reduce((acc, item) => acc + item.quantity * item.meal.price, 0).toFixed(2)} €</p>
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

