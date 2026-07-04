import { useState } from 'react'

function Registration() {
  const [count, setCount] = useState(0)

  return (
    <div className="Registration">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
    
  )
}

export default Registration