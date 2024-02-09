"use client";
import {
  Box,
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

const TreeModal = ({ status, groupMembers, onClose }) => {
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

  return (
    <>
      <Modal isOpen={status} onClose={onClose} size={["full", "4xl"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You Group Members</ModalHeader>
          <ModalBody>
            <Box w={"full"} h={"80vh"} pos={"relative"}>
              <Tree
                data={groupMembers}
                orientation="vertical"
                translate={{ x: 300, y: 200 }}
                separation={{ siblings: 1, nonSiblings: 2 }}
                onNodeMouseOver={(data) => {
                  console.log("User ", data?.data?.id)
                  console.log(data)
                  setShowTooltip({
                    status: true,
                    id: `VCF${data?.data?.id}`,
                    donation:
                      Number(data?.data?.primary_sum ?? 0) +
                      Number(data?.data?.secondary_sum ?? 0) +
                      Number(data?.data?.senior_primary ?? 0) +
                      Number(data?.data?.senior_secondary ?? 0),
                  });
                }}
                onNodeMouseOut={() => setShowTooltip({ status: false })}
              />
            </Box>
            <Box
              display={showTooltip.status ? "flex" : "none"}
              flexDirection={"column"}
              pos={"absolute"}
              top={coords.y - 100}
              left={coords.x - 600}
              p={3}
              rounded={4}
              boxShadow={"sm"}
              bgColor={"#FFF"}
            >
              <Text fontSize={"sm"}>ID: {showTooltip.id}</Text>
              <Text fontSize={"sm"}>Collection: {showTooltip.donation}</Text>
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TreeModal;
