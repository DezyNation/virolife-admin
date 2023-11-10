"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
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
import { BsCheckCircleFill } from "react-icons/bs";
import { RangeDatepicker } from "chakra-dayzed-datepicker";

const page = () => {
  const [orders, setOrders] = useState([]);
  const Toast = useToast({ position: "top-right" });
  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchOrders();
    fetchCategories();
  }, []);

  function fetchOrders() {
    BackendAxios.get(
      `/api/admin/orders?from=${selectedDates[0]?.toISOString()}&to=${selectedDates[1]?.toISOString()}&categoryId=${selectedCategory}`
    )
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching orders",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

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

  return (
    <>
      <Text fontSize={"xl"} fontWeight={"semibold"}>
        Orders
      </Text>
      <br />
      <br />
      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={["space-between", "flex-start"]}
        gap={8}
      >
        <FormControl w={["full", "xs"]}>
          <FormLabel>Dates</FormLabel>
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </FormControl>
        <FormControl w={["full", "xs"]}>
          <FormLabel>Category</FormLabel>
          <Select
            placeholder="Select here"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories
              ?.filter((category) => category?.type == "ecommerce")
              ?.map((category, key) => (
                <option value={category?.id} key={key}>
                  {category?.name}
                </option>
              ))}
          </Select>
        </FormControl>
        <Button
          onClick={() => fetchCategories()}
          colorScheme="yellow"
          rounded={"full"}
        >
          Search
        </Button>
      </Stack>
      <br />
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Trnxn ID</Th>
              <Th>Product</Th>
              <Th>User</Th>
              <Th>Paid Full</Th>
              <Th>Amount</Th>
              <Th>Ad Points</Th>
              <Th>Health Points</Th>
              <Th>ATP Points</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders?.map((order, key) => (
              <Tr key={key}>
                <Td>{order?.id}</Td>
                <Td>{order?.razorpay_payment_id}</Td>
                <Td>
                  ({order?.product_id}) - {order?.product_name}
                </Td>
                <Td>
                  {order?.user_name} - ({order?.user_id})
                </Td>
                <Td textAlign={"center"}>
                  {order?.intent == "full" ? (
                    <BsCheckCircleFill color={"blue"} />
                  ) : null}
                </Td>
                <Td>{order?.amount}</Td>
                <Td>{order?.ad_points}</Td>
                <Td>{order?.health_points}</Td>
                <Td>{order?.atp_stars}</Td>
                <Td>{order?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
