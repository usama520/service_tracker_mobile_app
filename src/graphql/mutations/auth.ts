import { gql } from "@apollo/client";

export type User = {
  id: string;
  email: string;
  name?: string | null;
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
  };
};

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// Register
export type RegisterVariables = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  register: {
    token: string;
    user: User;
  };
};

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(input: { name: $name, email: $email, password: $password }) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;


