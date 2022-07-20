import { useRef, useState, useEffect, Fragment } from "react";
import classes from "./InputForm.module.css";

const InputForm = () => {
    const [inputToCheck, setInputToCheck] = useState();
    const formInput = useRef();
    const [responseReceived, setResponseReceived] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const submitHandler = (event) => {
        event.preventDefault();
        
        const enteredInput = formInput.current.value;
        setInputToCheck(enteredInput)
      };

      useEffect(() => {
        const fetchResponse = async () => {
            const url = "https://api-inference.huggingface.co/models/bigscience/bloom";
            const token = 'ENTER TOKEN HERE';
            const data = {inputs: inputToCheck};
          const response = 
                await fetch(url, 
                    {headers: {"Authorization": `Bearer ${token}`}, 
                    method: "POST", 
                    body:JSON.stringify(data)});

          if (!response.ok) {
            throw new Error("Something went wrong!");
          }
          const responseData = await response.json();  
          //const test=responseData[0];
          //debugger;
          setResponseReceived(responseData[0].generated_text);
          setIsLoading(false);
        };
        fetchResponse().catch((error) => {
          setIsLoading(false);
        });
      }, [inputToCheck]);

      if (isLoading) {
        return (
          <section>
            <p>Loading</p>
          </section>
        );
      }

      const clearInputHandler = () => {
        setInputToCheck(null);
        setResponseReceived(null);
      }

      if (responseReceived !== null && responseReceived !== "" && responseReceived !== undefined){
        return <Fragment>
            <div>{responseReceived}</div>
            <div >
            <button type="button" onClick={clearInputHandler}>Try again</button>
            </div>
            </Fragment>
      }

   return ( 
   <form onSubmit={submitHandler} className={classes.form}>
    <div className={classes.control}>
      <label htmlFor="input" >Input</label>
      <input type="text" id="input" ref={formInput} />     
    </div>
    <div >
      <button type="submit">Submit</button>
    </div>
  </form>
  )

};

export default InputForm;
