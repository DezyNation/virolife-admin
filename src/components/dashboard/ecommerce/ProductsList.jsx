"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

const ProductsList = () => {
  const Toast = useToast();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [targetProductId, setTargetProductId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    BackendAxios.get(`/api/product?search=${search}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateProduct(id, data) {
    BackendAxios.put(`/api/product/${id}`, {
      ...data,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Product updated successfully!",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function deleteProduct(id) {
    BackendAxios.delete(`/api/product/${id}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Product deleted successfully!",
        });
        onClose();
        fetchProducts();
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
      <Stack py={4} justifyContent={"space-between"} direction={["column"]}>
        <Text>Search Products</Text>
        <HStack>
          <Input
            w={["full", "xs"]}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter product name"
          />
          <Button colorScheme="yellow" onClick={() => fetchProducts()}>
            Search
          </Button>
        </HStack>
      </Stack>
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Img</Th>
              <Th>Title</Th>
              <Th>Price</Th>
              <Th>Health Points</Th>
              <Th>Ad Points</Th>
              <Th>All Team Points</Th>
              <Th>Discount Card</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.map((product, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>
                  {JSON.parse(product?.images)?.length ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${
                        JSON.parse(product?.images)[0]
                      }`}
                      boxSize={8}
                    />
                  ) : (
                    "NO IMG"
                  )}
                </Td>
                <Td>{product?.name}</Td>
                <Td>{product?.price}</Td>
                <Td>{product?.health_point}</Td>
                <Td>{product?.ad_point}</Td>
                <Td>{product?.atp_point}</Td>
                <Td textAlign={"center"}>
                  {product?.gift_card_status ? (
                    <BsCheckCircleFill color={"green"} />
                  ) : null}
                </Td>
                <Td>
                  <HStack>
                    <Switch
                      defaultChecked={product?.status === 1}
                      onChange={() =>
                        updateProduct(product?.id, {
                          status: product?.status === 1 ? 0 : 1,
                        })
                      }
                    />
                    <Link
                      href={`/dashboard/ecommerce/products/edit/${product?.id}`}
                      target="_blank"
                    >
                      <Button size={"xs"}>Edit</Button>
                    </Link>
                    <Button
                      size={"xs"}
                      colorScheme="red"
                      onClick={() => {
                        setTargetProductId(product?.id);
                        onOpen();
                      }}
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

      {/* Delete confirmation modal */}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delte Product?</ModalHeader>
          <ModalBody>
            <Text>
              Are you sure to delete this product? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => deleteProduct(targetProductId)}
              >
                Yes, Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductsList;
