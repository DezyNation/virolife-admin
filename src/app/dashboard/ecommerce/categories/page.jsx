"use client";
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
  const [selectedCategory, setSelectedCategory] = useState({
    status: false,
    id: "",
  });
  const [categoryName, setCategoryName] = useState("");

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
            {categories?.map((category, key) => (
              <Tr key={key}>
                <Td>{category?.id}</Td>
                <Td>{category?.title}</Td>
                <Td>
                  <HStack>
                    <Button size={"xs"} colorScheme="twitter">
                      Edit
                    </Button>
                    <Button size={"xs"} colorScheme="red">
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal
        isCentered
        isOpen={selectedCategory?.status}
        onClose={() =>
          setSelectedCategory({ ...selectedCategory, status: false })
        }
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory?.id ? "Update Category" : "Add Category"}
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
              <Button colorScheme="yellow">Save</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
