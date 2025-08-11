export type User = {
  id: number;
  department: Department;
  risk?: number;
};

export type Department = {
  id: number;
  name: string;
  userCount?: number;
};

export interface IGridProps {
  users: User[];
  loading?: boolean;
}
