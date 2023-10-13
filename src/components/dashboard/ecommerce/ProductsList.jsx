"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const ProductsList = () => {
  const Toast = useToast();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

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
              {/* <Th>Health Points</Th> */}
              <Th>Ad Points</Th>
              <Th>All Team Points</Th>
              <Th>Gift Card</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.map((product, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{product?.images}</Td>
                <Td>{product?.title}</Td>
                <Td>{product?.price}</Td>
                {/* <Td>{product?.health_point_status}</Td> */}
                <Td>{product?.ad_point_status}</Td>
                <Td>{product?.atp_point_status}</Td>
                <Td>{product?.gift_card_status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductsList;
