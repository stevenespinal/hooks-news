import React, {useContext, useEffect, useState} from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import {LINKS_PER_PAGE} from "../../utils";
import axios from "axios";

function LinkList({location, match, history}) {
  const {firebase} = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const page = Number(match.params.page);
  const isNewPage = location.pathname.includes("new");
  const isTopPage = location.pathname.includes("top");
  const [loading, setLoading] = useState(false);
  const linksRef = firebase.db.collection('links');

  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, page]);

  function getLinks() {
    const hasCursor = Boolean(cursor);
    setLoading(true);
    if (isTopPage) {
      return linksRef
        .orderBy('voteCount', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (page === 1) {
      return linksRef.orderBy('created', 'desc').limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      return linksRef.orderBy('created', 'desc').startAfter(cursor.created).limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot);
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE;
      axios.get(`https://us-central1-hooks-news-c9337.cloudfunctions.net/linksPagination?offset=${offset}`).then((res) => {
        const links = res.data;
        const lastLink = links[links.length - 1];
        setLinks(links);
        setCursor(lastLink);
        setLoading(false);
      });
      return () => {};
    }
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    const lastLink = links[links.length - 1];
    setLinks(links);
    setCursor(lastLink);
    setLoading(false);
  }

  const visitPreviousPage = () => {
    if (page > 1) {
      history.push(`/new/${page - 1}`)
    }
  }

  const visitNextPage = () => {
    if (page <= links.length / LINKS_PER_PAGE) {
      history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 1;

  return (
    <div style={{opacity: loading ? 0.25 : 1}}>
      {links.map((link, i) => (
        <LinkItem key={link.id} showCount={true} link={link} index={i + pageIndex}/>
      ))}
      {isNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage}>Previous</div>
          <div className="pointer" onClick={visitNextPage}>Next</div>
        </div>
      )}
    </div>
  );
}

export default LinkList;
