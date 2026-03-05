import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [seats, setSeats] = useState([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('http://localhost:3300/api/seats')
      .then(res => res.json())
      .then(data => {
        console.log('Seats:', data)
        setSeats(data)
      })
      .catch(err => console.log('Error:', err))
  }, [])

  const bookSeat = (seatNumber) => {
    fetch('http://localhost:3300/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatNumber })
    })
    .then(res => res.json())
    .then(data => {
      setToast(`${seatNumber} booked successfully!`)
      setTimeout(() => setToast(''), 3000)
      fetch('http://localhost:3300/api/seats')
        .then(res => res.json())
        .then(data => setSeats(data))
    })
    .catch(() => {
      setToast('Error booking seat')
      setTimeout(() => setToast(''), 3000)
    })
  }

  const availableCount = seats.filter(s => !s.isBooked).length
  const bookedCount = seats.filter(s => s.isBooked).length

  return (
    <div className="container">
      <h1>Seat Booking</h1>
      <div className="stats">
        <p>Available: <span className="available-count">{availableCount}</span></p>
        <p>Booked: <span className="booked-count">{bookedCount}</span></p>
      </div>
      {toast && <div className="toast">{toast}</div>}
      <div className="seats">
        {seats.map((seat) => (
          <button
            key={seat._id}
            className={seat.isBooked ? 'booked' : 'available'}
            onClick={() => bookSeat(seat.seatNumber)}
            disabled={seat.isBooked}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
