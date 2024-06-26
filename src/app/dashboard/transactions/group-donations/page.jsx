"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
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
import BackendAxios from "@/utils/axios";
import PrintButtons from "@/components/dashboard/PrintButtons";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import { FaUser } from "react-icons/fa";

const DonationTable = ({ transactions, groupType, fetchMyCollections }) => {
  const [user, setUser] = useState("");
  const Toast = useToast({
    position: "top-right",
  });

  const now = new Date();

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
      <PrintButtons />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table variant={"striped"} colorScheme="gray" size={"sm"}>
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
                  <Td>
                    ₹ {item?.amount}{" "}
                    {item?.donated_to_admin ? <FaUser /> : null}{" "}
                  </Td>
                  <Td>{new Date(item?.created_at).toLocaleString()}</Td>
                  <Td>
                    {item?.updated_by} {item?.updated_user}
                  </Td>
                  <Td>
                    {!item?.approved && !item?.deleted_at ? (
                      now - new Date(item?.created_at) >= 43200000 ||
                      item?.donated_to_admin ? (
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
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [dates, setDates] = useState([
    new Date().setMonth(new Date().getMonth() - 2),
    new Date().setDate(new Date().getDate() + 1),
  ]);

  function fetchMyCollections() {
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/user-collections${
        user ? `/${user}` : ""
      }?from=${from}&to=${to}`
    )
      .then((res) => {
        setData(res.data);
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

  return (
    <>
      <Text fontSize={["2xl", "3xl"]}>Group Donations</Text>
      <br />
      <br />
      <Stack
        w={"full"}
        direction={["column", "row"]}
        justifyContent={["center", "flex-end"]}
        mb={4}
      >
        <Input
          w={["full", "xs"]}
          placeholder="Enter User ID To Search"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Box w={["full", "xs"]}>
          <RangeDatepicker onDateChange={setDates} selectedDates={dates} />
        </Box>
        <Button colorScheme="yellow" onClick={fetchMyCollections}>
          Search
        </Button>
      </Stack>
      <br />
      <br />
      <Text fontWeight={"semibold"}>Primary Donations</Text>
      <DonationTable
        groupType={"primary"}
        transactions={data}
        fetchMyCollections={() => fetchMyCollections()}
      />
      <br />
      <br />
      <br />
      <Text fontWeight={"semibold"}>Secondary donation</Text>
      <DonationTable
        groupType={"secondary"}
        transactions={data}
        fetchMyCollections={() => fetchMyCollections()}
      />
    </>
  );
};

export default page;
