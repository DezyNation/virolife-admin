"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";

const page = () => {
  const [orders, setOrders] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const Toast = useToast({ position: "top-right" });
  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      onOpen();
    } else {
      onClose();
    }
  }, [selectedOrderId]);

  function fetchOrders() {
    const from = format(selectedDates[0], "yyyy-MM-dd");
    const to = format(selectedDates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/orders?from=${from}&to=${to}&categoryId=${selectedCategory}`
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

  function updateOrderStatus() {
    if (!selectedOrderId) return;
    BackendAxios.post(`/api/admin/update/order/${selectedOrderId}`, {
      status: status,
    })
      .then(() => {
        Toast({
          status: "success",
          description: "Status updated successfully!",
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
          onClick={() => fetchOrders()}
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
              <Th>Status</Th>
              <Th>Paid Full</Th>
              <Th>Amount</Th>
              <Th>Ad Points</Th>
              <Th>Health Points</Th>
              <Th>ATP Points</Th>
              <Th>Timestamp</Th>
              <Th>Action</Th>
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
                <Td>{order?.status}</Td>
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
                <Td>
                  <Button
                    colorScheme="yellow"
                    size={"sm"}
                    onClick={() => {
                      setStatus(order?.status);
                      setSelectedOrderId(order?.id);
                    }}
                  >
                    Update Status
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            Update Order Status for order #{selectedOrderId}
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                h={28}
                w={"full"}
                resize={"none"}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"flex-end"}>
              <Button onClick={() => setSelectedOrderId(null)}>Close</Button>
              <Button colorScheme="yellow" onClick={() => updateOrderStatus()}>
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
