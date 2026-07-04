import { useState } from 'react'

function Booking() {
  const [count, setCount] = useState(0)

  return (
    <div className="Booking">   
    <h1>Count: {count}</h1>

        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
    
  )
}

export default Booking