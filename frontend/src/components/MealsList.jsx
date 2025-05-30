import { useEffect, useState } from 'react';



function MealsList({ onClickMenu, cart, setCart, setPedidoEnviado }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/meals/')
      .then(response => response.json())
      .then(data => setMeals(data))
  }, []);

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


  return (
    <div>
      <button onClick={() => onClickMenu("home")}>Volver al inicio</button>

      <h2>Comidas disponibles</h2>
      <ul>
        {meals.map(meal => (
          <li key={meal.id}>
            {meal.name} - {meal.price} €
              <button onClick={() => {
                const existing = cart.find(item => item.id === meal.id);
                if (existing) {
                  setCart(cart.map(item =>
                    item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
                  ));
                } else {
                  setCart([...cart, { ...meal, quantity: 1 }]);
                }}}>
                Añadir
              </button>
          </li>
        ))}
      </ul>

      <h3>Carrito</h3>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price} € (x{item.quantity})
          </li>
        ))}
      </ul>

      <button onClick={handleEnviarPedido}>Enviar pedido</button>
    </div>
  );
}

export default MealsList;