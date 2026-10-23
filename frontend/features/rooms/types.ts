export type RoomRole = "ADMIN" | "USER";

export type RoomListItem = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  role: RoomRole;
};

export type RoomMember = {
  roomId: string;
  userId: string;
  role: RoomRole;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type RoomWithMembers = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  members: RoomMember[];
};
