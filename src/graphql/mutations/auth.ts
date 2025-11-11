import { gql } from "@apollo/client";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
};

// Login
export type LoginVariables = {
  email: string;
  password: string;
};

export type LoginResponse = {
  login: {
    token: string;
    user: User;
    errors: string[];
  };
};

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        phone
      }
      errors
    }
  }
`;

// Register
export type RegisterVariables = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
};

export type RegisterResponse = {
  register: {
    token: string;
    user: User;
    errors: string[];
  };
};

export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
    $firstName: String!
    $lastName: String!
    $phone: String
  ) {
    register(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      firstName: $firstName
      lastName: $lastName
      phone: $phone
    ) {
      token
      user {
        id
        email
        firstName
        lastName
        phone
      }
      errors
    }
  }
`;


