"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

const PlanTree = ({ status, userId, userName, onClose }) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [coords, setCoords] = useState({
    x: "",
    y: "",
  });
  const [showTooltip, setShowTooltip] = useState({
    status: false,
    id: "",
    donation: 0,
  });

  useEffect(() => {
    if (userId) {
      fetchJuniors();
    }
  }, []);

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  function buildHierarchy(items, parentId) {
    const nestedArray = [];
    for (const item of items) {
      if (parseInt(item.parent_id) == parseInt(parentId)) {
        const children = buildHierarchy(items, item.user_id);
        if (children.length > 0) {
          item.children = children;
        }
        nestedArray.push(item);
      }
    }
    return nestedArray;
  }

  function fetchJuniors() {
    BackendAxios.get(`/api/admin/subscription-tree/${userId}`)
      .then((res) => {
        if (!res?.data) return;
        const hierarchyArray = buildHierarchy(res?.data, userId);
        setGroupMembers([
          {
            name: userName,
            children: hierarchyArray,
            id: userId,
            planName: "",
          },
        ]);
      })
      .catch((err) => {
        handleError(err, "Error while fetching juniors");
      });
  }

  return (
    <>
      <Modal isOpen={status} onClose={onClose} size={["full", "4xl"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Juniors Tree - User {userId}</ModalHeader>
          <ModalBody>
            <Box w={"full"} h={"80vh"} pos={"relative"}>
              {groupMembers?.length ? (
                <Tree
                  data={groupMembers}
                  orientation="vertical"
                  translate={{ x: 300, y: 200 }}
                  separation={{ siblings: 1, nonSiblings: 2 }}
                  onNodeMouseOver={(data) => {
                    setShowTooltip({
                      status: true,
                      id: `VCF${data?.data?.user_id}`,
                      planName: data?.data?.plan_name,
                    });
                  }}
                  onNodeMouseOut={() => setShowTooltip({ status: false })}
                />
              ) : null}
            </Box>
            <Box
              display={showTooltip.status ? "flex" : "none"}
              flexDirection={"column"}
              pos={"absolute"}
              top={coords.y - 100}
              left={coords.x - 210}
              p={3}
              rounded={4}
              boxShadow={"sm"}
              bgColor={"#FFF"}
            >
              <Text fontSize={"sm"}>ID: {showTooltip.id}</Text>
              <Text fontSize={"sm"}>Plan: {showTooltip.planName}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"flex-end"}>
              <Button fontWeight={"medium"} onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlanTree;
