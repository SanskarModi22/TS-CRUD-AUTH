import mongoose, { Document, Model } from 'mongoose';

// User Interface
export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
}

// User Model
// Define the UserSchema using the User interface
const UserSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  username: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

// Create the UserModel based on the UserSchema
const UserModel: Model<User> = mongoose.model<User>('User', UserSchema);

// User Actions

// Function to get all users
export const getUsers = (): Promise<User[]> => UserModel.find().exec();

// Function to find a user by their email
export const getUserByEmail = (email: string) => UserModel.findOne({ email });



// Function to find a user by their session token
export const getUserBySessionToken = (sessionToken: string): Promise<User | null> =>
  UserModel.findOne({ 'authentication.sessionToken': sessionToken }).exec();

// Function to find a user by their ID
export const getUserById = (id: string): Promise<User | null> =>
  UserModel.findById(id).exec();

// Function to create a new user
export const createUser = (values: UserCreateInput): Promise<User> =>
  UserModel.create(values);

// Function to delete a user by their ID
export const deleteUserById = (id: string): Promise<User | null> =>
  UserModel.findOneAndDelete({ _id: id }).exec();

// Function to update a user by their ID
export const updateUserById = (id: string, values: Partial<User>): Promise<User | null> =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).exec();

// UserCreateInput Interface
// Interface representing the structure of input values for creating a user
interface UserCreateInput {
  email: string;
  username: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
}

// UserRole Enum
// Enum representing the possible roles a user can have
enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
}
