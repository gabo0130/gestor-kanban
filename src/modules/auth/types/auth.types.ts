export type LoginInput = {
	email: string;
	password: string;
};

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role?: UserRole;
};

export type UserRole = "Admin" | "Manager" | "Member" | (string & {});

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	role: UserRole;
};
