export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export type Admin = {
  id: string;
  id_Company: string;
  id_User: string;
};

export type Agent_Service = {
  id: string;
  id_Agent: string;
  id_Service: string;
};

export type Agent ={
  id: string;
  id_User: string;
  id_Company: string;
};

export type Client ={
  id: string;
  name: string;
  email: string;
  is_Guest: boolean;
  id_User: string | null;
};

export type Company = {
  id: string;
  name: string;
  address: string;
  rental: string;
  contact: string;
  type: string;
};

export type Guichet ={
  id: string;
  name: string;
  number: number;
  id_Agent: string;
  id_Company: string;
};

export type Queue_Entry = {
  id: string;
  current_Position: number;
  status: string;
  arrival_Time: string;
  exit_Time: string | null;
  id_Queue: string;
  id_Client: string;
};

export type Queue = {
  id: string;
  is_Active: boolean;
  id_Guichet: string;
  id_Service: string;
  id_Company: string;
  waitingTime: string;
  nbrPeopleWaiting: number;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  id_Company: string;
};