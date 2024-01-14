"use client";
import {
  Box,
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiGroup } from "react-icons/bi";
import {
  BsCheckCircleFill,
  BsCurrencyRupee,
  BsHeartFill,
} from "react-icons/bs";
import { GiChestnutLeaf } from "react-icons/gi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const page = () => {
  const { handleError } = useApiHandler();
  const params = useSearchParams();
  const userId = params.get("user_id");

  const [userFound, setUserFound] = useState(false);
  const [userName, setUserName] = useState("");
  const [rounds, setRounds] = useState([
    {
      round: 0,
    },
    {
      round: 1,
    },
    {
      round: 2,
    },
    {
      round: 3,
    },
    {
      round: 4,
    },
    {
      round: 5,
    },
    {
      round: 6,
    },
    {
      round: 7,
    },
    {
      round: 8,
    },
    {
      round: 9,
    },
  ]);
  const [myCurrentRound, setMyCurrentRound] = useState(null);
  const [activeRound, setActiveRound] = useState(null);

  const [requirements, setRequirements] = useState({
    threshold: 0,
    collection: 0,
    campaignDonationsRequired: 0,
    campaignDonationsDone: 0,
    primaryJuniorDonationsRequired: 0,
    primaryJuniorDonationsDone: 0,
    secondaryJuniorDonationsRequired: 0,
    secondaryJuniorDonationsDone: 0,
    virolifeDonationsRequired: 0,
    virolifeDonationsDone: 0,
  });
  const [amounts, setAmounts] = useState({
    primaryJuniorDonation: 0,
    secondaryJuniorDonation: 0,
    primarySeniorDonation: 0,
    secondarySeniorDonation: 0,
    campaignDonation: 0,
    virolifeDonation: 0,
  });
  const [juniorsData, setJuniorsData] = useState([]);
  const [seniorsData, setSeniorsData] = useState([]);
  const [donationData, setDonationData] = useState([]);

  const [campaignsData, setCampaignsData] = useState([]);
  const [virolifeDonationData, setVirolifeDonationData] = useState([]);

  useEffect(() => {
    if (!userFound) return;
    setActiveRound(myCurrentRound);
    fetchRounds(myCurrentRound);
  }, [myCurrentRound, userFound]);

  useEffect(() => {
    if (userId) {
      BackendAxios.get(`/api/users/${userId}`)
        .then((res) => {
          setMyCurrentRound(res.data[0]?.round);
          setUserName(res.data[0]?.name);
          setRequirements((prev) => ({
            ...prev,
            collection:
              parseInt(res.data[0]?.primary_sum) +
              parseInt(res.data[0]?.secondary_sum),
          }));
          setUserFound(true);
        })
        .catch((err) => {
          handleError(err, "Err while getting user details");
        });
    }
  }, []);

  useEffect(() => {
    if (!userFound || activeRound == null) return;
    fetchRounds(activeRound);
    fetchJuniorsData();
    fetchSeniorsData();
    fetchCampaignDonations();
    fetchVirolifeDonations();
    fetchMyPreviousDonations(userId);
  }, [activeRound, userFound]);

  function fetchRounds(round = myCurrentRound) {
    if (!userFound) return;
    BackendAxios.get(`/api/tasks`)
      .then((res) => {
        const tasks = res.data;
        const currentTasks = tasks?.find((task) => task?.round == round);
        setRounds(tasks?.sort((a, b) => a.round - b.round));
        setRequirements((prev) => ({
          ...prev,
          threshold: Number(currentTasks?.target_amount)?.toFixed(0),
          virolifeDonationsRequired: Number(
            currentTasks?.virolife_donation
          )?.toFixed(0),
          primaryJuniorDonationsRequired: currentTasks?.primary_junior_count,
          secondaryJuniorDonationsRequired:
            currentTasks?.secondary_junior_count,
          campaignDonationsRequired: currentTasks?.campaign_count,
        }));
        setAmounts((prev) => ({
          ...prev,
          campaignDonation: Number(currentTasks?.campaign_amount)?.toFixed(0),
          virolifeDonation: Number(currentTasks?.virolife_donation)?.toFixed(0),
          primaryJuniorDonation: Number(
            currentTasks?.primary_junior_amount
          )?.toFixed(0),
          secondaryJuniorDonation: Number(
            currentTasks?.secondary_junior_amount
          )?.toFixed(0),
          primarySeniorDonation: Number(
            currentTasks?.primary_senior_amount
          )?.toFixed(0),
          secondarySeniorDonation: Number(
            currentTasks?.secondary_senior_amount
          )?.toFixed(0),
        }));
      })
      .catch((err) => {
        console.log("error while fetching tasks");
        console.log(err?.response?.data);
      });
  }

  function fetchJuniorsData() {
    if (!userFound || myCurrentRound == null) return;
    BackendAxios.get(
      `/api/admin/donations?donation=junior-donation&round=${activeRound}&userId=${userId}`
    )
      .then((res) => {
        setJuniorsData(res.data);
        const prim = res.data?.filter((data) => {
          if (data?.group == "primary" && data?.approved) {
            return data;
          }
        });
        const sec = res.data?.filter((data) => {
          if (data?.group == "secondary" && data?.approved) {
            return data;
          }
        });
        setRequirements((prev) => ({
          ...prev,
          primaryJuniorDonationsDone: prim?.length,
          secondaryJuniorDonationsDone: sec?.length,
        }));
      })
      .catch((err) => {
        handleError(err, "Error while fetching juniors data");
      });
  }

  function fetchSeniorsData() {
    if (!userFound || myCurrentRound == null) return;
    BackendAxios.get(
      `/api/admin/donations?donation=senior-donation&round=${activeRound}&userId=${userId}`
    )
      .then((res) => {
        setSeniorsData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching seniors data");
      });
  }

  function fetchCampaignDonations() {
    if (!userFound || myCurrentRound == null) return;
    BackendAxios.get(
      `/api/admin/donations?donation=campaign&round=${activeRound}&userId=${userId}`
    )
      .then((res) => {
        setCampaignsData(res.data);
        setRequirements((prev) => ({
          ...prev,
          campaignDonationsDone: res.data?.length,
        }));
      })
      .catch((err) => {
        handleError(err, "Err while fetching your campaign donations");
      });
  }

  function fetchVirolifeDonations() {
    if (!userFound || myCurrentRound == null) return;
    BackendAxios.get(
      `/api/admin/donations?donation=virolife&round=${activeRound}&purpose=target&userId=${userId}`
    )
      .then((res) => {
        const result = res.data?.filter((data) => data?.round == activeRound);
        setVirolifeDonationData(result);

        const totalAmount = result?.reduce((accumulator, currentValue) => {
          if (currentValue.hasOwnProperty("amount")) {
            return accumulator + Number(currentValue.amount);
          }
          return accumulator;
        }, 0);

        setRequirements((prev) => ({
          ...prev,
          virolifeDonationsDone: totalAmount,
        }));
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        handleError(err, "Error while fetching donations");
      });
  }

  function fetchMyPreviousDonations() {
    if (!userFound || myCurrentRound == null) return;
    BackendAxios.get(
      `/api/admin/donations?donation=senior-donation&round=${activeRound}&userId=${userId}`
    )
      .then((res) => {
        setDonationData(res.data?.filter((item) => item?.group == "primary"));
      })
      .catch((err) => {
        handleError(err, "Error while getting your past donations");
      });
  }

  return (
    <>
      <Text mb={4} fontSize={"2xl"} fontWeight={"semibold"} className="messiri">
        Target List ({userName} - {userId})
      </Text>

      <Stack
        w={"full"}
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"center"}
        my={4}
        gap={4}
      >
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"} alignItems={"flex-start"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BsCurrencyRupee size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Collection</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                ₹ {requirements?.collection}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: ₹{requirements?.threshold}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BiGroup size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Junior Donations</Text>
              <HStack w={"full"} gap={8}>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  {requirements?.primaryJuniorDonationsDone}
                </Text>
              </HStack>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Req.: {requirements?.primaryJuniorDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <BsHeartFill size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Medical donations</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                {requirements?.campaignDonationsDone}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: {requirements?.campaignDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          w={"full"}
          rounded={4}
          boxShadow={"base"}
          flex={["unset", 1]}
          bgColor={"yellow.50"}
        >
          <HStack w={"full"}>
            <Box p={4} rounded={4} bgColor={"yellow.600"}>
              <GiChestnutLeaf size={48} color="#FFF" />
            </Box>
            <Box w={"full"}>
              <Text fontSize={"sm"}>Virolife donations</Text>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                ₹{requirements?.virolifeDonationsDone}
              </Text>
              <br />
              <HStack w={"full"} justifyContent={"flex-end"}>
                <Text fontSize={"xs"}>
                  Required: ₹{requirements?.virolifeDonationsRequired}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
      </Stack>
      <br />
      <br />
      <HStack
        w={"full"}
        overflowX={"scroll"}
        className="hide-scrollbar"
        justifyContent={"flex-start"}
        gap={6}
        my={4}
      >
        <Text fontSize={"lg"} fontWeight={"medium"}>
          Rounds:{" "}
        </Text>
        {rounds?.map((item, key) => (
          <Box key={key}>
            <Button
              colorScheme={
                myCurrentRound == item?.round
                  ? "yellow"
                  : activeRound == item?.round
                  ? "twitter"
                  : "gray"
              }
              onClick={() => setActiveRound(item?.round)}
            >
              Round {item?.round}
            </Button>
          </Box>
        ))}
      </HStack>
      <HStack w={"full"} justifyContent={"flex-end"}>
        <Text fontSize={"xs"}>
          If the data is incorrect, please refresh the page.
        </Text>
      </HStack>
      <br />
      <br />

      <Tabs>
        <TabList>
          <Tab>Donate to Juniors</Tab>
          <Tab>Senior Donation History</Tab>
          <Tab>Approve Donations from Senior</Tab>
          <Tab>Donate in Medical Campaigns</Tab>
          <Tab>Donate to Virolife</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {requirements?.collection >= requirements?.threshold &&
            activeRound >= 1 ? (
              <TableContainer my={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>User</Th>
                      <Th>Group</Th>
                      <Th>Amount</Th>
                      <Th>Donated</Th>
                      <Th>Approved</Th>
                      <Th>Updated On</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {juniorsData?.slice(0, 20).map((data, key) => (
                      <Tr key={key}>
                        <Td>{key + 1}</Td>
                        <Td>
                          ({data?.receiver_id}) {data?.receiver_name}
                        </Td>
                        <Td>{data?.group}</Td>
                        <Td>{data?.amount}</Td>
                        <Td>
                          {data?.donated ? (
                            <BsCheckCircleFill color="green" />
                          ) : null}
                        </Td>
                        <Td>
                          {data?.donated && data?.approved ? (
                            <BsCheckCircleFill color="green" />
                          ) : null}
                        </Td>
                        <Td>{data?.approved ? data?.updated_at : null}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text p={8}>
                User has not collected ₹{requirements?.threshold}
              </Text>
            )}
          </TabPanel>

          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User</Th>
                    <Th>Amount</Th>
                    <Th>Approved</Th>
                    <Th>Updated On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {donationData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                      <Td>
                        ({data?.donatable_id}) {data?.user_name}
                      </Td>
                      <Td>₹{data?.amount}</Td>
                      <Td>
                        {data?.approved ? (
                          <BsCheckCircleFill color="green" />
                        ) : null}
                      </Td>
                      <Td>{data?.updated_at}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel>
            <TableContainer my={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>User</Th>
                    <Th>Group</Th>
                    <Th>Amount</Th>
                    <Th>Approved</Th>
                    <Th>Updated On</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {seniorsData?.map((data, key) => (
                    <Tr key={key}>
                      <Td>{key + 1}</Td>
                      <Td>
                        ({data?.user_id}) {data?.user_name}
                      </Td>
                      <Td>{data?.group}</Td>
                      <Td>{data?.amount}</Td>
                      <Td>
                        {data?.approved ? (
                          <BsCheckCircleFill color="red" />
                        ) : null}
                      </Td>
                      <Td>{data?.updated_at}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel>
            {requirements?.collection >= requirements?.threshold &&
            activeRound >= 1 ? (
              <TableContainer my={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Name</Th>
                      <Th>Phone Number</Th>
                      <Th>Campaign</Th>
                      <Th>Amount</Th>
                      <Th>Donated On</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {campaignsData?.map((data, key) => (
                      <Tr key={key}>
                        <Td>{key + 1}</Td>
                        <Td>{data?.name}</Td>
                        <Td>{data?.phone_number}</Td>
                        <Td>
                          ({data?.campaign_id}) {data?.title}
                        </Td>
                        <Td>₹ {data?.amount}</Td>
                        <Td>{data?.updated_at}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text p={8}>
                User has not collected ₹{requirements?.threshold}
              </Text>
            )}
          </TabPanel>

          <TabPanel>
            {requirements?.collection >= requirements?.threshold &&
            activeRound >= 1 ? (
              <TableContainer my={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Amount</Th>
                      <Th>Transaction ID</Th>
                      <Th>Timestamp</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {virolifeDonationData?.map((data, key) => (
                      <Tr key={key}>
                        <Td>{key + 1}</Td>
                        <Td>{Number(data?.amount)?.toFixed(2)}</Td>
                        <Td>{data?.transaction_id}</Td>
                        <Td>{data?.created_at}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text p={8}>
                User has not collected ₹{requirements?.threshold}
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default page;
