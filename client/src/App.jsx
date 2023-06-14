import { Box, Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Tasks from "./components/Tasks";
import Alert from "./components/alert";

function App() {
  const [tasks, setTasks] = useState([]);
  const [alert, setAlert] = useState({});

  async function getTasks(signal) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks/all`,
      signal ? { signal } : undefined
    );
    const data = await response.json();
    //create a new array of tasks with status of true first and then false
    if (data.status === 500) {
      setAlert({ message: "Error while fetching data", type: "error" });
      return;
    }
    setTasks(sortTask(data.tasks.reverse()));
    setAlert({ message: "Data fetched successfully", type: "success" });
  }

  function sortTask(task) {
    const sortedTasks = task.sort((a, b) => {
      if (a.status && !b.status) {
        return 1; // 'true' before 'false'
      } else if (!a.status && b.status) {
        return -1; // 'false' after 'true'
      } else {
        return 0; // maintain the original order
      }
    });
    return sortedTasks;
  }

  useEffect(() => {
    const signal = new AbortController().signal;
    getTasks(signal);
  }, []);

  function newTask(task) {
    setTasks((tasks) => [...tasks, task]);
    setAlert({ message: "Task added successfully", type: "success" });
  }

  function deleteTask(id) {
    setTasks((tasks) => tasks.filter((task) => task._id !== id));
    setAlert({ message: "Task deleted successfully", type: "success" });
  }

  setTimeout(() => {
    setAlert({});
  }, 3000);

  return (
    <Box p={"10px"}>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <Box position="fixed" top={0} width="100%" zIndex="999">
        <Navbar updateTask={(task) => newTask(task)} />
      </Box>
      {tasks.length === 0 && (
        <SimpleGrid columns={[1, 2, 3]} spacing={4} mt={"80px"}>
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} height="200px" />
          ))}
        </SimpleGrid>
      )}
      <Flex
        flexWrap={"wrap"}
        marginInline={"auto"}
        mt={"80px"}
        gap={"10px"}
        justifyContent={{ sm: "center", md: "flex-start" }}
      >
        {tasks &&
          tasks.map((task) => (
            <Tasks
              key={task._id}
              {...task}
              removeTask={(id) => deleteTask(id)}
            />
          ))}
      </Flex>
    </Box>
  );
}

export default App;
