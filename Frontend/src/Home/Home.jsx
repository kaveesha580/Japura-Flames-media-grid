import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="Home">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
    
  )
}

export default Home