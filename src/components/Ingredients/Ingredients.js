import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [userIngredients, setIngredients] = useState([]);

  // #############  This useEffect is loading data from firebase database.
 

  const filteredIngredients = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  //  ############# I am posting data to firebase using the fetch method.
  const addIngredientHandler = (ingredient) => {
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
        return response.json();
      })
      .then((responseData) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (id) => {
    const removedFromList = userIngredients.filter((item) => item.id !== id);

    setIngredients(removedFromList);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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
