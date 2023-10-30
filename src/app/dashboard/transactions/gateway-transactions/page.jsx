"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";

const Transactions = () => {
  const [data, setData] = useState([]);
  const { handleError } = useApiHandler();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/admin/gateway-transaction/all`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching payments");
      });
  }

  return (
    <>
      <Text
        className="serif"
        fontSize={"2xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Gateway Transactions
      </Text>

      {/* <Stack py={4} gap={4} direction={['column', 'row']} alignItems={'flex-end'}>
                <FormControl w={['full', 'xs']}>
                    <FormLabel>From</FormLabel>
                    <Input type='date' />
                </FormControl>
                <FormControl w={['full', 'xs']}>
                    <FormLabel>To</FormLabel>
                    <Input type='date' />
                </FormControl>
                <Button colorScheme='twitter'>Search</Button>
            </Stack> */}

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr key={key}>
                <Td>{data?.payment_id}</Td>
                <Td>{data?.description}</Td>
                <Td>{data?.amount}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Transactions;
