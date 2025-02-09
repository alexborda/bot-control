import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import "./style.css";

const API_URL = "https://tradingbot.up.railway.app";

const App = () => {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [qty, setQty] = useState(0.01);
  const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [botStatus, setBotStatus] = useState(false);

  // WebSocket para datos en vivo
  useEffect(() => {
    const ws = new WebSocket("wss://tradingbot.up.railway.app/ws/market");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketData(data);
    };
    return () => ws.close();
  }, []);

  // WebSocket para órdenes en vivo
  useEffect(() => {
    const ws = new WebSocket("wss://tradingbot.up.railway.app/ws/orders");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrders((prevOrders) => [...prevOrders, data]);
    };
    return () => ws.close();
  }, []);

  // Obtener estado del bot
  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => res.json())
      .then((data) => setBotStatus(data.status));
  }, []);

  const sendOrder = async (side) => {
    const order = {
      secret: "supersecreto123",
      order_type: side,
      symbol,
      qty,
      price,
    };
    const response = await fetch(`${API_URL}/trade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const result = await response.json();
    setOrders([...orders, result]);
  };

  return (
    <div class="container mx-auto p-5">
      <h1 class="text-3xl font-bold text-center">Trading Bot UI</h1>
      <p class="text-center text-gray-600">Estado del bot: {botStatus ? "Activo" : "Detenido"}</p>
      
      <div class="flex flex-col md:flex-row justify-around mt-5">
        <div class="p-5 border rounded-lg shadow-lg">
          <h2 class="text-xl font-bold">Enviar Orden</h2>
          <label class="block">Símbolo:</label>
          <input class="border p-2 w-full" value={symbol} onInput={(e) => setSymbol(e.target.value)} />
          <label class="block mt-2">Cantidad:</label>
          <input class="border p-2 w-full" type="number" value={qty} onInput={(e) => setQty(e.target.value)} />
          <label class="block mt-2">Precio:</label>
          <input class="border p-2 w-full" type="number" value={price} onInput={(e) => setPrice(e.target.value)} />
          <button class="bg-green-500 text-white p-2 mt-3 w-full" onClick={() => sendOrder("buy")}>Comprar</button>
          <button class="bg-red-500 text-white p-2 mt-2 w-full" onClick={() => sendOrder("sell")}>Vender</button>
        </div>

        <div class="p-5 border rounded-lg shadow-lg">
          <h2 class="text-xl font-bold">Historial de Órdenes</h2>
          <ul>
            {orders.map((order, index) => (
              <li key={index} class="border-b p-2">{JSON.stringify(order)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div class="p-5 border rounded-lg shadow-lg mt-5">
        <h2 class="text-xl font-bold">Datos del Mercado</h2>
        <p>{marketData ? JSON.stringify(marketData) : "Cargando..."}</p>
      </div>
    </div>
  );
};

export default App;
