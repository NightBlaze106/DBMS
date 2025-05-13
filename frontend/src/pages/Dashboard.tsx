import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  HStack,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Icon,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaCheckCircle, FaPlus, FaFire, FaTrophy, FaCalendarCheck, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface Habit {
  _id: string;
  name: string;
  streak: number;
  completion_dates: string[];
}

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The secret of getting ahead is getting started.",
  "Small progress is still progress.",
  "Habits are the compound interest of self-improvement.",
  "Every day is a new beginning. Take a deep breath and start again."
];

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Set a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const fetchHabits = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8000/api/habits/', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (Array.isArray(response.data)) {
        setHabits(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      let errorMessage = 'Could not fetch habits';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.detail && typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a habit name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get user_id from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.user_id;

      const response = await axios.post(
        'http://localhost:8000/api/habits/',
        {
          name: newHabitName.trim(),
          user_id: userId,
          streak: 0,
          completion_dates: []
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Habit created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        onClose();
        setNewHabitName('');
        await fetchHabits();
      }
    } catch (error: any) {
      console.error('Error creating habit:', error);
      
      let errorMessage = 'Could not create habit';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.detail && typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalStreak = () => {
    return habits.reduce((total, habit) => total + habit.streak, 0);
  };

  const getCompletedToday = () => {
    return habits.filter(habit => isHabitCompletedToday(habit.completion_dates)).length;
  };

  const getHighestStreak = () => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(habit => habit.streak));
  };

  const handleMarkHabit = async (habitId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/habits/${habitId}/done`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the habits list with the new streak and completion dates
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId 
            ? { 
                ...habit, 
                streak: response.data.streak,
                completion_dates: [...habit.completion_dates, new Date().toISOString().split('T')[0]]
              } 
            : habit
        )
      );
      
      toast({
        title: 'Success',
        description: `Habit marked as complete. Streak: ${response.data.streak}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error marking habit:', error);
      let errorMessage = 'Could not mark habit as complete';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isHabitCompletedToday = (dates: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    return dates.some(date => date.startsWith(today));
  };

  const handleEditHabit = async (habitId: string, newName: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/habits/${habitId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId 
            ? { ...habit, name: newName } 
            : habit
        )
      );
      
      toast({
        title: 'Success',
        description: 'Habit name updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
    } catch (error: any) {
      console.error('Error updating habit:', error);
      let errorMessage = 'Could not update habit';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8000/api/habits/${habitId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
      
      toast({
        title: 'Success',
        description: 'Habit deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      let errorMessage = 'Could not delete habit';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" bg="white" p={8} borderRadius="xl" boxShadow="lg">
          <Heading color="brand.500" mb={4}>
            My Habit Dashboard
          </Heading>
          <Text color="gray.600" fontSize="lg" fontStyle="italic" mb={6}>
            "{quote}"
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={8}>
            <Stat bg="brand.50" p={4} borderRadius="lg">
              <StatLabel>Total Habits</StatLabel>
              <StatNumber>{habits.length}</StatNumber>
              <StatHelpText>
                <Icon as={FaCalendarCheck} mr={2} />
                Active Tracking
              </StatHelpText>
            </Stat>
            
            <Stat bg="green.50" p={4} borderRadius="lg">
              <StatLabel>Completed Today</StatLabel>
              <StatNumber>{getCompletedToday()}</StatNumber>
              <StatHelpText>
                <Icon as={FaCheckCircle} mr={2} />
                Daily Progress
              </StatHelpText>
            </Stat>
            
            <Stat bg="orange.50" p={4} borderRadius="lg">
              <StatLabel>Highest Streak</StatLabel>
              <StatNumber>{getHighestStreak()}</StatNumber>
              <StatHelpText>
                <Icon as={FaFire} mr={2} />
                Best Performance
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Flex justify="center" my={6}>
          <Button
            leftIcon={<FaPlus />}
            onClick={onOpen}
            colorScheme="brand"
            size="lg"
            maxW="200px"
            boxShadow="md"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Add New Habit
          </Button>
        </Flex>

        <Grid
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={6}
          mt={8}
        >
          {habits.map((habit) => (
            <Box
              key={habit._id}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              position="relative"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <Flex 
                justify="space-between" 
                align="center" 
                mb={4} 
                position="relative"
                zIndex="dropdown"
              >
                <Heading size="md" color="gray.700" pr={2}>
                  {habit.name}
                </Heading>
                <HStack spacing={2}>
                  <IconButton
                    icon={<FaEdit />}
                    variant="ghost"
                    size="sm"
                    colorScheme="gray"
                    aria-label="Edit habit"
                    onClick={() => {
                      setEditingHabit(habit);
                      onEditOpen();
                    }}
                    _hover={{ bg: 'gray.100' }}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    variant="ghost"
                    size="sm"
                    colorScheme="red"
                    aria-label="Delete habit"
                    onClick={() => handleDeleteHabit(habit._id)}
                    _hover={{ bg: 'red.50' }}
                  />
                </HStack>
              </Flex>
              
              <VStack align="stretch" spacing={4} position="relative" zIndex="base">
                <Box bg="gray.50" p={4} borderRadius="md">
                  <Text color="gray.500" mb={2} fontSize="sm">
                    Current Streak
                  </Text>
                  <HStack spacing={2} align="center">
                    <Icon as={FaFire} color="orange.500" w={6} h={6} />
                    <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                      {habit.streak}
                    </Text>
                    <Text color="gray.500">days</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text color="gray.500" mb={2} fontSize="sm">
                    Weekly Progress
                  </Text>
                  <Progress
                    value={habit.streak % 7}
                    max={7}
                    colorScheme="brand"
                    borderRadius="full"
                    size="lg"
                    hasStripe
                  />
                </Box>

                <Button
                  onClick={() => handleMarkHabit(habit._id)}
                  colorScheme={isHabitCompletedToday(habit.completion_dates) ? 'green' : 'brand'}
                  leftIcon={<FaCheckCircle />}
                  isDisabled={isHabitCompletedToday(habit.completion_dates)}
                  size="lg"
                  _hover={{
                    transform: 'scale(1.02)',
                  }}
                >
                  {isHabitCompletedToday(habit.completion_dates)
                    ? 'Completed Today'
                    : 'Mark Complete'}
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Habit</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleCreateHabit}>
              <FormControl isRequired>
                <FormLabel>Habit Name</FormLabel>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  size="lg"
                />
              </FormControl>
              <Button
                mt={6}
                colorScheme="brand"
                type="submit"
                isLoading={isLoading}
                width="full"
                size="lg"
              >
                Create Habit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Habit</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingHabit) {
                handleEditHabit(editingHabit._id, editingHabit.name);
              }
            }}>
              <FormControl isRequired>
                <FormLabel>Habit Name</FormLabel>
                <Input
                  value={editingHabit?.name || ''}
                  onChange={(e) => setEditingHabit(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter habit name"
                  size="lg"
                />
              </FormControl>
              <Button
                mt={6}
                colorScheme="brand"
                type="submit"
                width="full"
                size="lg"
              >
                Update Habit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard; 