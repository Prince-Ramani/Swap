import { Response, Request } from "express";
import {
  hashPassword,
  validatePasswordStrength,
  verfiyPassword,
} from "../services/validatePassword";
import User from "../models/userModel";
import { createToken, verifyToken } from "../services/JWT";

interface userInterface {
  username: string;
  password: string;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: userInterface = req.body;

    if (
      !username ||
      username.trim().length < 3 ||
      username.trim().length > 12
    ) {
      res
        .status(400)
        .json({ error: "A username must be between 3 to 12 characters!" });
      return;
    }

    const userAlreadyExist = await User.exists({ username });

    if (userAlreadyExist) {
      res.status(400).json({ error: "Account with username already exists." });
      return;
    }

    if (!password) {
      res.status(400).json({ error: "Password required." });
      return;
    }

    const validPassword = validatePasswordStrength(password);

    if (validPassword.valid === false) {
      res.status(400).json({ error: validPassword.message });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    const token = createToken(newUser._id.toString());

    res.cookie("user", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 24 * 30,
    });

    res.status(202).json({ message: "Account created successfully." });
    return;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred in signup controller:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("Unknown error occurred in signup controller:", err);
    }
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: userInterface = req.body;

    if (!password) {
      res.status(400).json({ error: "Password required!" });
      return;
    }

    const person = await User.findOne({ username });

    if (!person) {
      res
        .status(404)
        .json({ error: "Account with this Username is not registered." });
      return;
    }

    const validPassword = await verfiyPassword(password, person.password);

    if (!validPassword) {
      res.status(400).json({ error: "Incorrect password." });
      return;
      Number;
    }

    const token = createToken(person._id.toString());

    res.cookie("user", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 24 * 30,
    });

    res.status(200).json({ message: "Loggedin successfully." });
    return;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred in signin controller:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("Unknown error occurred in signin controller:", err);
    }
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

export const logout = async (_: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("user");
    res.status(200).json({ message: "Logout successfull" });
  } catch (err) {
    console.log("Error in logout controller in authController.ts file", err);
    res.status(500).json({ error: "Internal server error!" });
    return;
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = req.user;

    if (!userID) {
      res.status(401).json({ error: "Cookies not found!" });
      return;
    }

    const person = await User.findById(userID).select("-password").lean();

    if (!person) {
      res.status(400).json({ error: "No such account such account found!" });
      return;
    }

    res.status(200).json(person);
    return;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred in getMe controller:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("Unknown error occurred in getMe controller:", err);
    }
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};
