export default function DoubtCard(props){
  return (
    <div className="shadow-xl rounded-2xl" key={props._id}>
      <h1 className="font-bold p-2">{props.title}</h1>
      <hr/>
      <p className="p-2">{props.description}</p>
      <hr/>
      <div className="flex justify-between items-center p-2">
        <button className="bg-blue-400 text-white p-2 rounded-lg">Join Doubt</button>
      </div>
    </div>
  )
}