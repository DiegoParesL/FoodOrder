function Home({ onClickMenu }) {
  return (
    <div className="home">
      <h1>Menú principal</h1>
        <button onClick={() => onClickMenu("meals")}>Meals List</button>
    </div>
  );
}

export default Home;