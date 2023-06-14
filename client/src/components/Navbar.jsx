import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Textarea,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useRef, useState } from "react";
import Alert from "./alert";

export default function Navbar({ updateTask }) {
  const { colorMode, toggleColorMode } = useColorMode("dark");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const [alert, setAlert] = useState({});

  const handleDiscard = (e) => {
    e.preventDefault();
    dialogRef.current.close();
  };

  const handleBackDropClick = (e) => {
    if (e.target === e.currentTarget) {
      dialogRef.current.close();
    }
  };

  const handleAddTask = async () => {
    if (!newTitle || !newDesc || !newDeadline) return;

    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          desc: newDesc,
          deadline: new Date(newDeadline),
        }),
      }
    );
    const data = await response.json();
    if (data.message === "Task created successfully") {
      updateTask(data.task);
    } else {
      setAlert({ message: "failed to create task", type: "error" });
    }
    setLoading(false);
    dialogRef.current.close();
  };
  return (
    <>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <dialog ref={dialogRef} onClick={(e) => handleBackDropClick(e)}>
        <Flex
          w={"400px"}
          h={"400px"}
          direction={"column"}
          alignContent={"space-between"}
        >
          <FormControl isRequired width={"400px"}>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              h={"150px"}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Deadline</FormLabel>
            <Input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={"40px"}>
            <Flex justifyContent="space-between">
              <Button onClick={(e) => handleDiscard(e)}>Discard</Button>
              <Button
                type="submit"
                colorScheme="blue"
                onClick={() => handleAddTask()}
                isDisabled={!newTitle || !newDesc || !newDeadline}
                isLoading={loading}
              >
                Add
              </Button>
            </Flex>
          </FormControl>
        </Flex>
      </dialog>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Heading size="md">Task Manager</Heading>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button
                onClick={() => dialogRef.current.showModal()}
                colorScheme="teal"
              >
                Add
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
