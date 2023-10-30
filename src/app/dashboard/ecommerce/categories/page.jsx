"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const page = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      onOpen();
    }
    if (!selectedCategory) {
      onClose();
    }
  }, [selectedCategory]);

  function fetchCategories() {
    BackendAxios.get("/api/category")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function createCategory() {
    if (categoryName === "") {
      return;
    }
    BackendAxios.post("/api/category", {
      name: categoryName,
      type: "ecommerce",
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Category added",
        });
        fetchCategories();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateCategory() {
    if (!selectedCategory) {
      return;
    }
    BackendAxios.put(`/api/category/${selectedCategory}`, {
      name: categoryName,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Category updated",
        });
        setSelectedCategory("");
        fetchCategories();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function deleteCategory(id) {
    if (!id) {
      return;
    }
    BackendAxios.delete(`/api/category/${id}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Category deleted",
        });
        fetchCategories();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Text fontWeight={"semibold"} fontSize={"lg"}>
        Ecommerce Categories
      </Text>
      <br />
      <TableContainer>
        <Table colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>Category ID</Th>
              <Th>Name</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories
              ?.filter((category) => category?.type == "ecommerce")
              ?.map((category, key) => (
                <Tr key={key}>
                  <Td>{category?.id}</Td>
                  <Td>{category?.name}</Td>
                  <Td>
                    <HStack>
                      <Button
                        size={"xs"}
                        colorScheme="twitter"
                        onClick={() => setSelectedCategory(category?.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size={"xs"}
                        colorScheme="red"
                        onClick={() => deleteCategory(category?.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button
        rounded={"full"}
        pos={"absolute"}
        bottom={4}
        right={4}
        colorScheme="twiiter"
        onClick={() => {
          onOpen();
        }}
      >
        Add New
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={() => setSelectedCategory("")}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory ? "Update Category" : "Add Category"}
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button
                colorScheme="yellow"
                onClick={() =>
                  selectedCategory ? updateCategory() : createCategory()
                }
              >
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
