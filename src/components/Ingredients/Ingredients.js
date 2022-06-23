import React, { useState, useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter((ing) => ing.id !== action.id);
    default:
      throw new Error(
        "If you are reading this, then something went really wrong"
      );
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [
    // currentIngredient,
  ]);
  // const [userIngredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState();

  // #############  This useEffect is loading data from firebase database.

  const filteredIngredients = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  //  ############# I am posting data to firebase using the fetch method.
  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://ingredient-app-5f610-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    // i changed id to ingredientId
    fetch(
      `https://ingredient-app-5f610-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        // const removedFromList = userIngredients.filter(
        //   (item) => item.id !== ingredientId
        // ); // Changed id to ingredientId
        dispatch({ type: "DELETE", id: ingredientId });
        // setIngredients(removedFromList);
      })
      .catch((error) => {
        setIsError(error.message);
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setIsError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredients} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
