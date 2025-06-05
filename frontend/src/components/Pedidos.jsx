import { useEffect, useState } from 'react';

function MisPedidos({ onClickMenu, user }) {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!user) {
        setError("Debes iniciar sesión para ver tus pedidos.");
        return;
      }

      try {
        const response = await fetch("/api/mis-pedidos/", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setPedidos(data);
        } else {
          setError(data.detail || "Error al obtener los pedidos.");
        }
      } catch (err) {
        setError("Error de red al obtener los pedidos.");
        console.error(err);
      }
    };

    obtenerPedidos();
  }, [user]);

  return (
    <div className="pedidos">
      <h2>Mis pedidos</h2>
      <button onClick={() => onClickMenu("home")}>Volver al inicio</button>
      {error && <p>{error}</p>}
      {!error && pedidos.length === 0 && <p>No hay pedidos aún.</p>}
      <ul>
        {pedidos.map(order => (
          <li key={"a" + order.id}>
            <div key={"b" + order.id} className="pedido">
              <h3>Pedido #ID={order.id}</h3>
              <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
	      <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
			<div>
				<p>{item.meal_name} {item.quantity} uds.</p>
				<p>({(item.quantity*item.price).toFixed(2)}€)</p>
			</div>
                  </li>
                ))}
              </ul>
	      <p>Total: <i>{order.total.toFixed(2)}</i> €</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisPedidos;
