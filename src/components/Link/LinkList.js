import React, {useContext, useEffect, useState} from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";


function LinkList(props) {
  const {firebase} = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.db.collection('links').onSnapshot(handleSnapshot);
    return () => {
      unsubscribe()
    };
  }, []);


  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    console.log(links);
    setLinks(links);
  }

  return (
    <div>
      {links.map((link, i) => (
        <LinkItem key={link.id} showCount={true} link={link} index={i + 1}/>
      ))}
    </div>
  );
}

export default LinkList;
