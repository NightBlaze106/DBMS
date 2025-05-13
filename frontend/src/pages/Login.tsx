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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
      
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
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
            Welcome Back!
          </Heading>
          <Text color="gray.600">
            Track your habits, achieve your goals
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
                placeholder="Enter your password"
                size="lg"
                borderRadius="md"
              />
            </FormControl>

            <Button
              type="submit"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Logging in..."
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
            >
              Log In
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Don't have an account?{' '}
          <Link to="/register">
            <Text as="span" color="brand.500" fontWeight="bold">
              Sign up
            </Text>
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login; 