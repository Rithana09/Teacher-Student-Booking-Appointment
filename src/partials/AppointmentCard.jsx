export default function AppointmentCard({ student, teacher, time }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <p><strong>Student:</strong> {student}</p>
      <p><strong>Teacher:</strong> {teacher}</p>
      <p><strong>Time:</strong> {time}</p>
    </div>
  )
}
