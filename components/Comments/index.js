export default function Comments({ reviews }) {
  return (
    <>
      {data?.reviews.length > 0 && (
        <>
          <h3>Comments</h3>
          <ul>
            {data.reviews.map((review) => {
              <li key={review._id}>
                <p>
                  {review.rating}/5: {review.text}
                </p>
              </li>;
            })}
          </ul>
        </>
      )}
    </>
  );
}
