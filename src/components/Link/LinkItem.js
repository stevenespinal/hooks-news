import React, {useContext} from "react";
import {Link, withRouter} from "react-router-dom";
import {getDomain} from "../../utils";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import FirebaseContext from "../../firebase/context";


function LinkItem({link, index, showCount, history}) {
  const {firebase, currentUser} = useContext(FirebaseContext);

  const handleVote = () => {
    if (!currentUser) {
      history.push("/login")
    } else {
      const votesRef = firebase.db.collection("links").doc(link.id);
      votesRef.get().then(async doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = {votedBy: {id: currentUser.uid, name: currentUser.displayName}};
          const updatedVotes = [...previousVotes, vote];
          const voteCount = updatedVotes.length;
          await votesRef.update({votes: updatedVotes, voteCount});
        }
      });
    }
  }

  const postedByAuthUser = currentUser && currentUser.uid === link.postedBy.id;

  const handleDeleteLink = async () => {
    const linkRef = firebase.db.collection("links").doc(link.id);
    try {
      await linkRef.delete();
      console.log(`Document with ID:  ${link.id} deleted.`);
    } catch (error) {
      console.error("Error deleting document", error);
    }
  }

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray">{index}</span>}
        <div className="vote-button" onClick={handleVote}>▲</div>
      </div>
      <div className="ml1">
        <div>
          <a className="black" href={link.url} target="_blank" rel="noopener noreferrer">{link.description} </a><span className="link">({getDomain(link.url)})</span>
        </div>
        <div className="f6 lh-copy gray">
          {link.voteCount} Votes By {link.postedBy.name} {distanceInWordsToNow(link.created)} ago | <Link
          to={`/link/${link.id}`}>{link.comments.length > 0 ? `${link.comments.length} comments` : "Discuss"}</Link>
          {postedByAuthUser && <> | <span className="delete-button" onClick={handleDeleteLink}>Delete</span></>}
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
