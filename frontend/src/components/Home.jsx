function Home({ onClickMenu }) {
  return (
    <div>
    <h1>Menú principal</h1>
      <button onClick={() => onClickMenu("home")}>Home</button>
      <button onClick={() => onClickMenu("meals")}>Meals List</button>
    </div>
  );
}

export default Home;