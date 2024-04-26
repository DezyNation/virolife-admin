"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  Editable,
  EditableInput,
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
import React, { useState, useEffect } from "react";

const page = () => {
  const Toast = useToast();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  function fetchGrades() {
    BackendAxios.get(`/api/grades`)
      .then((res) => {
        setGrades(res?.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function addGrade() {
    BackendAxios.post(`/api/grades`, { grade: "Grade Name", commission: 0 })
      .then((res) => {
        Toast({
          status: "success",
          description: "Grade added",
        });
        fetchGrades();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }
  function updateGrade(id, data) {
    BackendAxios.put(`/api/grades/${id}`, { ...data })
      .then((res) => {
        Toast({
          status: "success",
          description: "Grade updated",
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

  function deleteGrade(id) {
    BackendAxios.delete(`/api/grades/${id}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Grade deleted",
        });
        fetchGrades();
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
    <HStack justifyContent={'space-between'}>
      <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
        Grades
      </Text>
      <Button colorScheme="twitter" onClick={addGrade}>Add Grade</Button>
    </HStack>
      <br />
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Grade</Th>
              <Th>Commission</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {grades?.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>
                  <Editable
                    defaultValue={item?.grade}
                    onSubmit={(value) =>
                      updateGrade(item?.id, { grade: value })
                    }
                  >
                    <EditableInput />
                  </Editable>
                </Td>
                <Td>
                  <Editable
                    defaultValue={item?.commission}
                    onSubmit={(value) =>
                      updateGrade(item?.id, { commission: value })
                    }
                  >
                    <EditableInput />
                  </Editable>
                  %
                </Td>
                <Td textAlign={"center"}>
                  <Button
                    size={"sm"}
                    colorScheme="red"
                    onClick={() => deleteGrade(item?.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
