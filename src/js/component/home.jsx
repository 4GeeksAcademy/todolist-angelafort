import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

let urlBase = "https://playground.4geeks.com/apis/fake/todos/user/angela";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getTask = async () => {
    try {
      let resp = await fetch(urlBase);
      let data = await resp.json();

      if (resp.ok) {
        setTodos(data);
      }
      if (resp.status === 404) {
        createUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async () => {
    try {
      let resp = await fetch(urlBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      if (resp.ok) {
        getTask();
      }
      console.log("User created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const deleteTask = async (index) => {
    const updatedTasks = todos.filter((_, currentIndex) => index !== currentIndex);
    
    try {
      let resp = await fetch(urlBase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTasks),
      });
      
      if (resp.ok) {
        getTask();
      } else {
        console.log("Failed to delete task.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function deleteAll(){
    try {
      let resp = await fetch (urlBase, {
        method: "DELETE",
        headers:{
          "Content-Type": "aplication/json"
        }
      })
      if (resp.ok){
        getTask()
      }
      console.log(error)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="container">
      <h1>todos</h1>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                try {
                  let resp = await fetch(urlBase, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify([...todos, { label: inputValue, done: false }]),
                  });
                  if (resp.ok) {
                    getTask();
                    setInputValue("");
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            }}
            placeholder="What needs to be done?"
          />
        </li>
        {todos.length === 0 ? (
          <li>No tasks, add a task</li>
        ) : (
          todos.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="task-list-item">
                {item.label}
                {hoveredIndex === index && (
                  <div className="icon">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteTask(index)}
                    />
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
      <button onClick={()=> deleteAll()}>Delete All</button>
      <div>{todos.length} tasks</div>
    </div>
  );
};

export default Home;
