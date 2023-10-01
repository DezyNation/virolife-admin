"use client";
import PrintButtons from "@/components/dashboard/PrintButtons";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
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

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [logins, setLogins] = useState([]);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetchLogins();
  }, []);

  function fetchLogins(pageLink) {
    BackendAxios.get(pageLink || `/api/admin/user-logins`)
      .then((res) => {
        setLogins(res.data.data);
        setPages(res.data.links);
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
      <Text fontSize={"lg"} fontWeight={"semibold"} className="messiri">
        Logins
      </Text>
      <br />
      <HStack py={4}>
      {pages.map((page, key) => (
          <Button
          onClick={() => fetchLogins(page?.url)}
          size={"xs"}
          colorScheme="yellow"
          variant={page?.active ? "solid" : "outline"}
          >
          {page?.label?.replace("&laquo; Previous", "<")?.replace("Next &raquo;", ">")}
        </Button>
      ))}
      </HStack>
      <PrintButtons keyword={"logins"} fileName={"Logins"} />
      <TableContainer>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>User ID</Th>
              <Th>User Name</Th>
              <Th>IP</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logins.map((entry, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{entry?.user_id}</Td>
                <Td>{entry?.name}</Td>
                <Td>{entry?.ip}</Td>
                <Td>{new Date(entry?.updated_at).toLocaleString(undefined, {timeZone: "Asia/Kolkata"})}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
