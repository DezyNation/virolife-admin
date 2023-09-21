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
  Switch,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { BsDownload, BsPlus } from "react-icons/bs";
import BackendAxios from "@/utils/axios";
import { useFormik } from "formik";

const Views = () => {
    
  const Toast = useToast({ position: "top-right" });
  const [videos, setVideos] = useState([]);

  function fetchVideos() {
    BackendAxios.get("/api/admin/video-views")
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
      <HStack justifyContent={["space-between"]} py={8}>
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          Videos
        </Text>
      </HStack>
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
                <Th>Type</Th>
                <Th>Title</Th>
                <Th>Link</Th>
                <Th>Views</Th>
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((item, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  <Td>{item?.provider}</Td>
                  <Td>{item?.title}</Td>
                  <Td>
                    <Link href={item?.link} target={"_blank"}>
                      Click to View
                    </Link>
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

export default Views;
