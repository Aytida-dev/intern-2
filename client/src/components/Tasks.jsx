import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import Alert from "./alert";

export default function Tasks({
  title,
  desc,
  createdAt,
  status,
  deadline,
  _id,
  removeTask,
}) {
  const [Status, setStatus] = useState(status);
  const [createdAtDate, setCreatedAtDate] = useState(
    convertDateFormat(createdAt)
  );
  const [deadlineDate, setDeadlineDate] = useState(convertDateFormat(deadline));

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks/delete/${_id}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (data.message === "Task deleted successfully") {
      removeTask(_id);
    } else {
      setAlert({ message: "failed to delete task", type: "error" });
    }
    setLoading(false);
  }

  async function updateStatus() {
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks/update/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          desc: desc,
          deadline: deadline,
          createdAt: createdAt,
          status: !Status,
        }),
      }
    );
    const data = await res.json();
    if (data.message === "Task updated successfully") {
      setStatus(!Status);
    } else {
      setAlert({ message: "failed to update task", type: "error" });
    }
    setLoading(false);
  }

  setTimeout(() => {
    setAlert({});
  }, 3000);
  return (
    <Card opacity={Status ? "50%" : "100%"} width={"400px"} h={"400px"}>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <CardBody width={"100%"}>
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text minH={"150px"}>{desc}</Text>
          <Text color="blue.600" fontSize="sm">
            <Flex direction={"column"} gap={"10px"}>
              <span>created at : {createdAtDate}</span>
              <span>Deadline : {deadlineDate}</span>
            </Flex>
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter width={"400px"}>
        <Flex align="center" justify="space-between" gap={"150px"}>
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={() => updateStatus()}
            isDisabled={Status}
            isLoading={loading}
          >
            {!status ? "Mark as done" : "Already done"}
          </Button>
          <Button
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDelete()}
            isLoading={loading}
          >
            delete
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
}
