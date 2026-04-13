export default function PostCard(props) {
  return (
    <div className="shadow-xl rounded-2xl" key={props._id}>
      <h1 className="font-bold p-2">{props.title}</h1>
      <hr />
      <p className="p-2">{props.description}</p>
      <hr />
      <div>
        <div className="p-2 flex justify-between items-center">
          <p>{props.likesCount}</p>
          <p>{props.commentsCount}</p>
        </div>
      </div>
    </div>
  );
}
