import React, {useState, useEffect, useContext} from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const [filter, setFilter] = useState("");
  const [links, setLinks] = useState([])

  const [filteredLinks, setFilteredLinks] = useState([]);
  const {firebase} = useContext(FirebaseContext);

  useEffect(() => {
    getInitialLinks();
  }, []);

  const getInitialLinks = () => {
    firebase.db.collection("links").get().then(snapshot => {
      const links = snapshot.docs.map(doc => {
        return {id: doc.id, ...doc.data()}
      });

      setLinks(links);
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
      return link.description.toLowerCase().includes(query) || link.url.toLowerCase().includes(query) || link.postedBy.name.toLowerCase().includes(query)
    });
    setFilteredLinks(matchedLinks);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input type="text" onChange={event => setFilter(event.target.value)}/>
          <button type="submit">OK</button>
        </div>
      </form>

      {filteredLinks.map((filteredLink, i) => {
        return <LinkItem link={filteredLink} index={i} key={filteredLink.id} showCount={false} />
      })}

    </div>
  );
}

export default SearchLinks;
