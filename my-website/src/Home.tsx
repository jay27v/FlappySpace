import React from "react";
import FlappyHexagon from "./components/FlappyHexagon";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold">Welcome to My Website</h1>
      <p className="mt-4">This is the homepage which shows various games</p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Play Flappy Space!</h2>
        <p className="mt-2 mb-4">Press the spacebar to make the ship jump.</p>
        <div className="w-full overflow-x-auto">
          <FlappyHexagon />
        </div>
      </div>
    </div>
  );
};

export default Home;
