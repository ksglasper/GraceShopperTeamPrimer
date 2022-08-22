import React from "react";
import { createReview } from "../api";
import "./addreview.css"

const AddReview = ({ userDataObj, setIsShown, token, movieId, setMovieReviews, movieReviews }) => {
 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = userDataObj.id;
    const review = event.target.review.value;
    setIsShown(false);
    const result = await createReview(token, movieId, userId, review);
    result.name = userDataObj.name
    setMovieReviews([...movieReviews, result])
    console.log(result);

    // window.location.reload(true);
  };

  return (
    <div className="addreview">
      <form onSubmit={handleSubmit}>
        <textarea
          className="ReviewForm"
          name="review"
          placeholder="Tell the nice folks out there what you thought of the film"
        ></textarea>
        <div>
          <button type="submit">Review it!</button>
          <button
            onClick={(event) => {
              setIsShown(false);
            }}
          >
            Nevermind
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
