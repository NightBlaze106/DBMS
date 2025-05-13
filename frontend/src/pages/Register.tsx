import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Image,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:8000/api/auth/signup', {
        username,
        email,
        password,
      });

      toast({
        title: 'Account created successfully!',
        description: 'Please log in with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create account. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Image
            src="/logo.jpg"
            alt="Habit Tracker Logo"
            boxSize="100px"
            mx="auto"
            mb={4}
          />
          <Heading size="xl" color="brand.500" mb={2}>
            Create Account
          </Heading>
          <Text color="gray.600">
            Start your journey to better habits today
          </Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                size="lg"
                borderRadius="md"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                borderRadius="md"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                size="lg"
                borderRadius="md"
              />
            </FormControl>

            <Button
              type="submit"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Creating account..."
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Already have an account?{' '}
          <Link to="/login">
            <Text as="span" color="brand.500" fontWeight="bold">
              Log in
            </Text>
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 