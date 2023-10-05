"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  HStack,
  Input,
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
import BackendAxios from "@/utils/axios";
import PrintButtons from "@/components/dashboard/PrintButtons";

const DonationTable = ({ groupType }) => {
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const Toast = useToast({
    position: "top-right",
  });

  const now = new Date();

  function fetchMyCollections() {
    BackendAxios.get(`/api/admin/user-collections${user ? `/${user}` : ""}`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  useEffect(() => {
    fetchMyCollections();
  }, []);

  function approveDonation(id) {
    if (!id) return;
    BackendAxios.post(`/api/admin/approve-donation/${id}`, { status: 1 })
      .then((res) => {
        Toast({
          status: "success",
          description: "Donation approved",
        });
        fetchMyCollections();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function deleteDonation(id) {
    if (!id) return;
    BackendAxios.delete(`/api/admin/delete-donation/${id}`)
      .then((res) => {
        Toast({
          description: "Donation deleted",
        });
        fetchMyCollections();
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
      <HStack w={"full"} justifyContent={"space-between"} mb={4}>
        <Input
          w={["full", "xs"]}
          placeholder="Enter User ID To Search"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Button colorScheme="yellow" onClick={fetchMyCollections}>
          Search
        </Button>
      </HStack>
      <PrintButtons />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table variant={"striped"} colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>From</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
              <Th>Updated By</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions
              ?.filter((trnxn) => trnxn?.remarks?.includes(groupType))
              .map((item, key) => (
                <Tr key={key}>
                  <Td>{item?.id}</Td>
                  <Td>
                    {item?.user?.name} ({item?.user?.id})
                  </Td>
                  <Td>{item?.remarks}</Td>
                  <Td>₹ {item?.amount}</Td>
                  <Td>{new Date(item?.created_at).toLocaleString()}</Td>
                  <Td>{item?.updated_by} {item?.updated_user}</Td>
                  <Td>
                    {!item?.approved && !item?.deleted_at ? (
                      now - new Date(item?.created_at) >= 86400000 ? (
                        <HStack>
                          <Button
                            size={"sm"}
                            rounded={"full"}
                            colorScheme="yellow"
                            onClick={() => approveDonation(item.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size={"sm"}
                            rounded={"full"}
                            colorScheme="red"
                            onClick={() => deleteDonation(item.id)}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      ) : null
                    ) : null}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const page = () => {
  return (
    <>
      <Text fontSize={["2xl", "3xl"]}>Group Donations</Text>
      <br />
      <br />
      <Text fontWeight={"semibold"}>Primary Donations</Text>
      <DonationTable groupType={"primary"} />
      <br />
      <br />
      <br />
      <Text fontWeight={"semibold"}>Secondary donation</Text>
      <DonationTable groupType={"secondary"} />
    </>
  );
};

export default page;
