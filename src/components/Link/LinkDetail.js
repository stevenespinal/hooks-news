import React, {useEffect, useContext, useState} from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

function LinkDetail(props) {
  const {firebase, currentUser} = useContext(FirebaseContext);
  const [link, setLink] = useState(null);
  const linkId = props.match.params.linkId;
  const linkRef = firebase.db.collection("links").doc(linkId);

  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    getLink();
  }, [])

  const getLink = () => {
    linkRef.get().then(doc => {
      setLink({...doc.data(), id: doc.id});
    });
  }

  const handleAddComment = async () => {
    if (!currentUser) {
      props.history.push("/login")
    } else {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const comment = {
            postedBy: {id: currentUser.uid, name: currentUser.displayName},
            created: Date.now(),
            text: commentText
          }
          const updatedComment = [...previousComments, comment];
          linkRef.update({comments: updatedComment});
          setLink(prevState => ({...prevState, comments: updatedComment}));
          setCommentText("");
        }
      })
    }
  }

  return !link ? (
    <div>Loading . . .</div>
  ) : (
    <div>
      <LinkItem link={link} showCount={false}/>
      <textarea onChange={e => setCommentText(e.target.value)} value={commentText} name="" id="" cols="60" rows="6"/>
      <div className="button" onClick={handleAddComment}>Add Comment</div>
      {link.comments.map((comment, index) => (
        <div key={index}>
          <p className="comment-author">{comment.postedBy.name} | {distanceInWordsToNow(comment.created)} ago</p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  )
}

export default LinkDetail;
