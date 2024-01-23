"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  HStack,
  Stack,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";
import PrintButtons from "@/components/dashboard/PrintButtons";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [videos, setVideos] = useState([]);
  const [userId, setUserId] = useState("");

  function fetchVideos() {
    BackendAxios.get(`/api/admin/video-history?userId=${userId}`)
      .then((res) => {
        setVideos(res.data);
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
    fetchVideos();
  }, []);

  return (
    <>
      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          Videos
        </Text>
      </Stack>
      <br />
      <HStack w={'full'} justifyContent={'flex-end'}>
        <Input
          w={["full", "xs"]}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button onClick={() => fetchVideos()}>Search</Button>
      </HStack>
      <br />
      <PrintButtons />
      <Stack
        w={"full"}
        direction={["column"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} w={"full"}>
          <Table variant={"striped"} colorScheme="gray">
            <TableCaption>Videos on Virolife</TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>#</Th>
                {/* <Th>Type</Th> */}
                <Th>Title</Th>
                <Th>User</Th>
                <Th>Views</Th>
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((item, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  {/* <Td>{item?.provider}</Td> */}
                  <Td>{item?.title}</Td>
                  <Td>
                    {item?.user_unique}-{item?.name}
                  </Td>
                  <Td>{item?.watch_count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};

export default page;
