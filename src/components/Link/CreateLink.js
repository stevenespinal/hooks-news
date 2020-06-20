import React, {useContext} from "react";
import useFormValidation from "../Auth/useFormValidation";
import validateCreateLink from "../Auth/validateCreateLink";
import FirebaseContext from "../../firebase/context";

const INITIAL_STATE = {
  description: "",
  url: ""
}

const CreateLink = ({history}) => {
  const {firebase, currentUser} = useContext(FirebaseContext)
  const {handleSubmit, handleChange, values, errors} = useFormValidation(INITIAL_STATE, validateCreateLink, handleCreateLink);

  async function handleCreateLink() {
    if (!currentUser) {
      history.push("/login");
    } else {
      const {url, description} = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: currentUser.uid,
          name: currentUser.displayName
        },
        votes: [],
        comments: [],
        created: Date.now()
      }
      await firebase.db.collection("links").add(newLink);
      history.push("/");
    }
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-column mt3">
      <input className={errors.description && 'errors-input'} onChange={handleChange} value={values.description}
             type="text" name="description" placeholder="Description for link" autoComplete="off"/>
      {errors.description && <p className="error-text">{errors.description}</p>}
      <input className={errors.url && 'errors-input'} onChange={handleChange} value={values.url} type="url" name="url"
             placeholder="Url for link" autoComplete="off"/>
      {errors.url && <p className="error-text">{errors.url}</p>}
      <button className="button" type="submit">Submit</button>
    </form>
  )
}

export default CreateLink;
