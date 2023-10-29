"use client";
import BackendAxios from "@/utils/axios";
import {
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

const page = () => {
  const [orders, setOrders] = useState([]);
  const Toast = useToast({ position: "top-right" });

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    BackendAxios.get(`/api/admin/orders`)
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

  return (
    <>
      <Text fontSize={"xl"} fontWeight={"semibold"}>
        Orders
      </Text>
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Product</Th>
              <Th>User</Th>
              <Th>Paid Full</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders?.map((order, key) => (
              <Tr key={key}>
                <Td>{order.id}</Td>
                <Td>({order?.product_id}) - {order?.product_name}</Td>
                <Td>
                  {order.user_name} - ({order?.user_id})
                </Td>
                <Td textAlign={'center'}>
                  {order?.intent == "full" ? (
                    <BsCheckCircleFill color={"blue"} />
                  ) : null}
                </Td>
                <Td>{order.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
